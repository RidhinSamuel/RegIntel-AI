import React from 'react';
import type { ReactNode } from 'react';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
  index?: number;
  total?: number;
  stackOffset?: number;
}

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

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemStackDistance?: number;
  useWindowScroll?: boolean;
  // Kept for API compatibility but no longer used internally
  itemScale?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  onStackComplete?: () => void;
}

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
