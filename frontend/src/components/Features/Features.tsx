import type { JSX } from "react";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import "./Features.css";

// 1. Upload Visual Component (Step 1)
function UploadVisual(): JSX.Element {
  return (
    <div className="visual-container upload-visual">
      <div className="upload-visual__box">
        <div className="upload-visual__pulse-circle" />
        <div className="upload-visual__doc-icon">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M8 13h8" />
            <path d="M8 17h8" />
            <path d="M8 9h2" />
          </svg>
        </div>
        <div className="upload-visual__details">
          <span className="upload-visual__name">gdpr_audit.pdf</span>
          <div className="upload-visual__bar">
            <div className="upload-visual__fill" />
          </div>
          <span className="upload-visual__percentage">Analyzing... 85%</span>
        </div>
      </div>
    </div>
  );
}

// 2. Ask Visual Component (Step 2)
function AskVisual(): JSX.Element {
  return (
    <div className="visual-container ask-visual">
      <div className="ask-visual__chat">
        {/* User Question */}
        <div className="ask-visual__bubble user">
          <div className="ask-visual__text">
            <span>What are the compliance requirements?</span>
            <span className="ask-visual__cursor" />
          </div>
        </div>
        
        {/* AI response typing state */}
        <div className="ask-visual__bubble ai">
          <div className="ask-visual__ai-badge">AI</div>
          <div className="ask-visual__skeleton">
            <div className="ask-visual__skeleton-line" />
            <div className="ask-visual__skeleton-line short" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Answer Visual Component (Step 3)
function AnswerVisual(): JSX.Element {
  return (
    <div className="visual-container answer-visual">
      <div className="answer-visual__card">
        {/* Document lines with animated highlight */}
        <div className="answer-visual__doc-header">
          <div className="answer-visual__dot red" />
          <div className="answer-visual__dot yellow" />
          <div className="answer-visual__dot green" />
          <span className="answer-visual__doc-title">GDPR Article 5</span>
        </div>
        <div className="answer-visual__lines">
          <div className="answer-visual__line" />
          <div className="answer-visual__line highlight">
            <div className="answer-visual__glow-overlay" />
          </div>
          <div className="answer-visual__line" />
          <div className="answer-visual__line short" />
        </div>

        {/* Citation bubble */}
        <div className="answer-visual__citation">
          <svg className="answer-visual__citation-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Sec. 1(e) • Page 14</span>
        </div>

        {/* Grounded Badge */}
        <div className="answer-visual__grounded-badge">
          <div className="answer-visual__grounded-dot" />
          <span>100% Grounded</span>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    step: "Step 01",
    title: "Upload Your PDF",
    description:
      "Drop in any regulatory compliance document — GDPR, HIPAA, SEC filings, internal policies. RegAI accepts it all.",
    color: "#f0f6ff",
    darkColor: "#0f1e35",
  },
  {
    step: "Step 02",
    title: "Ask Any Question",
    description:
      "Type questions in plain English. Ask things like 'What are the data retention requirements?' and RegAI understands context, not just keywords.",
    color: "#f5f0ff",
    darkColor: "#1a0f35",
  },
  {
    step: "Step 03",
    title: "Get Precise Answers",
    description:
      "Receive grounded, document-backed answers instantly. No hallucinations — every response is sourced directly from your PDF.",
    color: "#f0fff5",
    darkColor: "#0f3520",
  },
];

export default function Features(): JSX.Element {
  return (
    <section className="features" id="features" aria-labelledby="features-title">
      <div className="features__inner">

        {/* Header */}
        <div className="features__header">
          <p className="features__label">How it works</p>
          <h2 className="features__title" id="features-title">
            Three steps to compliance clarity
          </h2>
          <p className="features__subtitle">
            From document to insight in seconds — no training required.
          </p>
        </div>

        {/* ScrollStack — cards stack as you scroll */}
        <div className="features__scroll-wrapper">
          <ScrollStack
            useWindowScroll={true}
            itemDistance={48}
            itemScale={0.04}
            itemStackDistance={20}
            stackPosition="15%"
            baseScale={0.88}
          >
            {FEATURES.map((feature) => (
              <ScrollStackItem
                key={feature.step}
                itemClassName="feature-stack-card"
              >
                <div className="feature-stack-card__inner">
                  {/* Top visual illustration area */}
                  <div className="feature-stack-card__visual">
                    {feature.step === "Step 01" && <UploadVisual />}
                    {feature.step === "Step 02" && <AskVisual />}
                    {feature.step === "Step 03" && <AnswerVisual />}
                  </div>

                  {/* Bottom content area */}
                  <div className="feature-stack-card__content">
                    <div className="feature-stack-card__meta">
                      <span className="feature-stack-card__step">{feature.step}</span>
                      <span className="feature-stack-card__dot" />
                    </div>
                    <h3 className="feature-stack-card__title">{feature.title}</h3>
                    <p className="feature-stack-card__description">{feature.description}</p>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>

      </div>
    </section>
  );
}
