'use client';

import { useEffect, useRef } from 'react';
import { observeElement, unobserveElement } from '../lib/observer';

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  z?: number;
};

export default function Reveal({ children, delay = 0, y = 0, x = 0, z = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    observeElement(el, () => {
      el.style.opacity = '1';
      el.style.transform = 'translate3d(0,0,0)';
      el.style.transitionDelay = `${delay}s`;
    });

    return () => unobserveElement(el);
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: `${z ? 'perspective(1000px)' : ''}translate3d(${x}px,${y}px,${z}px)`,
        transition: 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)',
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}
