import { useMutation } from 'convex/react';
import { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

import { uploadImageToConvex } from '@/lib/upload-image';
import { api } from '@convex/_generated/api';

export type ProfileImageType = 'avatar' | 'brandLogo' | 'coverImage';

const FIELD = { avatar: 'avatarUrl', brandLogo: 'brandLogoUrl', coverImage: 'coverImageUrl' } as const;

/** Pick a photo, upload it to Convex storage and attach it to the signed-in user's profile. */
export function useProfileImageUpload() {
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const [uploading, setUploading] = useState<ProfileImageType | null>(null);

  const pickAndUpload = async (type: ProfileImageType) => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    setUploading(type);
    try {
      const uploadUrl = await generateUploadUrl();
      const storageId = await uploadImageToConvex(uploadUrl, { uri: asset.uri, type: asset.type });
      await updateUserProfile({ [FIELD[type]]: storageId });
      Toast.show({ type: 'success', text1: 'Photo updated' });
    } catch {
      Toast.show({ type: 'error', text1: 'Upload failed' });
    } finally {
      setUploading(null);
    }
  };

  return { uploading, pickAndUpload };
}
