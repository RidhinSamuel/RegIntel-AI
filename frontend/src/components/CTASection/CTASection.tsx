import type { JSX } from "react";
import "./CTASection.css";

interface CTASectionProps {
  onTryClick: () => void;
}

export default function CTASection({ onTryClick }: CTASectionProps): JSX.Element {
  return (
    <section className="cta-section" id="try" aria-labelledby="cta-title">
      <div className="cta-section__inner">
        <p className="cta-section__label">Ready to start?</p>
        <h2 className="cta-section__title" id="cta-title">
          Ask your first<br />compliance question
        </h2>
        <p className="cta-section__description">
          Upload a regulatory PDF and start asking. No account needed,
          no setup — just instant, AI-powered compliance answers.
        </p>
        <button
          id="cta-try-regai-btn"
          className="cta-section__btn"
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
    </section>
  );
}
