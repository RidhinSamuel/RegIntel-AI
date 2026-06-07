import { useState, useRef, useCallback, type JSX, type DragEvent, type KeyboardEvent } from "react";
import { uploadDocument } from "../../api/uploadApi";
import "./ChatModal.css";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps): JSX.Element | null {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── File handling ──────────────────────────────────────
  const handleFileSelect = useCallback((selected: File) => {
    setFile(selected);
    setUploadStatus("idle");
    setUploadMessage("");
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFileSelect(dropped);
    },
    [handleFileSelect]
  );

  const handleUploadSubmit = useCallback(async () => {
    if (!file) return;
    setUploadStatus("uploading");
    try {
      const res = await uploadDocument(file);
      setUploadStatus("success");
      setUploadMessage(res.message ?? "File uploaded successfully");
    } catch (err) {
      setUploadStatus("error");
      setUploadMessage(err instanceof Error ? err.message : "Upload failed");
    }
  }, [file]);

  // ── Chat ───────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isAiTyping) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsAiTyping(true);

    // Scroll to bottom
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    try {
      // TODO: replace with real query API when backend is ready
      await new Promise((r) => setTimeout(r, 1200));
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        content:
          uploadStatus === "success"
            ? `Based on the uploaded document, here is what I found regarding "${text}":\n\nThis is a placeholder response. Connect the /api/query endpoint to get real answers from your PDF.`
            : "Please upload a compliance document first so I can answer your question.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsAiTyping(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [inputValue, isAiTyping, uploadStatus]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  // Auto-resize textarea
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="chat-modal__backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="RegAI Chat Interface"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="chat-modal__panel">

        {/* ── Header ── */}
        <div className="chat-modal__header">
          <div className="chat-modal__header-left">
            <span className="chat-modal__logo">Reg<span>AI</span></span>
            <div className="chat-modal__status">
              <span className="chat-modal__status-dot" />
              Ready
            </div>
          </div>
          <button
            className="chat-modal__close"
            onClick={onClose}
            aria-label="Close chat"
            id="chat-modal-close-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="chat-modal__body">

          {/* LEFT: Upload sidebar */}
          <aside className="chat-modal__sidebar" aria-label="Document upload">
            <p className="chat-modal__sidebar-title">Document</p>

            {!file ? (
              <div
                className={`upload-zone${isDragOver ? " upload-zone--dragover" : ""}`}
                role="button"
                tabIndex={0}
                aria-label="Upload compliance document"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="upload-zone__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="upload-zone__text">
                  <strong>Click to upload</strong> or drag &amp; drop
                </p>
                <p className="upload-zone__hint">PDF, DOC up to 50MB</p>
                <input
                  ref={fileInputRef}
                  className="upload-zone__input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  aria-label="Select file to upload"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                />
              </div>
            ) : (
              <>
                <div className="uploaded-file">
                  <div className="uploaded-file__icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <span className="uploaded-file__name" title={file.name}>{file.name}</span>
                  <button
                    className="uploaded-file__remove"
                    onClick={() => { setFile(null); setUploadStatus("idle"); setUploadMessage(""); }}
                    aria-label="Remove file"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <button
                  className="upload-submit-btn"
                  onClick={handleUploadSubmit}
                  disabled={uploadStatus === "uploading" || uploadStatus === "success"}
                  id="upload-submit-btn"
                >
                  {uploadStatus === "uploading" ? "Uploading…" :
                    uploadStatus === "success" ? "✓ Uploaded" : "Upload Document"}
                </button>

                {uploadMessage && (
                  <p className={`upload-status ${uploadStatus === "success" ? "upload-status--success" : "upload-status--error"}`}>
                    {uploadMessage}
                  </p>
                )}
              </>
            )}
          </aside>

          {/* RIGHT: Chat */}
          <div className="chat-modal__chat">
            <div className="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
              {messages.length === 0 && !isAiTyping ? (
                <div className="chat-empty">
                  <div className="chat-empty__icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <p className="chat-empty__title">Ask a compliance question</p>
                  <p className="chat-empty__hint">
                    {uploadStatus === "success"
                      ? "Your document is ready. Start asking!"
                      : "Upload a PDF first, then ask anything about it."}
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`chat-message chat-message--${msg.role}`}>
                      <span className="chat-message__sender">
                        {msg.role === "user" ? "You" : "RegAI"}
                      </span>
                      <div className="chat-message__bubble">{msg.content}</div>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="chat-message chat-message--ai">
                      <span className="chat-message__sender">RegAI</span>
                      <div className="chat-typing">
                        <span className="chat-typing__dot" />
                        <span className="chat-typing__dot" />
                        <span className="chat-typing__dot" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input bar */}
            <div className="chat-input-bar" role="group" aria-label="Message input">
              <textarea
                ref={textareaRef}
                id="chat-input-textarea"
                className="chat-input-bar__textarea"
                rows={1}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your compliance document…"
                aria-label="Type your message"
                disabled={isAiTyping}
              />
              <button
                id="chat-send-btn"
                className="chat-input-bar__send"
                onClick={sendMessage}
                disabled={!inputValue.trim() || isAiTyping}
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
