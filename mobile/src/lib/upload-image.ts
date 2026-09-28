/**
 * Uploads a locally-picked image to Convex file storage and returns the
 * resulting storageId, using the same generateUploadUrl → POST → storageId
 * flow the web app uses (see convex/users.ts's `generateUploadUrl`).
 */
export async function uploadImageToConvex(
  uploadUrl: string,
  asset: { uri: string; type?: string },
): Promise<string> {
  const fileResponse = await fetch(asset.uri);
  const blob = await fileResponse.blob();

  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': asset.type || 'image/jpeg' },
    body: blob,
  });
  const { storageId } = await uploadResponse.json();
  return storageId;
}
