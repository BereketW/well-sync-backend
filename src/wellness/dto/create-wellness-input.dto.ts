export interface CreateWellnessInputDto {
  timestamp: string;
  category: 'sleep' | 'nutrition' | 'activity' | 'mood' | 'stress';
  summary: string;
  metrics: Record<string, number | string>;
  notes?: string;
}
