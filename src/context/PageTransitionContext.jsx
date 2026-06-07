import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const PageTransitionContext = createContext(null);

export function PageTransitionProvider({ children }) {
  const [state, setState] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const triggerTransition = useCallback(({ title, subtitle, targetId, onComplete }) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    document.body.classList.add('is-transitioning');
    setState({ title, subtitle, phase: 'in' });

    timerRef.current = setTimeout(() => {
      if (targetId) {
        const el = document.getElementById(targetId);
        el?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      onComplete?.();
      setState((s) => (s ? { ...s, phase: 'out' } : null));

      timerRef.current = setTimeout(() => {
        setState(null);
        document.body.classList.remove('is-transitioning');
      }, 400);
    }, 680);
  }, []);

  return (
    <PageTransitionContext.Provider value={{ state, triggerTransition }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error('usePageTransition must be used within PageTransitionProvider');
  return ctx;
}
