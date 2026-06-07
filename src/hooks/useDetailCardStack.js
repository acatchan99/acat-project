import { useState, useRef, useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { markSwipeHintSeen } from '../lib/swipeHintStorage';

export const CARD_TRANSITION_MS = 380;
const THRESHOLD_RATIO = 0.18;
const MIN_SWIPE_PX = 28;
const VELOCITY_COMMIT = 420;
const EASING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

export function wrapIndex(index, length) {
  if (!length) return 0;
  return ((index % length) + length) % length;
}

export function useDetailCardStack({ enabled, index, count, onIndexChange }) {
  const stackRef = useRef(null);
  const trackRef = useRef(null);
  const start = useRef(null);
  const dragMode = useRef(null);
  const dragging = useRef(false);
  const busy = useRef(false);
  const widthRef = useRef(320);
  const offsetRef = useRef(0);
  const rafId = useRef(0);
  const pendingOffset = useRef(null);
  const latestDx = useRef(0);
  const activeIndexRef = useRef(index);

  const [activeIndex, setActiveIndex] = useState(index);
  const [mode, setMode] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  activeIndexRef.current = activeIndex;

  useEffect(() => {
    if (!busy.current && mode === null && index !== activeIndexRef.current) {
      setActiveIndex(index);
    }
  }, [index, mode]);

  const syncWidth = useCallback(() => {
    if (stackRef.current) widthRef.current = stackRef.current.offsetWidth || 320;
  }, []);

  const partnerIndex = mode === 'next'
    ? wrapIndex(activeIndex + 1, count)
    : mode === 'prev'
      ? wrapIndex(activeIndex - 1, count)
      : null;

  const setTrackTransform = useCallback((x, animate = false) => {
    const el = trackRef.current;
    if (!el) return;
    offsetRef.current = x;
    el.style.transition = animate
      ? `transform ${CARD_TRANSITION_MS}ms ${EASING}`
      : 'none';
    el.style.transform = `translate3d(${x}px, 0, 0)`;
  }, []);

  const flushPendingOffset = useCallback(() => {
    rafId.current = 0;
    if (pendingOffset.current == null) return;
    setTrackTransform(pendingOffset.current, false);
    pendingOffset.current = null;
  }, [setTrackTransform]);

  const scheduleOffset = useCallback((x) => {
    pendingOffset.current = x;
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(flushPendingOffset);
    }
  }, [flushPendingOffset]);

  const calcOffset = useCallback((dx, dir, w) => {
    if (dir === 'next') {
      return Math.max(-w, -dx);
    }
    return Math.min(0, -w - dx);
  }, []);

  const waitTransition = useCallback((onDone) => {
    const el = trackRef.current;
    if (!el) {
      window.setTimeout(onDone, CARD_TRANSITION_MS);
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener('transitionend', onTransitionEnd);
      onDone();
    };
    const onTransitionEnd = (e) => {
      if (e.target === el && e.propertyName === 'transform') finish();
    };
    el.addEventListener('transitionend', onTransitionEnd);
    window.setTimeout(finish, CARD_TRANSITION_MS + 80);
  }, []);

  /** 动画结束后同步切到目标 index，避免父组件异步更新导致闪回旧图 */
  const finalizeToIndex = useCallback((newIndex) => {
    flushSync(() => {
      setActiveIndex(newIndex);
      setMode(null);
      setAnimating(false);
      setIsDragging(false);
    });
    setTrackTransform(0, false);
    dragMode.current = null;
    dragging.current = false;
    busy.current = false;
    onIndexChange?.(newIndex);
  }, [onIndexChange, setTrackTransform]);

  const settleIdle = useCallback(() => {
    dragMode.current = null;
    dragging.current = false;
    setIsDragging(false);
    setMode(null);
    setAnimating(false);
    busy.current = false;
    setTrackTransform(0, false);
  }, [setTrackTransform]);

  const afterDualLayout = useCallback((fn) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        syncWidth();
        fn();
      });
    });
  }, [syncWidth]);

  const commitNext = useCallback((fromOffset) => {
    const w = widthRef.current;
    const newIndex = wrapIndex(activeIndexRef.current + 1, count);
    busy.current = true;
    setAnimating(true);
    markSwipeHintSeen();
    setMode('next');
    afterDualLayout(() => {
      setTrackTransform(fromOffset, false);
      requestAnimationFrame(() => {
        setTrackTransform(-w, true);
        waitTransition(() => finalizeToIndex(newIndex));
      });
    });
  }, [count, setTrackTransform, waitTransition, finalizeToIndex, afterDualLayout]);

  const commitPrev = useCallback((fromOffset) => {
    const newIndex = wrapIndex(activeIndexRef.current - 1, count);
    busy.current = true;
    setAnimating(true);
    markSwipeHintSeen();
    setMode('prev');
    afterDualLayout(() => {
      setTrackTransform(fromOffset, false);
      requestAnimationFrame(() => {
        setTrackTransform(0, true);
        waitTransition(() => finalizeToIndex(newIndex));
      });
    });
  }, [count, setTrackTransform, waitTransition, finalizeToIndex, afterDualLayout]);

  const snapBack = useCallback((dir, fromOffset) => {
    const w = widthRef.current;
    const target = dir === 'prev' ? -w : 0;
    busy.current = true;
    setAnimating(true);
    setTrackTransform(fromOffset, false);
    requestAnimationFrame(() => {
      setTrackTransform(target, true);
      waitTransition(settleIdle);
    });
  }, [setTrackTransform, waitTransition, settleIdle]);

  const finishDrag = useCallback((dx, dy, dt) => {
    if (!enabled || busy.current) return;
    const w = widthRef.current;
    const threshold = Math.max(MIN_SWIPE_PX, w * THRESHOLD_RATIO);
    const dir = dragMode.current;
    const velocity = dt > 0 ? (dx / dt) * 1000 : 0;
    const currentOffset = offsetRef.current;

    if (!dir || Math.abs(dx) < Math.abs(dy)) {
      if (dir) snapBack(dir, currentOffset);
      return;
    }

    const flingNext = velocity < -VELOCITY_COMMIT;
    const flingPrev = velocity > VELOCITY_COMMIT;
    const passNext = dx < -threshold || flingNext;
    const passPrev = dx > threshold || flingPrev;

    if (dir === 'next' && passNext) commitNext(currentOffset);
    else if (dir === 'prev' && passPrev) commitPrev(currentOffset);
    else snapBack(dir, currentOffset);
  }, [enabled, snapBack, commitNext, commitPrev]);

  const goNext = useCallback(() => {
    if (!enabled || busy.current || count <= 1) return;
    commitNext(0);
  }, [enabled, count, commitNext]);

  const goPrev = useCallback(() => {
    if (!enabled || busy.current || count <= 1) return;
    const newIndex = wrapIndex(activeIndexRef.current - 1, count);
    busy.current = true;
    setAnimating(true);
    markSwipeHintSeen();
    setMode('prev');
    afterDualLayout(() => {
      const w = widthRef.current;
      setTrackTransform(-w, false);
      requestAnimationFrame(() => {
        setTrackTransform(0, true);
        waitTransition(() => finalizeToIndex(newIndex));
      });
    });
  }, [enabled, count, setTrackTransform, waitTransition, finalizeToIndex, afterDualLayout]);

  useEffect(() => {
    const el = stackRef.current;
    if (!el || !enabled) return undefined;

    const pointerDown = (x, y) => {
      if (busy.current || animating) return;
      syncWidth();
      start.current = { x, y, t: Date.now() };
      dragMode.current = null;
      dragging.current = false;
    };

    const pointerMove = (x, y) => {
      const s = start.current;
      if (!s || busy.current || animating) return;
      const dx = x - s.x;
      const dy = y - s.y;

      if (!dragging.current) {
        if (Math.abs(dx) < 8) return;
        if (Math.abs(dy) > Math.abs(dx) * 1.05) {
          start.current = null;
          return;
        }
        dragging.current = true;
        setIsDragging(true);
        markSwipeHintSeen();
        const dir = dx < 0 ? 'next' : 'prev';
        dragMode.current = dir;
        latestDx.current = dx;
        setMode(dir);
        afterDualLayout(() => {
          scheduleOffset(calcOffset(latestDx.current, dir, widthRef.current));
        });
        return;
      }

      latestDx.current = dx;
      scheduleOffset(calcOffset(dx, dragMode.current, widthRef.current));
    };

    const pointerUp = (x, y) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      if (dragging.current) {
        const dt = Math.max(Date.now() - s.t, 1);
        finishDrag(x - s.x, y - s.y, dt);
        dragging.current = false;
      }
    };

    const onTouchStart = (e) => {
      const t = e.changedTouches[0];
      pointerDown(t.clientX, t.clientY);
    };
    const onTouchMove = (e) => {
      if (dragging.current) e.preventDefault();
      const t = e.changedTouches[0];
      pointerMove(t.clientX, t.clientY);
    };
    const onTouchEnd = (e) => {
      const t = e.changedTouches[0];
      pointerUp(t.clientX, t.clientY);
    };

    let mouseDown = false;
    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      mouseDown = true;
      pointerDown(e.clientX, e.clientY);
    };
    const onMouseMove = (e) => {
      if (!mouseDown) return;
      pointerMove(e.clientX, e.clientY);
    };
    const onMouseUp = (e) => {
      if (!mouseDown) return;
      mouseDown = false;
      pointerUp(e.clientX, e.clientY);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled, finishDrag, animating, syncWidth, calcOffset, scheduleOffset, afterDualLayout]);

  useEffect(() => {
    syncWidth();
    const onResize = () => syncWidth();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [syncWidth]);

  return {
    stackRef,
    trackRef,
    activeIndex,
    mode,
    animating,
    partnerIndex,
    isDragging,
    goPrev,
    goNext,
    easing: EASING,
  };
}
