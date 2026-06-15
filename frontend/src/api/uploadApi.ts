// src/api/uploadApi.ts

/**
 * Interface representing the backend response format for a file upload.
 */
export interface UploadResponse {
  /** Indicates if the file upload and processing job queueing succeeded. */
  success: boolean;
  /** Explanatory status message from the server. */
  message: string;
  /** Transaction status code. */
  code: string;
}

/**
 * Sends a POST request to upload a document to the backend API.
 *
 * @param {File} file - The file object to upload (must be a PDF).
 * @returns {Promise<UploadResponse>} A promise resolving to the upload response.
 * @throws {Error} If the HTTP response is not ok or an error message is returned.
 */
export async function uploadDocument(
  file: File
): Promise<UploadResponse> {
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

  return data as UploadResponse;
}