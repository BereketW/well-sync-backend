import { Injectable } from '@nestjs/common';
import { RagDocument, RagQuery, RagResult } from './rag.types';

const MAX_RESULTS = 3;

@Injectable()
export class RagService {
  private readonly documents: RagDocument[] = [
    {
      id: 'rag-1',
      title: 'Mindful Micro-Break Protocol',
      focusAreas: ['stress-management', 'mental_wellness'],
      tags: ['breathing', 'micro-breaks', 'workday'],
      summary:
        'Guided sequence for three daily micro-breaks to reset stress pathways during intensive work blocks.',
      content:
        'Schedule three 5-minute pauses: (1) box breathing, (2) shoulder mobility, (3) gratitude reflection. Each micro-break lowers cortisol and maintains cognitive flexibility.',
      sourceUrl: 'https://knowledge.wellsync.ai/micro-breaks',
      relevance: 'foundational',
      safetyNotes:
        'Screen for dizziness before mobility exercises; stop if discomfort occurs.',
    },
    {
      id: 'rag-2',
      title: 'Stabilizing Afternoon Energy via Nutrition',
      focusAreas: ['nutrition', 'energy'],
      tags: ['macronutrients', 'blood sugar', 'meal-timing'],
      summary:
        'Combining protein, fiber, and healthy fats buffers glucose swings that trigger fatigue.',
      content:
        'Add balanced snacks (e.g., Greek yogurt + walnuts + berries) 90 minutes before anticipated energy dips. Maintain hydration at 250ml per hour.',
      sourceUrl: 'https://knowledge.wellsync.ai/energy-balance',
      relevance: 'advanced',
      safetyNotes:
        'Consult a clinician for individuals managing diabetes or metabolic disorders.',
    },
    {
      id: 'rag-3',
      title: 'Evening Wind-Down Breathwork',
      focusAreas: ['sleep', 'mental_wellness'],
      tags: ['breathwork', 'sleep hygiene'],
      summary:
        '4-7-8 breathing shifts the autonomic nervous system toward parasympathetic dominance to prepare for sleep.',
      content:
        'Practice 4-7-8 breathing for 5 cycles immediately before lights out. Pair with low-light journaling to offload intrusive thoughts.',
      sourceUrl: 'https://knowledge.wellsync.ai/478-breathing',
      relevance: 'foundational',
      safetyNotes:
        'Pause if hyperventilation symptoms occur. Not a substitute for clinical treatment of sleep disorders.',
    },
  ];

  private counter = this.documents.length;

  query(query: RagQuery, maxResults: number = MAX_RESULTS): RagResult[] {
    const combinedSummary = query.latestInputSummaries.join(' ').toLowerCase();

    const scored = this.documents.map((doc) => {
      const focusMatches = doc.focusAreas.filter((area) =>
        query.focusAreas.includes(area),
      ).length;
      const tagMatches = doc.tags.filter((tag) =>
        combinedSummary.includes(tag.toLowerCase()),
      ).length;
      const summaryMatches = query.latestInputSummaries.filter((entry) =>
        doc.summary.toLowerCase().includes(entry.toLowerCase()),
      ).length;

      const relevanceScore = focusMatches * 3 + tagMatches * 2 + summaryMatches;

      return {
        document: doc,
        relevanceScore,
      };
    });

    return scored
      .filter((entry) => entry.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults)
      .map((entry) => ({
        documentId: entry.document.id,
        title: entry.document.title,
        snippet: entry.document.summary,
        sourceUrl: entry.document.sourceUrl,
        focusAreas: entry.document.focusAreas,
        tags: entry.document.tags,
        safetyNotes: entry.document.safetyNotes,
        relevanceScore: entry.relevanceScore,
        relevance: entry.document.relevance,
      }));
  }

  listDocuments(): RagDocument[] {
    return this.documents;
  }

  addDocument(document: Omit<RagDocument, 'id'>): RagDocument {
    this.counter += 1;
    const record: RagDocument = {
      ...document,
      id: `rag-${this.counter}`,
    };
    this.documents.push(record);
    return record;
  }
}
