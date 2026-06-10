import { useHeroVideoConfig } from '../useHeroVideoConfig';

export default function HeroBottomGradient() {
  const { bottomGradientEnabled, bottomGradientHeight } = useHeroVideoConfig('mobile');

  if (!bottomGradientEnabled) return null;

  return (
    <div
      className="m-hero-bottom-gradient"
      aria-hidden="true"
      style={{ height: bottomGradientHeight || '24vh' }}
    />
  );
}
