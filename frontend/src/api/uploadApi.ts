// src/api/uploadApi.ts

export async function uploadDocument(
  file: File
): Promise<any> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail?.message || "Upload failed"
    );
  }

  return data;
}