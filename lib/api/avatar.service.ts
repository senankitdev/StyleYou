import { Avatar, Profile } from '../types';

export async function createAvatar(
  profile: Profile,
  photo: File
): Promise<Avatar> {
  const formData = new FormData();
  formData.append('photo', photo);
  formData.append('profile', JSON.stringify(profile));

  const response = await fetch('/api/avatar/create', {
    method: 'POST',
    body: formData,
  });

  const { data, error } = await response.json();
  if (error) {
    throw new Error(error.message || 'Failed to create avatar');
  }

  return {
    avatarId: data.avatarId,
    faceUrl: data.faceUrl,
    bodyUrl: data.bodyUrl,
    profile,
    photoUrl: URL.createObjectURL(photo),
    createdAt: new Date().toISOString(),
  };
}

export async function deleteMyData(): Promise<void> {
  const response = await fetch('/api/user/data', {
    method: 'DELETE',
  });

  const { error } = await response.json();
  if (error) {
    throw new Error(error.message || 'Failed to delete data');
  }
}
