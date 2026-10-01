import { TryOnResult } from '../types';

export async function saveLook(result: TryOnResult): Promise<void> {
  const response = await fetch(`/api/looks/${result.resultId}/save`, {
    method: 'POST',
  });

  const { error } = await response.json();
  if (error) {
    throw new Error(error.message || 'Failed to save look');
  }
}

export async function getSavedLooks(): Promise<TryOnResult[]> {
  const response = await fetch('/api/looks', {
    method: 'GET',
  });

  const { data, error } = await response.json();
  if (error) {
    throw new Error(error.message || 'Failed to get saved looks');
  }

  return data.looks;
}

export async function deleteSavedLook(resultId: string): Promise<void> {
  const response = await fetch(`/api/looks/${resultId}/save`, {
    method: 'DELETE',
  });

  const { error } = await response.json();
  if (error) {
    throw new Error(error.message || 'Failed to delete saved look');
  }
}
