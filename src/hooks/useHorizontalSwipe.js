import { useEffect, useRef } from 'react';

const SWIPE_THRESHOLD = 44;

/** 水平滑动手势：左滑下一项，右滑上一项，无过渡动画 */
export function useHorizontalSwipe(onPrev, onNext, enabled = true) {
  const ref = useRef(null);
  const start = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;

    const finish = (x, y) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const dx = x - s.x;
      const dy = y - s.y;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      if (dx > 0) onPrev?.();
      else onNext?.();
    };

    const onTouchStart = (e) => {
      const t = e.changedTouches[0];
      start.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = (e) => {
      const t = e.changedTouches[0];
      finish(t.clientX, t.clientY);
    };

    let dragging = false;
    const onMouseDown = (e) => {
      dragging = true;
      start.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = (e) => {
      if (!dragging) return;
      dragging = false;
      finish(e.clientX, e.clientY);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onPrev, onNext, enabled]);

  return ref;
}

export function wrapIndex(index, length) {
  if (!length) return 0;
  return ((index % length) + length) % length;
}
