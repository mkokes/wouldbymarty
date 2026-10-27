/**
 * Fades in elements marked with `data-reveal` as they scroll into view.
 * CSS only hides them under `html.js` without reduced motion, so content stays
 * visible without JavaScript and for visitors who prefer less motion.
 */
export function initReveal() {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  elements.forEach((el) => observer.observe(el));
}
