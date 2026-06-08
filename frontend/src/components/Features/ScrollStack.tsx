import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    }}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, any>());
  const isUpdatingRef = useRef(false);

  // Cached positions to prevent layout thrashing (getBoundingClientRect / offsetTop) on scroll
  const cardTopsRef = useRef<number[]>([]);
  const cardHeightsRef = useRef<number[]>([]);
  const endElementTopRef = useRef<number>(0);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : 0,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  // Measures static, untranslated layout positions of the cards and the end element
  const measureOffsets = useCallback(() => {
    if (!cardsRef.current.length) return;

    // 1. Temporarily clear transforms so we get clean untranslated positions
    const savedTransforms = cardsRef.current.map(card => card ? card.style.transform : '');
    cardsRef.current.forEach(card => {
      if (card) {
        card.style.transform = 'none';
        card.style.webkitTransform = 'none';
      }
    });

    // 2. Measure layout positions
    const newCardTops: number[] = [];
    const newCardHeights: number[] = [];
    cardsRef.current.forEach(card => {
      if (!card) {
        newCardTops.push(0);
        newCardHeights.push(0);
        return;
      }
      newCardHeights.push(card.offsetHeight || 0);
      if (useWindowScroll) {
        const rect = card.getBoundingClientRect();
        newCardTops.push(rect.top + window.scrollY);
      } else {
        newCardTops.push(card.offsetTop);
      }
    });

    let newEndElementTop = 0;
    const endElement = useWindowScroll
      ? (document.querySelector('.scroll-stack-end') as HTMLElement | null)
      : (scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement | null);

    if (endElement) {
      if (useWindowScroll) {
        const rect = endElement.getBoundingClientRect();
        newEndElementTop = rect.top + window.scrollY;
      } else {
        newEndElementTop = endElement.offsetTop;
      }
    }

    // 3. Restore transforms
    cardsRef.current.forEach((card, i) => {
      if (card && savedTransforms[i]) {
        card.style.transform = savedTransforms[i];
        card.style.webkitTransform = savedTransforms[i];
      }
    });

    cardTopsRef.current = newCardTops;
    cardHeightsRef.current = newCardHeights;
    endElementTopRef.current = newEndElementTop;
  }, [useWindowScroll]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    // Ensure we have card positions measured
    if (cardTopsRef.current.length !== cardsRef.current.length) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElementTop = endElementTopRef.current;

    const lastCardIndex = cardsRef.current.length - 1;
    const lastCardHeight = cardHeightsRef.current[lastCardIndex] || 460;
    const pinEndValue = endElementTop - lastCardHeight - stackPositionPx - itemStackDistance * lastCardIndex;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = cardTopsRef.current[i];
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = Math.max(pinStart, pinEndValue);

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = cardTopsRef.current[j];
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.webkitTransform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientation: 'vertical',
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    if (!useWindowScroll && !scrollerRef.current) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : (scrollerRef.current?.querySelectorAll('.scroll-stack-card') ?? [])
    ) as HTMLElement[];
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
    });

    // Initial measurement
    measureOffsets();

    const lenis = setupLenis();

    // Initial transform check
    updateCardTransforms();

    // Listen to resizes to dynamically recalculate layouts without thrashing scroll ticks
    const resizeObserver = new ResizeObserver(() => {
      measureOffsets();
      updateCardTransforms();
    });

    if (scrollerRef.current) {
      resizeObserver.observe(scrollerRef.current);
    }
    if (useWindowScroll) {
      resizeObserver.observe(document.body);
    }

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenis) {
        lenis.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    useWindowScroll,
    setupLenis,
    measureOffsets,
    updateCardTransforms
  ]);

  return (
    <div
      className={
        useWindowScroll
          ? `w-full overflow-visible ${className}`.trim()
          : `relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim()
      }
      ref={scrollerRef}
      style={
        useWindowScroll
          ? {
              position: 'relative'
            }
          : {
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'auto',
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
              willChange: 'scroll-position'
            }
      }
    >
      <div className={useWindowScroll ? "scroll-stack-inner px-20 pb-[20rem]" : "scroll-stack-inner pt-[20vh] px-20 pb-[50rem] min-h-screen"}>
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
