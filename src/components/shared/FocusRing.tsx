import type { ReactNode } from 'react';

interface FocusRingProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper that adds a consistent focus-visible ring to its child.
 * The ring is 2px solid with 3:1 contrast ratio against white backgrounds.
 * Uses focus-within so it activates when any child receives focus.
 */
export function FocusRing({ children, className = '' }: FocusRingProps) {
  return (
    <div
      className={`focus-within:[&>*]:outline focus-within:[&>*]:outline-2 focus-within:[&>*]:outline-primary-500 focus-within:[&>*]:outline-offset-2 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * CSS utility class for applying focus ring directly.
 * Use in className: `focusRingClass`
 */
export const focusRingClass = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2';
