import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LatestInputDto {
  @ApiProperty({ example: 'sleep' })
  category!: string;

  @ApiProperty({ example: 'Sleep quality is improving.' })
  summary!: string;

  @ApiProperty({ example: '2025-12-27T10:00:00.000Z' })
  timestamp!: string;
}

export class RecommendUserContextDto {
  @ApiProperty({ example: 'u-1000' })
  id!: string;

  @ApiProperty({ example: ['sleep'] })
  focusAreas!: string[];

  @ApiProperty({ example: 'UTC' })
  timezone!: string;
}

export class RecommendRequestDto {
  @ApiProperty({ type: RecommendUserContextDto })
  userContext!: RecommendUserContextDto;

  @ApiProperty({ type: [LatestInputDto] })
  latestInputs!: LatestInputDto[];
}

export class RecommendationContextDto {
  @ApiProperty({ example: 'rag-1' })
  id!: string;

  @ApiProperty({ example: 'Mindful Micro-Break Protocol' })
  title!: string;

  @ApiProperty({
    example:
      'Guided sequence for three daily micro-breaks to reset stress pathways during intensive work blocks.',
  })
  snippet!: string;

  @ApiProperty({ example: 'https://knowledge.wellsync.ai/micro-breaks' })
  sourceUrl!: string;

  @ApiProperty({ example: ['stress-management', 'mental_wellness'] })
  focusAreas!: string[];

  @ApiProperty({ example: ['breathing', 'micro-breaks', 'workday'] })
  tags!: string[];

  @ApiProperty({ example: 6 })
  relevanceScore!: number;

  @ApiProperty({ example: 'foundational', enum: ['foundational', 'advanced'] })
  relevance!: 'foundational' | 'advanced';

  @ApiPropertyOptional({
    example:
      'Screen for dizziness before mobility exercises; stop if discomfort occurs.',
  })
  safetyNotes?: string;

  @ApiPropertyOptional({ example: '2025-12-27T10:00:00.000Z' })
  lastValidated?: string;
}

export class RecommendationDto {
  @ApiProperty({ example: 'Personalized plan for sleep' })
  headline!: string;

  @ApiProperty({
    example:
      'Recommendations synthesized from recent wellness inputs and Gemini-aligned RAG sources.',
  })
  rationale!: string;

  @ApiProperty({
    example: [
      'Apply "Evening Wind-Down Breathwork" guidance focused on sleep.',
      'Maintain hydration cadence of 250ml per hour during work blocks.',
      'Schedule a mid-week self check-in to evaluate energy and mood trends.',
    ],
  })
  actions!: string[];

  @ApiProperty({ example: 'medium', enum: ['low', 'medium', 'high'] })
  confidence!: 'low' | 'medium' | 'high';

  @ApiProperty({ type: [RecommendationContextDto] })
  supportingContexts!: RecommendationContextDto[];

  @ApiPropertyOptional({
    example:
      'This plan supports general wellness education and should not be treated as medical advice.',
  })
  caution?: string;
}

export class ExplainRequestDto {
  @ApiProperty({ example: 'Personalized plan for sleep' })
  recommendationHeadline!: string;

  @ApiProperty({ example: 'sleep' })
  areaOfFocus!: string;
}

export class ResourceArticleDto {
  @ApiProperty({ example: 'rag-1' })
  id!: string;

  @ApiProperty({ example: 'Mindful Micro-Break Protocol' })
  title!: string;

  @ApiProperty({
    example:
      'Guided sequence for three daily micro-breaks to reset stress pathways during intensive work blocks.',
  })
  summary!: string;

  @ApiProperty({ example: 'https://knowledge.wellsync.ai/micro-breaks' })
  url!: string;

  @ApiProperty({ example: 'foundational', enum: ['foundational', 'advanced'] })
  relevance!: 'foundational' | 'advanced';

  @ApiProperty({ example: ['stress-management', 'mental_wellness'] })
  focusAreas!: string[];

  @ApiProperty({ example: ['breathing', 'micro-breaks', 'workday'] })
  tags!: string[];

  @ApiPropertyOptional({
    example:
      'Screen for dizziness before mobility exercises; stop if discomfort occurs.',
  })
  safetyNotes?: string;

  @ApiPropertyOptional({ example: '2025-12-27T10:00:00.000Z' })
  lastValidated?: string;
}
