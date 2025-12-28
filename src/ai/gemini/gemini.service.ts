import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerativeModel } from '@google/generative-ai';
import { googleContentToMarkdown } from './utils';
import type { RecommendationContext } from '../ai.types';

const DEFAULT_MODEL = 'gemini-2.5-flash';

export interface GeminiRecommendationPrompt {
  areaOfFocus: string;
  summaries: string[];
  contexts: RecommendationContext[];
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  constructor() {}

  async generateRecommendation(
    prompt: GeminiRecommendationPrompt,
  ): Promise<string> {
    const model = this.getModel();
    const promptText = this.buildRecommendationPrompt(prompt);

    try {
      const result = await model.generateContent(promptText);
      const text = googleContentToMarkdown(result.response);
      if (!text) {
        throw new Error('Gemini response did not include any text parts.');
      }
      return text;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Failed to generate Gemini content', err);
      throw err;
    }
  }

  private getModel(): GenerativeModel {
    if (this.model) {
      return this.model;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'GEMINI_API_KEY is not set. Configure it in your environment to enable AI endpoints.',
      );
    }

    const modelName = process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
    return this.model;
  }

  private buildRecommendationPrompt(
    prompt: GeminiRecommendationPrompt,
  ): string {
    const { areaOfFocus, summaries, contexts } = prompt;

    const inputsSection = summaries
      .map((summary, index) => `${index + 1}. ${summary}`)
      .join('\n');

    const contextSection = contexts
      .map(
        (context, index) =>
          `${index + 1}. ${context.title}\n   Focus Areas: ${context.focusAreas.join(', ')}\n   Tags: ${context.tags.join(', ')}\n   Rationale: ${context.snippet}\n   Safety: ${context.safetyNotes ?? 'Standard wellness precautions.'}\n   Source: ${context.sourceUrl}`,
      )
      .join('\n\n');

    return `You are Well-Sync's wellness AI assistant powered by Gemini. Adhere to non-diagnostic wellness guidance, respect ethical guardrails, and cite sources.

User Area of Focus: ${areaOfFocus}

Recent Wellness Inputs:
${inputsSection || 'No recent inputs provided.'}

Retrieved Knowledge Context:
${contextSection || 'No external context found. Default to general wellness best practices while staying non-diagnostic.'}

Tasks:
1. Produce a headline summarizing the personalized plan.
2. Provide rationale referencing the retrieved context.
3. List 3 concise actionable steps that respect safety guidance.
4. Suggest a cautionary note clarifying wellness vs. clinical boundaries.

Output JSON with the shape:
{
  "headline": string,
  "rationale": string,
  "actions": string[],
  "caution": string
}
`;
  }
}
