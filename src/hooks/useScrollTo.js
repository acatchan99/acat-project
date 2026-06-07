import { useCallback } from 'react';
import { useMediaQuery, MOBILE_QUERY } from './useMediaQuery';

export function useScrollTo() {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({
      behavior: isMobile ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [isMobile]);
}
