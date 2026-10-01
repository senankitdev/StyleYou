import { DressItem } from '../types';

export async function importDress(url: string): Promise<DressItem> {
  const response = await fetch('/api/dress/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const { data, error } = await response.json();
  if (error) {
    throw new Error(error.message || 'Failed to import dress link');
  }

  return {
    id: data.dressId,
    imageUrl: data.dressImageUrl,
    name: 'Imported Dress',
    source: 'link',
    originalUrl: url,
  };
}

export async function uploadDress(file: File): Promise<DressItem> {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch('/api/dress/upload', {
    method: 'POST',
    body: formData,
  });

  const { data, error } = await response.json();
  if (error) {
    throw new Error(error.message || 'Failed to upload dress');
  }

  return {
    id: data.dressId,
    imageUrl: data.dressImageUrl,
    name: 'Uploaded Dress',
    source: 'upload',
  };
}
