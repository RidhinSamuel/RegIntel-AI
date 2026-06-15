import React from 'react';
import type { ReactNode } from 'react';

/**
 * Props accepted by the ScrollStackItem component.
 */
export interface ScrollStackItemProps {
  /** Optional custom CSS class name applied to the outer div wrapper. */
  itemClassName?: string;
  /** Inner content nodes rendered inside the sticky card item. */
  children: ReactNode;
  /** Index of this item within the stack (0-based). Provided by container. */
  index?: number;
  /** Total count of items in the stack. Provided by container. */
  total?: number;
  /** Sticky offset distance (in px) between stacked cards. */
  stackOffset?: number;
}

/**
 * ScrollStackItem Component.
 * Represents a single sticky card item inside the scroll stack layout.
 * Applies scale transformations and sticky placement.
 *
 * @param {ScrollStackItemProps} props - The component props.
 * @returns {JSX.Element} The rendered sticky stack item.
 */
export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = '',
  index = 0,
  total = 1,
  stackOffset = 20
}) => (
  <div
    className={`scroll-stack-card ${itemClassName}`.trim()}
    style={{
      position: 'sticky' as const,
      top: `calc(15vh + ${index * stackOffset}px)`,
      zIndex: 10 + index,
      transformOrigin: 'top center',
      willChange: 'transform',
      backfaceVisibility: 'hidden' as const,
      transform: `scale(${1 - (total - 1 - index) * 0.03})`,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}
  >
    {children}
  </div>
);

/**
 * Props accepted by the ScrollStack container component.
 */
interface ScrollStackProps {
  /** Optional custom CSS class name for the wrapper. */
  className?: string;
  /** Stack items (ScrollStackItem) to render. */
  children: ReactNode;
  /** Distance (in px) separating unstacked cards during scroll. */
  itemDistance?: number;
  /** Stacking layout distance (in px) for overlapped cards. */
  itemStackDistance?: number;
  /** Kept for API compatibility: controls window scroll listener registration. */
  useWindowScroll?: boolean;
  /** Kept for API compatibility: scale transformation amount. */
  itemScale?: number;
  /** Kept for API compatibility: starting position of stack. */
  stackPosition?: string;
  /** Kept for API compatibility: scale boundary mark. */
  scaleEndPosition?: string;
  /** Kept for API compatibility: root starting scale ratio. */
  baseScale?: number;
  /** Kept for API compatibility: scroll duration tracker. */
  scaleDuration?: number;
  /** Kept for API compatibility: rotation degrees limit. */
  rotationAmount?: number;
  /** Kept for API compatibility: blur effect configuration. */
  blurAmount?: number;
  /** Kept for API compatibility: stack exit callback. */
  onStackComplete?: () => void;
}

/**
 * ScrollStack Container Component.
 * Aggregates ScrollStackItem components and injects indexes, total sizes,
 * and offset layouts using React cloneElement.
 *
 * @param {ScrollStackProps} props - The component props.
 * @returns {JSX.Element} The rendering wrapper component.
 */
const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 120,
  itemStackDistance = 20,
}) => {
  // Count children for proper indexing
  const childArray = React.Children.toArray(children);
  const total = childArray.length;

  return (
    <div
      className={`scroll-stack-wrapper ${className}`.trim()}
      style={{
        position: 'relative' as const,
        width: '100%',
      }}
    >
      <div
        className="scroll-stack-inner"
        style={{
          display: 'flex',
          flexDirection: 'column' as const,
          gap: `${itemDistance}px`,
          paddingBottom: '0',
        }}
      >
        {childArray.map((child, i) => {
          if (React.isValidElement<ScrollStackItemProps>(child)) {
            return React.cloneElement(child, {
              index: i,
              total,
              stackOffset: itemStackDistance,
            });
          }
          return child;
        })}
        {/* Spacer for clean exit */}
        <div className="scroll-stack-end" style={{ width: '100%', height: '1px' }} />
      </div>
    </div>
  );
};

export default ScrollStack;

