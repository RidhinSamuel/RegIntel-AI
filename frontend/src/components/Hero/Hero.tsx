import { useRef, useCallback, type JSX } from "react";
import "./Hero.css";

interface HeroProps {
  onTryClick: () => void;
}

export default function Hero({ onTryClick }: HeroProps): JSX.Element {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = contentRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--spotlight-x", `${x}px`);
    el.style.setProperty("--spotlight-y", `${y}px`);
    el.style.setProperty("--spotlight-opacity", "1");
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    el.style.setProperty("--spotlight-opacity", "0");
  }, []);

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero__inner">

        {/* ── LEFT: Content with mouse spotlight ── */}
        <div
          className="hero__content"
          ref={contentRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Spotlight glow overlay */}
          <div className="hero__spotlight" aria-hidden="true" />

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
            <svg
              className="hero__visual-svg"
              viewBox="0 0 480 480"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid lines */}
              {[80, 160, 240, 320, 400].map((x) => (
                <line key={`v${x}`} className="hero-grid-line" x1={x} y1="0" x2={x} y2="480" />
              ))}
              {[80, 160, 240, 320, 400].map((y) => (
                <line key={`h${y}`} className="hero-grid-line" x1="0" y1={y} x2="480" y2={y} />
              ))}

              {/* Outer circle */}
              <circle className="hero-circle" cx="240" cy="240" r="180" />
              {/* Rotating dashed circle */}
              <circle className="hero-circle hero-circle--inner" cx="240" cy="240" r="120" />
              {/* Inner solid circle */}
              <circle className="hero-circle" cx="240" cy="240" r="60" />

              {/* Document card — center */}
              <rect className="hero-doc-card" x="180" y="195" width="120" height="90" rx="6" />
              <line className="hero-doc-line" x1="198" y1="218" x2="282" y2="218" />
              <line className="hero-doc-line--short" x1="198" y1="232" x2="260" y2="232" />
              <line className="hero-doc-line--short" x1="198" y1="246" x2="272" y2="246" />
              <line className="hero-doc-line--short" x1="198" y1="260" x2="250" y2="260" />

              {/* Connector dots */}
              <circle className="hero-node" cx="240" cy="120" r="5" />
              <circle className="hero-node" cx="360" cy="240" r="5" />
              <circle className="hero-node" cx="240" cy="360" r="5" />
              <circle className="hero-node" cx="120" cy="240" r="5" />

              {/* Connector lines from doc to dots */}
              <line className="hero-connector" x1="240" y1="195" x2="240" y2="125" />
              <line className="hero-connector" x1="300" y1="240" x2="355" y2="240" />
              <line className="hero-connector" x1="240" y1="285" x2="240" y2="355" />
              <line className="hero-connector" x1="180" y1="240" x2="125" y2="240" />

              {/* Small corner dots */}
              <circle className="hero-node--muted" cx="80" cy="80" r="3" fill="var(--border-default)" />
              <circle className="hero-node--muted" cx="400" cy="80" r="3" fill="var(--border-default)" />
              <circle className="hero-node--muted" cx="80" cy="400" r="3" fill="var(--border-default)" />
              <circle className="hero-node--muted" cx="400" cy="400" r="3" fill="var(--border-default)" />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
