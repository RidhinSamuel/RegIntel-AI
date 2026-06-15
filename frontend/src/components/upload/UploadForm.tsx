import { useState, type JSX } from "react";
import { uploadDocument } from "../../api/uploadApi";

/**
 * UploadForm Component.
 * Renders a simple localized card overlay providing file input select control
 * and upload submit button with loading/status messages.
 *
 * @returns {JSX.Element} The rendered UploadForm.
 */
function UploadForm(): JSX.Element {
  // Local state for the selected file object
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Local state representing the current uploading API call status
  const [loading, setLoading] = useState<boolean>(false);

  // Local state storing status/error feedback message strings
  const [message, setMessage] = useState<string>("");

  /**
   * Submits the selected file to the document upload endpoint.
   * Updates loading and feedback messages appropriately.
   *
   * @returns {Promise<void>} A promise resolving when the request finishes.
   */
  async function handleUpload(): Promise<void> {
    if (!selectedFile) {
      setMessage("Please select a file");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const response = await uploadDocument(selectedFile);
      setMessage(response.message);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Upload failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        w-full
        max-w-md
        rounded-xl
        border
        border-zinc-700
        bg-zinc-900
        p-6
        shadow-lg
      "
    >
      <h1
        className="
          mb-6
          text-center
          text-3xl
          font-bold
          text-white
        "
      >
        RegIntel AI
      </h1>

      <input
        type="file"
        accept=".pdf,.doc,.docs"
        onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
        className="
          mb-4
          w-full
          rounded-md
          border
          border-zinc-600
          bg-zinc-800
          p-2
          text-white
        "
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="
          w-full
          rounded-md
          bg-white
          px-4
          py-2
          font-semibold
          text-black
          transition
          hover:bg-zinc-200
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading ? "Uploading..." : "Upload Document"}
      </button>

      {message && (
        <p
          className="
            mt-4
            text-center
            text-sm
            text-white
          "
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default UploadForm;

