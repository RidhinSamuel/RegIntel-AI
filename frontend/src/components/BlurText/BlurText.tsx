import { useEffect, useRef, useState, type CSSProperties } from 'react';

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const completedCount = useRef(0);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleTransitionEnd = (index: number) => {
    if (index === elements.length - 1) {
      // Small debounce: only fire once when the LAST element finishes
      completedCount.current++;
      if (completedCount.current === 1) {
        onAnimationComplete?.();
      }
    }
  };

  const yOffset = direction === 'top' ? -30 : 30;

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((segment, index) => {
        const delayMs = (index * delay) / 1000;

        const baseStyle: CSSProperties = {
          display: 'inline-block',
          willChange: 'transform, filter, opacity',
          transition: `transform ${stepDuration}s ease ${delayMs}s, filter ${stepDuration}s ease ${delayMs}s, opacity ${stepDuration}s ease ${delayMs}s`,
        };

        const hiddenStyle: CSSProperties = {
          ...baseStyle,
          filter: 'blur(10px)',
          opacity: 0,
          transform: `translateY(${yOffset}px)`,
        };

        const visibleStyle: CSSProperties = {
          ...baseStyle,
          filter: 'blur(0px)',
          opacity: 1,
          transform: 'translateY(0px)',
        };

        return (
          <span
            key={index}
            style={inView ? visibleStyle : hiddenStyle}
            onTransitionEnd={
              index === elements.length - 1
                ? () => handleTransitionEnd(index)
                : undefined
            }
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </span>
        );
      })}
    </p>
  );
};

export default BlurText;
