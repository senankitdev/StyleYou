import { TryOnResult } from '../types';

export async function generateTryOn(
  avatarId: string,
  dressImageUrl: string
): Promise<TryOnResult> {
  const response = await fetch('/api/tryon/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatarId, dressImageUrl }),
  });

  const { data, error } = await response.json();
  if (error) {
    throw new Error(error.message || 'Failed to generate try-on result');
  }

  return {
    resultId: data.resultId,
    resultUrl: data.resultUrl,
    estimatedSize: data.estimatedSize,
    fitNotes: '', // The backend stores fitNotes but we can fetch them via GET if needed
    dressItem: {
      id: '',
      imageUrl: dressImageUrl,
      name: 'Try-On Dress',
      source: 'sample', // Placeholder until fetched full
    },
    createdAt: new Date().toISOString(),
  };
}
