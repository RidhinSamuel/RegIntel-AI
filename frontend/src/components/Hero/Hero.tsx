import { useRef, useCallback, useEffect, useState, type JSX } from "react";
import "./Hero.css";

interface HeroProps {
  onTryClick: () => void;
}

export default function Hero({ onTryClick }: HeroProps): JSX.Element {
  const heroRef = useRef<HTMLElement>(null);
  const [chatStep, setChatStep] = useState(0);

  useEffect(() => {
    // Phase 0: User message slides in
    // Phase 1: Retrieval searches (after 1.2s)
    // Phase 2: Typing indicator shown (after 2s)
    // Phase 3: Bot answer appears (after 3.8s)
    const timers = [
      setTimeout(() => setChatStep(1), 1200),
      setTimeout(() => setChatStep(2), 2000),
      setTimeout(() => setChatStep(3), 3800),
    ];

    const interval = setInterval(() => {
      setChatStep(0);
      timers[0] = setTimeout(() => setChatStep(1), 1200);
      timers[1] = setTimeout(() => setChatStep(2), 2000);
      timers[2] = setTimeout(() => setChatStep(3), 3800);
    }, 9000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--spotlight-x", `${x}px`);
    el.style.setProperty("--spotlight-y", `${y}px`);
    el.style.setProperty("--spotlight-opacity", "1");
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.setProperty("--spotlight-opacity", "0");
  }, []);

  return (
    <section
      className="hero"
      id="hero"
      aria-labelledby="hero-title"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight glow overlay */}
      <div className="hero__spotlight" aria-hidden="true" />

      <div className="hero__inner">

        {/* ── LEFT: Content ── */}
        <div className="hero__content">

          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Powered by RAG
          </div>

          {/* Big brand name */}
          <div className="hero__brand">
            Reg<span className="hero__title-ai">AI</span><span className="hero__title-spark">✦</span>
          </div>

          <h1 className="hero__title" id="hero-title">
            Know Your<br />
            Compliance.<br />
            Ask Reg<span className="hero__title-ai">AI</span>.
          </h1>

          <p className="hero__description">
            Upload any regulatory PDF and ask questions in plain English.
            RegAI reads, understands, and answers — instantly.
          </p>

          <button
            id="hero-try-regai-btn"
            className="hero__cta"
            onClick={onTryClick}
            aria-label="Open RegAI chat interface"
          >
            Try RegAI — it&apos;s free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          <div className="hero__stats" aria-label="Key statistics">
            <div className="hero__stat">
              <span className="hero__stat-value">PDF</span>
              <span className="hero__stat-label">Upload ready</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">RAG</span>
              <span className="hero__stat-label">AI-powered search</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">∞</span>
              <span className="hero__stat-label">Questions to ask</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Abstract Geometric Visual — Glassmorphism Card ── */}
        <div className="hero__visual" aria-hidden="true">
          {/* Decorative gradient blobs behind the glass */}
          <div className="hero__blob hero__blob--1" />
          <div className="hero__blob hero__blob--2" />
          <div className="hero__blob hero__blob--3" />

          {/* Glassmorphism panel */}
          <div className="hero__glass-panel">
            <div className="hero-bot">
              {/* Bot Header */}
              <div className="hero-bot__header">
                <div className="hero-bot__avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                  <span className="hero-bot__status" />
                </div>
                <div className="hero-bot__header-info">
                  <span className="hero-bot__name">RegAI Compliance Bot</span>
                  <span className="hero-bot__status-text">Online • Grounded in source docs</span>
                </div>
              </div>

              {/* Bot Chat Area */}
              <div className="hero-bot__chat">
                {/* User Message */}
                <div className={`hero-bot__msg hero-bot__msg--user ${chatStep >= 0 ? "visible" : ""}`}>
                  <div className="hero-bot__msg-bubble">
                    Does our marketing draft comply with GDPR data retention limits?
                  </div>
                </div>

                {/* Grounded Retrieval Step */}
                {chatStep >= 1 && (
                  <div className="hero-bot__retrieval animate-fade-in">
                    <span className="hero-bot__retrieval-icon">🔍</span>
                    <span className="hero-bot__retrieval-text">Searching gdpr_regulation.pdf...</span>
                  </div>
                )}

                {/* Typing Indicator (shown in step 2, hidden in step 3) */}
                {chatStep === 2 && (
                  <div className="hero-bot__msg hero-bot__msg--bot animate-fade-in">
                    <div className="hero-bot__msg-bubble hero-bot__msg-bubble--typing">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                )}

                {/* Bot Message (shown in step 3) */}
                {chatStep >= 3 && (
                  <div className="hero-bot__msg hero-bot__msg--bot animate-slide-up">
                    <div className="hero-bot__msg-bubble">
                      <p>Under <strong>GDPR Article 5(1)(e)</strong>, personal data must be stored for no longer than necessary.</p>
                      <p>Your draft policy of 5 years is compliant, provided you have explicit consent.</p>
                      <div className="hero-bot__citation">
                        <span className="hero-bot__citation-tag">GDPR Art. 5(1)(e) • Page 12</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
