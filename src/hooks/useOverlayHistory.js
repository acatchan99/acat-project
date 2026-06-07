import { useEffect, useRef, useCallback } from 'react';

/**
 * 弹层打开时 push history，浏览器后退先关弹层而非离开页面。
 */
export function useOverlayHistory(isOpen, onClose) {
  const onCloseRef = useRef(onClose);
  const ignorePopRef = useRef(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    window.history.pushState({ acatOverlay: 1 }, '');

    const onPopState = () => {
      if (ignorePopRef.current) {
        ignorePopRef.current = false;
        return;
      }
      onCloseRef.current();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [isOpen]);

  const close = useCallback(() => {
    if (window.history.state?.acatOverlay) {
      ignorePopRef.current = true;
      window.history.back();
    }
    onCloseRef.current();
  }, []);

  return close;
}
