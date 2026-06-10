import { useState } from 'react';
import { getMobileHeroLayout } from '../../lib/heroVideoCompat';
import MobileHeroSection from '../../components/hero/mobile/MobileHeroSection';
import MobileHeroCardSection from '../../components/hero/mobile/MobileHeroCardSection';

export default function MobileHero() {
  const [layout] = useState(() => (
    typeof window !== 'undefined' ? getMobileHeroLayout() : 'card'
  ));

  if (layout === 'video') {
    return <MobileHeroSection />;
  }

  return <MobileHeroCardSection />;
}
