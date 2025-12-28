export interface LatestInput {
  category: string;
  summary: string;
  timestamp: string;
}

export interface RecommendRequest {
  userContext: {
    id: string;
    focusAreas: string[];
    timezone: string;
  };
  latestInputs: LatestInput[];
}

export interface RecommendationContext {
  id: string;
  title: string;
  snippet: string;
  sourceUrl: string;
  focusAreas: string[];
  tags: string[];
  relevanceScore: number;
  relevance: 'foundational' | 'advanced';
  safetyNotes?: string;
  lastValidated?: string;
}

export interface Recommendation {
  headline: string;
  rationale: string;
  actions: string[];
  confidence: 'low' | 'medium' | 'high';
  supportingContexts: RecommendationContext[];
  caution?: string;
}

export interface ExplainRequest {
  recommendationHeadline: string;
  areaOfFocus: string;
}

export interface ResourceArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  relevance: 'foundational' | 'advanced';
  focusAreas: string[];
  tags: string[];
  safetyNotes?: string;
  lastValidated?: string;
}

export interface GeminiRecommendationPayload {
  headline: string;
  rationale: string;
  actions: string[];
  caution: string;
}
