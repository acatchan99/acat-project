import { useEffect } from 'react';

export function refreshScrollReveal(root = document) {
  const items = root.querySelectorAll('.reveal:not(.revealed)');
  items.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      el.classList.add('revealed');
    }
  });
}

function revealInView(items) {
  items.forEach((el) => {
    if (el.classList.contains('revealed')) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      el.classList.add('revealed');
    }
  });
}

export function useScrollReveal() {
  useEffect(() => {
    const observe = () => {
      const items = document.querySelectorAll('.reveal');
      revealInView(items);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
      );

      items.forEach((el) => {
        if (!el.classList.contains('revealed')) observer.observe(el);
      });

      return observer;
    };

    let observer = observe();
    const onResize = () => revealInView(document.querySelectorAll('.reveal'));
    window.addEventListener('resize', onResize);

    const rescan = setTimeout(() => {
      observer.disconnect();
      observer = observe();
    }, 120);

    return () => {
      clearTimeout(rescan);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, []);
}
