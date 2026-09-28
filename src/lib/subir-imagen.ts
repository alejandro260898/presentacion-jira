import { upload } from "@vercel/blob/client";
import { IMAGE_TYPES, type ImageMime } from "@/lib/diapositiva";

export async function uploadToBlob(personId: string, name: string, file: File) {
  const extension = IMAGE_TYPES[file.type as ImageMime];
  if (!extension) throw new Error("Usa una imagen PNG, JPG, WEBP o GIF.");
  const blob = await upload(`presentaciones/${personId}/${name}.${extension}`, file, {
    access: "public",
    handleUploadUrl: "/api/imagenes",
    contentType: file.type,
  });
  return blob.url;
}
