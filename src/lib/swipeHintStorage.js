const KEY = 'acat-swipe-hint-seen';

export function isSwipeHintSeen() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function markSwipeHintSeen() {
  try {
    localStorage.setItem(KEY, '1');
    window.dispatchEvent(new Event('acat-swipe-hint-seen'));
  } catch {
    /* ignore */
  }
}
