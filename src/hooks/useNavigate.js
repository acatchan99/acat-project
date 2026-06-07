import { useCallback } from 'react';
import { usePageTransition } from '../context/PageTransitionContext';
import { useLang } from '../context/LangContext';
import { useMediaQuery, MOBILE_QUERY } from './useMediaQuery';

export function useNavigate() {
  const { triggerTransition, state } = usePageTransition();
  const { t } = useLang();
  const tr = t('transition');
  const isMobile = useMediaQuery(MOBILE_QUERY);

  const goTo = useCallback((sectionId, override) => {
    if (state) return;
    if (isMobile) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    triggerTransition({
      title: override?.title ?? tr[sectionId] ?? sectionId,
      subtitle: override?.subtitle ?? tr.series,
      targetId: sectionId,
    });
  }, [triggerTransition, tr, state, isMobile]);

  const openWork = useCallback((work, onComplete) => {
    if (state) return;
    onComplete?.();
  }, [state]);

  return { goTo, openWork };
}
