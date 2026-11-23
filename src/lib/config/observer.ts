let observer: IntersectionObserver | null = null;

const elements = new WeakMap<Element, () => void>();

function getObserver() {
  if (observer) return observer;

  observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const callback = elements.get(entry.target);
        if (callback) {
          callback();
          elements.delete(entry.target);
          observer!.unobserve(entry.target);
        }
      }
    },
    {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
    }
  );

  return observer;
}

export function observeElement(element: Element, callback: () => void) {
  const obs = getObserver();
  elements.set(element, callback);
  obs.observe(element);
}

export function unobserveElement(element: Element) {
  if (!observer) return;
  elements.delete(element);
  observer.unobserve(element);
}
