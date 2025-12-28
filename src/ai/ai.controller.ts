import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import type { Recommendation } from './ai.types';
import {
  ExplainRequestDto,
  RecommendationDto,
  RecommendRequestDto,
  ResourceArticleDto,
} from './dto/ai.dto';

@ApiTags('AI')
@ApiBearerAuth('bearer')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('recommend')
  @ApiBody({
    type: RecommendRequestDto,
    examples: {
      sample: {
        summary: 'Request AI recommendation',
        value: {
          userContext: { id: 'u-1000', focusAreas: ['sleep'], timezone: 'UTC' },
          latestInputs: [
            {
              category: 'sleep',
              summary: 'Sleep quality is improving.',
              timestamp: '2025-12-27T10:00:00.000Z',
            },
          ],
        },
      },
    },
  })
  @ApiOkResponse({
    type: RecommendationDto,
    schema: {
      example: {
        headline: 'Personalized plan for sleep',
        rationale:
          'Recommendations synthesized from recent wellness inputs and Gemini-aligned RAG sources.',
        actions: [
          'Apply "Evening Wind-Down Breathwork" guidance focused on sleep.',
          'Maintain hydration cadence of 250ml per hour during work blocks.',
          'Schedule a mid-week self check-in to evaluate energy and mood trends.',
        ],
        confidence: 'medium',
        supportingContexts: [
          {
            id: 'rag-3',
            title: 'Evening Wind-Down Breathwork',
            snippet:
              '4-7-8 breathing shifts the autonomic nervous system toward parasympathetic dominance to prepare for sleep.',
            sourceUrl: 'https://knowledge.wellsync.ai/478-breathing',
            focusAreas: ['sleep', 'mental_wellness'],
            tags: ['breathwork', 'sleep hygiene'],
            relevanceScore: 6,
            relevance: 'foundational',
            safetyNotes:
              'Pause if hyperventilation symptoms occur. Not a substitute for clinical treatment of sleep disorders.',
            lastValidated: '2025-12-27T10:00:00.000Z',
          },
        ],
        caution:
          'This plan supports general wellness education and should not be treated as medical advice.',
      },
    },
  })
  async recommend(
    @Body() payload: RecommendRequestDto,
  ): Promise<Recommendation> {
    return this.aiService.createRecommendation(payload);
  }

  @Post('explain')
  @ApiBody({
    type: ExplainRequestDto,
    examples: {
      sample: {
        summary: 'Explain recommendation rationale',
        value: {
          recommendationHeadline: 'Personalized plan for sleep',
          areaOfFocus: 'sleep',
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      example:
        'The recommendation "Personalized plan for sleep" emphasizes sleep because supporting context titled "Evening Wind-Down Breathwork" links recent engagement patterns with evidence-based practices (https://knowledge.wellsync.ai/478-breathing).',
    },
  })
  explain(@Body() payload: ExplainRequestDto): string {
    return this.aiService.explainRecommendation(payload);
  }

  @Get('resources')
  @ApiOkResponse({
    type: [ResourceArticleDto],
    schema: {
      example: [
        {
          id: 'rag-1',
          title: 'Mindful Micro-Break Protocol',
          summary:
            'Guided sequence for three daily micro-breaks to reset stress pathways during intensive work blocks.',
          url: 'https://knowledge.wellsync.ai/micro-breaks',
          relevance: 'foundational',
          focusAreas: ['stress-management', 'mental_wellness'],
          tags: ['breathing', 'micro-breaks', 'workday'],
          safetyNotes:
            'Screen for dizziness before mobility exercises; stop if discomfort occurs.',
          lastValidated: '2025-12-27T10:00:00.000Z',
        },
      ],
    },
  })
  async listResources(): Promise<ResourceArticleDto[]> {
    return this.aiService.listResources();
  }
}
