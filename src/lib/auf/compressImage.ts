/**
 * Shrinks a photographed attachment before it is uploaded.
 *
 * The upload itself is what customers wait for: the backend answers an
 * attachment in about half a second, while a 1MB phone photo on a weak mobile
 * uplink takes ten or more to arrive. A camera photo of an ID card carries far
 * more pixels than the bank needs, so re-encoding it at a sane size turns that
 * into a second or two.
 *
 * It never makes a file worse: anything that is not an image, a browser that
 * cannot decode it, or a result no smaller than the original all return the
 * file untouched.
 */

/** Long edge kept, in pixels. Small print on an ID stays legible at this size. */
const MAX_EDGE = 2000;

/** JPEG quality. High enough that a signature keeps its thin strokes. */
const QUALITY = 0.85;

/** Below this, the transfer is already short and re-encoding earns nothing. */
const SKIP_UNDER_BYTES = 300 * 1024;

export async function compressImage(file: File): Promise<File> {
  if (typeof window === "undefined") return file;
  // PDFs are documents, not photographs, and must arrive byte for byte.
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= SKIP_UNDER_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;

    context.imageSmoothingQuality = "high";
    // A photo has no transparency to keep, and JPEG needs an opaque ground.
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: file.lastModified });
  } catch {
    // An unreadable format (HEIC on some browsers) simply goes up as it is.
    return file;
  }
}
