import { useCallback } from 'react';
import { usePageTransition } from '../context/PageTransitionContext';
import { useLang } from '../context/LangContext';

export function useNavigate() {
  const { triggerTransition, state } = usePageTransition();
  const { t } = useLang();
  const tr = t('transition');

  const goTo = useCallback((sectionId, override) => {
    if (state) return;
    triggerTransition({
      title: override?.title ?? tr[sectionId] ?? sectionId,
      subtitle: override?.subtitle ?? tr.series,
      targetId: sectionId,
    });
  }, [triggerTransition, tr, state]);

  const openWork = useCallback((work, onComplete) => {
    if (state) return;
    onComplete?.();
  }, [state]);

  return { goTo, openWork };
}
