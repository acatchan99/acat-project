import { useCallback } from 'react';

export function useScrollTo() {
  return useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
}
