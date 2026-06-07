import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useMediaQuery, MOBILE_QUERY } from '../hooks/useMediaQuery';
import { isSwipeHintSeen } from '../lib/swipeHintStorage';

export default function SwipeHint({ show = true, className = '' }) {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const { t } = useLang();
  const [visible, setVisible] = useState(() => !isSwipeHintSeen());

  useEffect(() => {
    const onSeen = () => setVisible(false);
    window.addEventListener('acat-swipe-hint-seen', onSeen);
    return () => window.removeEventListener('acat-swipe-hint-seen', onSeen);
  }, []);

  if (!show || !isMobile || !visible) return null;

  return (
    <p className={`detail-swipe-hint${className ? ` ${className}` : ''}`}>
      {t('detail').swipeHint}
    </p>
  );
}
