import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RagService } from './rag/rag.service';
import { GeminiService } from './gemini/gemini.service';
import type {
  RecommendRequest,
  Recommendation,
  RecommendationContext,
  ExplainRequest,
  ResourceArticle,
  GeminiRecommendationPayload,
} from './ai.types';
import type { RagResult } from './rag/rag.types';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ragService: RagService,
    private readonly geminiService: GeminiService,
  ) {}

  async createRecommendation(
    request: RecommendRequest,
  ): Promise<Recommendation> {
    const focus = request.userContext.focusAreas[0] ?? 'overall balance';
    const contexts = this.buildRecommendationContext(request);
    const geminiPlan = await this.requestGeminiPlan(focus, request, contexts);

    return {
      headline: geminiPlan.headline,
      rationale: geminiPlan.rationale,
      actions: geminiPlan.actions,
      confidence: contexts.length >= 2 ? 'high' : 'medium',
      supportingContexts: contexts,
      caution: geminiPlan.caution,
    };
  }

  explainRecommendation(request: ExplainRequest): string {
    const contexts = this.ragService.query({
      focusAreas: [request.areaOfFocus],
      latestInputSummaries: [],
    });

    if (contexts.length === 0) {
      return `The recommendation "${request.recommendationHeadline}" reinforces ${request.areaOfFocus} as a core wellness theme aligned with Gemini guardrails.`;
    }

    const topContext = contexts[0];
    return `The recommendation "${request.recommendationHeadline}" emphasizes ${request.areaOfFocus} because supporting context titled "${topContext.title}" links recent engagement patterns with evidence-based practices (${topContext.sourceUrl}). Safety guidance: ${topContext.safetyNotes ?? 'follow standard wellness precautions.'}`;
  }

  async listResources(): Promise<ResourceArticle[]> {
    const articles = await this.prisma.resourceArticle.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      summary: article.summary,
      url: article.url,
      relevance: article.relevance as ResourceArticle['relevance'],
      focusAreas: article.focusAreas,
      tags: article.tags,
      safetyNotes: article.safetyNotes ?? undefined,
      lastValidated:
        article.lastValidated?.toISOString() ?? new Date().toISOString(),
    }));
  }

  async addResource(
    resource: Omit<ResourceArticle, 'id'>,
  ): Promise<ResourceArticle> {
    // Create in database for persistence
    const article = await this.prisma.resourceArticle.create({
      data: {
        title: resource.title,
        summary: resource.summary,
        url: resource.url,
        relevance: resource.relevance,
        focusAreas: resource.focusAreas,
        tags: resource.tags,
        safetyNotes: resource.safetyNotes,
        lastValidated: resource.lastValidated
          ? new Date(resource.lastValidated)
          : new Date(),
      },
    });

    // Also add to RAG service for in-memory retrieval
    this.ragService.addDocument({
      title: article.title,
      focusAreas: article.focusAreas,
      tags: article.tags,
      summary: article.summary,
      content: article.summary,
      sourceUrl: article.url,
      relevance: article.relevance as 'foundational' | 'advanced',
      safetyNotes: article.safetyNotes ?? undefined,
    });

    return {
      id: article.id,
      title: article.title,
      summary: article.summary,
      url: article.url,
      relevance: article.relevance as ResourceArticle['relevance'],
      focusAreas: article.focusAreas,
      tags: article.tags,
      safetyNotes: article.safetyNotes ?? undefined,
      lastValidated:
        article.lastValidated?.toISOString() ?? new Date().toISOString(),
    };
  }

  private buildRecommendationContext(
    request: RecommendRequest,
  ): RecommendationContext[] {
    const summaries = request.latestInputs.map(
      (input) => `${input.category}: ${input.summary}`,
    );

    const results = this.ragService.query({
      focusAreas: request.userContext.focusAreas,
      latestInputSummaries: summaries,
    });

    return results.map((result) => this.mapRagResultToContext(result));
  }

  private deriveActionsFromContexts(
    contexts: RecommendationContext[],
    focus: string,
  ): string[] {
    if (contexts.length === 0) {
      return [
        `Capture a daily note on ${focus} to expand Gemini context for future recommendations.`,
        'Schedule a mid-week self check-in to evaluate energy and mood trends.',
        'Maintain hydration cadence of 250ml per hour during work blocks.',
      ];
    }

    return contexts.slice(0, 3).map((context) => {
      const tagPhrase = context.tags.slice(0, 2).join(', ');
      return `Apply "${context.title}" guidance focused on ${
        context.focusAreas[0] ?? focus
      } (tags: ${tagPhrase || 'holistic'}). Review safety notes: ${
        context.safetyNotes ?? 'standard wellness precautions'
      }.`;
    });
  }

  private async requestGeminiPlan(
    focus: string,
    request: RecommendRequest,
    contexts: RecommendationContext[],
  ): Promise<GeminiRecommendationPayload> {
    try {
      const summaries = request.latestInputs.map(
        (input) => `${input.category}: ${input.summary}`,
      );

      const response = await this.geminiService.generateRecommendation({
        areaOfFocus: focus,
        summaries,
        contexts,
      });

      const jsonString = this.extractJsonObject(response);
      if (!jsonString) {
        throw new BadGatewayException(
          'Gemini response did not contain a JSON payload.',
        );
      }

      const parsed = JSON.parse(jsonString) as GeminiRecommendationPayload;
      if (
        !parsed.headline ||
        !parsed.rationale ||
        !Array.isArray(parsed.actions) ||
        parsed.actions.length === 0
      ) {
        throw new BadGatewayException(
          'Gemini JSON payload was missing required fields.',
        );
      }
      return parsed;
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Unknown Gemini error';
      this.logger.error(`Gemini recommendation failed: ${message}`);
      throw new ServiceUnavailableException(
        'Gemini recommendation service is unavailable. Verify GEMINI_API_KEY and try again.',
      );
    }
  }

  private mapRagResultToContext(result: RagResult): RecommendationContext {
    return {
      id: result.documentId,
      title: result.title,
      snippet: result.snippet,
      sourceUrl: result.sourceUrl,
      focusAreas: result.focusAreas,
      tags: result.tags,
      relevanceScore: result.relevanceScore,
      relevance: result.relevance,
      safetyNotes: result.safetyNotes,
      lastValidated: new Date().toISOString(),
    };
  }

  private extractJsonObject(responseText: string): string | null {
    const start = responseText.indexOf('{');
    const end = responseText.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      return null;
    }
    return responseText.slice(start, end + 1);
  }
}
