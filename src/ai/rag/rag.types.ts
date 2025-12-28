export interface RagDocument {
  id: string;
  title: string;
  focusAreas: string[];
  tags: string[];
  summary: string;
  content: string;
  sourceUrl: string;
  relevance: 'foundational' | 'advanced';
  safetyNotes?: string;
}

export interface RagQuery {
  focusAreas: string[];
  latestInputSummaries: string[];
}

export interface RagResult {
  documentId: string;
  title: string;
  snippet: string;
  sourceUrl: string;
  focusAreas: string[];
  tags: string[];
  safetyNotes?: string;
  relevanceScore: number;
  relevance: 'foundational' | 'advanced';
}
