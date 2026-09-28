import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/diapositiva";

const allowedPath = /^presentaciones\/[a-z0-9-]+\/[a-zA-Z0-9-]+\.(png|jpg|webp|gif)$/;

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!allowedPath.test(pathname)) throw new Error("Ruta de imagen no válida.");
        return {
          allowedContentTypes: Object.keys(IMAGE_TYPES),
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true,
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo subir la imagen." }, { status: 400 });
  }
}
