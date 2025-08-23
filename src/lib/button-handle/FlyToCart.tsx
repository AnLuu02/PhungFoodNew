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
  duration = 2000,
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

  const endX = toRect.left + window.scrollX;
  const endY = toRect.top + window.scrollY;

  const clone = document.createElement('img');
  clone.src = imageUrl || fromEl.getAttribute('src') || '';
  clone.style.position = 'absolute';
  clone.style.left = `${startX}px`;
  clone.style.top = `${startY}px`;
  clone.style.width = `100px`;
  clone.style.height = `100px`;
  clone.style.borderRadius = '8px';
  clone.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration}ms`;
  clone.style.zIndex = '1000';
  clone.style.pointerEvents = 'none';

  document.body.appendChild(clone);

  const deltaX = endX - startX;
  const deltaY = endY - startY - 20;

  requestAnimationFrame(() => {
    clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.1)`;
    clone.style.opacity = '0.1';
  });

  setTimeout(() => {
    clone.remove();
    if (onComplete) onComplete();
  }, duration);
}
