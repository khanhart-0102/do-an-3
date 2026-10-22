import { join } from "path";

export const PDF_ASSIGNMENT_MAX_FILE_SIZE = 15 * 1024 * 1024;

export const PDF_ASSIGNMENT_UPLOAD_DIRECTORY = join(
  process.cwd(),
  "private-data",
  "pdf-assignment-submissions"
);

export async function getSubmittedFileExtension(
  file: File
): Promise<string | null> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (
    file.type === "application/pdf" &&
    bytes.length >= 5 &&
    String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-"
  ) {
    return ".pdf";
  }

  if (
    file.type === "image/jpeg" &&
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return ".jpg";
  }

  if (
    file.type === "image/png" &&
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    String.fromCharCode(...bytes.slice(1, 4)) === "PNG"
  ) {
    return ".png";
  }

  if (
    file.type === "image/webp" &&
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return ".webp";
  }

  return null;
}

export function isSafeStoredFileName(fileName: string): boolean {
  return /^[0-9a-f-]{36}\.(pdf|jpg|png|webp)$/i.test(fileName);
}

export function getSafeOriginalFileName(fileName: string): string {
  return fileName
    .split(/[\\/]/)
    .pop()
    ?.replace(/[\u0000-\u001f\u007f]/g, "")
    .slice(0, 180) || "bai-lam";
}
