import type { GenerateContentResponse } from '@google/generative-ai';

export function googleContentToMarkdown(
  response: GenerateContentResponse | undefined,
): string {
  if (!response?.candidates?.length) {
    return '';
  }

  const chunks: string[] = [];

  for (const candidate of response.candidates) {
    const parts = candidate.content?.parts ?? [];
    for (const part of parts) {
      if ('text' in part && part.text) {
        chunks.push(part.text);
      }
    }
  }

  return chunks.join('\n').trim();
}
