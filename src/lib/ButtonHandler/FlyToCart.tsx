export function isPartiallyInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
}
export function getVisibleToEl(selector: string): HTMLElement | null {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  for (const el of elements) {
    if (isPartiallyInViewport(el)) return el;
  }
  return null;
}

export function flyToCart({
  fromEl,
  toEl,
  imageUrl,
  duration = 800,
  onComplete
}: {
  fromEl: HTMLElement;
  toEl: HTMLElement;
  imageUrl?: string;
  duration?: number;
  onComplete?: () => void;
}) {
  if (!fromEl || !toEl) return;

  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  const startX = fromRect.left + window.scrollX;
  const startY = fromRect.top + window.scrollY;
  const endX = toRect.left + window.scrollX + toRect.width / 2 - fromRect.width / 2;
  const endY = toRect.top + window.scrollY + toRect.height / 2 - fromRect.height / 2;

  const clone = document.createElement('img');
  clone.src = imageUrl || (fromEl instanceof HTMLImageElement ? fromEl.src : fromEl.getAttribute('src') || '');

  Object.assign(clone.style, {
    position: 'absolute',
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${fromRect.width}px`,
    height: `${fromRect.height}px`,
    borderRadius: '8px',
    zIndex: '1000',
    pointerEvents: 'none',
    objectFit: 'cover',
    willChange: 'transform, opacity',
    transition: 'none'
  });

  document.body.appendChild(clone);

  void clone.offsetWidth;

  const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  clone.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  requestAnimationFrame(() => {
    clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.1)`;
    clone.style.opacity = '0';
  });

  clone.addEventListener(
    'transitionend',
    () => {
      clone.remove();
      onComplete?.();
    },
    { once: true }
  );
}
