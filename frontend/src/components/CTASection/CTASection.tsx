import { useRef, useEffect, useState, type JSX } from "react";
import "./CTASection.css";

interface CTASectionProps {
  onTryClick: () => void;
}

const TITLE_TEXT = "Ask your first compliance question";
const DESC_TEXT =
  "Upload a regulatory PDF and start asking. No account needed, no setup — just instant, AI-powered compliance answers.";

export default function CTASection({ onTryClick }: CTASectionProps): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const [titleChars, setTitleChars] = useState(0);
  const [descChars, setDescChars] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Typing animation driven by requestAnimationFrame for smooth performance
  useEffect(() => {
    if (!hasStarted) return;

    let titleIdx = 0;
    let descIdx = 0;
    let phase: "title" | "desc" | "button" | "done" = "title";
    let lastTime = 0;
    const TITLE_SPEED = 28; // ms per char
    const DESC_SPEED = 12;  // ms per char (faster for description)
    let rafId: number;

    const tick = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;

      if (phase === "title") {
        if (delta >= TITLE_SPEED) {
          titleIdx++;
          setTitleChars(titleIdx);
          lastTime = time;
          if (titleIdx >= TITLE_TEXT.length) {
            phase = "desc";
            lastTime = time + 200; // small pause before description
          }
        }
      } else if (phase === "desc") {
        if (delta >= DESC_SPEED) {
          descIdx++;
          setDescChars(descIdx);
          lastTime = time;
          if (descIdx >= DESC_TEXT.length) {
            phase = "button";
            lastTime = time;
          }
        }
      } else if (phase === "button") {
        if (delta >= 300) {
          setShowButton(true);
          phase = "done";
        }
      }

      if (phase !== "done") {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [hasStarted]);

  const titleVisible = TITLE_TEXT.slice(0, titleChars);
  const titleHidden = TITLE_TEXT.slice(titleChars);
  const descVisible = DESC_TEXT.slice(0, descChars);
  const descHidden = DESC_TEXT.slice(descChars);

  return (
    <section
      className="cta-section"
      id="try"
      aria-labelledby="cta-title"
      ref={sectionRef}
    >
      <div className="cta-section__inner">
        <p className={`cta-section__label ${hasStarted ? "cta-section__label--visible" : ""}`}>
          Ready to start?
        </p>

        <h2 className="cta-section__title" id="cta-title">
          <span className="cta-typed">{titleVisible}</span>
          <span className="cta-hidden">{titleHidden}</span>
          {titleChars > 0 && titleChars < TITLE_TEXT.length && (
            <span className="cta-cursor" />
          )}
        </h2>

        <p className="cta-section__description">
          <span className="cta-typed">{descVisible}</span>
          <span className="cta-hidden">{descHidden}</span>
          {descChars > 0 && descChars < DESC_TEXT.length && (
            <span className="cta-cursor cta-cursor--small" />
          )}
        </p>

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
    </section>
  );
}
