import { useRef, useEffect, useState, type JSX } from "react";
import BlurText from "../BlurText/BlurText";
import "./CTASection.css";

interface CTASectionProps {
  onTryClick: () => void;
}

export default function CTASection({ onTryClick }: CTASectionProps): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [hasStarted]);

  return (
    <section
      className="cta-section"
      id="try"
      aria-labelledby="cta-title"
      ref={sectionRef}
    >
      <div className="cta-section__inner">

        {/* ── LEFT: Text Content ── */}
        <div className="cta-section__left">
          <p className={`cta-section__label ${hasStarted ? "cta-section__label--visible" : ""}`}>
            Ready to start?
          </p>

          <BlurText
            text="Ask your first compliance question"
            delay={80}
            animateBy="words"
            direction="bottom"
            className="cta-section__title"
            stepDuration={0.4}
            onAnimationComplete={() => setShowButton(true)}
          />

          <BlurText
            text="Upload a regulatory PDF and start asking. No account needed, no setup — just instant, AI-powered compliance answers."
            delay={30}
            animateBy="words"
            direction="bottom"
            className="cta-section__description"
            stepDuration={0.3}
          />

          <button
            id="cta-try-regai-btn"
            className={`cta-section__btn ${showButton ? "cta-section__btn--visible" : ""}`}
            onClick={onTryClick}
            aria-label="Open RegAI chat interface"
          >
            Open RegAI
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>

        {/* ── RIGHT: RAG Pipeline Visual ── */}
        <div className="cta-section__right" aria-hidden="true">
          <div className="cta-glass-card">

            {/* RAG Pipeline Header */}
            <div className="cta-rag__header">
              <div className="cta-rag__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.57-3.25 3.93a1 1 0 0 0-.75.97V13" />
                  <path d="M12 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                  <path d="M12 17v2" />
                  <path d="M4 10h2" />
                  <path d="M18 10h2" />
                  <path d="M6.34 6.34l1.42 1.42" />
                  <path d="M16.24 7.76l1.42-1.42" />
                </svg>
              </div>
              <span className="cta-rag__title">RAG Pipeline</span>
            </div>

            {/* Step 1: Document Chunk */}
            <div className="cta-rag__step">
              <div className="cta-rag__step-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="cta-rag__step-content">
                <span className="cta-rag__step-label">Document Chunked</span>
                <span className="cta-rag__step-detail">gdpr_audit.pdf → 128 chunks</span>
              </div>
              <div className="cta-rag__check">✓</div>
            </div>

            {/* Connector */}
            <div className="cta-rag__connector" />

            {/* Step 2: Embeddings */}
            <div className="cta-rag__step">
              <div className="cta-rag__step-icon cta-rag__step-icon--purple">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12l2 2 4-4" />
                </svg>
              </div>
              <div className="cta-rag__step-content">
                <span className="cta-rag__step-label">Vectors Embedded</span>
                <span className="cta-rag__step-detail">Semantic search ready</span>
              </div>
              <div className="cta-rag__check">✓</div>
            </div>

            {/* Connector */}
            <div className="cta-rag__connector" />

            {/* Step 3: LLM Response */}
            <div className="cta-rag__step cta-rag__step--active">
              <div className="cta-rag__step-icon cta-rag__step-icon--green">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="cta-rag__step-content">
                <span className="cta-rag__step-label">LLM Answering</span>
                <span className="cta-rag__step-detail">Grounded in source docs</span>
              </div>
              <div className="cta-rag__pulse" />
            </div>

            {/* Answer preview */}
            <div className="cta-rag__answer">
              <div className="cta-rag__answer-label">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                AI Response
              </div>
              <div className="cta-rag__answer-text">
                Under GDPR Article 5(1)(e), personal data must be kept in a form that permits identification for no longer than necessary...
              </div>
              <div className="cta-rag__answer-source">
                <span className="cta-rag__source-dot" />
                Cited from Sec. 5(1)(e) • Page 14
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
