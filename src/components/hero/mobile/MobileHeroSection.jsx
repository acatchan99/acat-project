import MobileHeroBackgroundVideo from './MobileHeroBackgroundVideo';
import HeroDarkOverlay from './HeroDarkOverlay';
import FloatingGraphicsLayer from './FloatingGraphicsLayer';
import HeroBottomGradient from './HeroBottomGradient';
import HeroContent from './HeroContent';

export default function MobileHeroSection() {
  return (
    <section id="hero" className="m-hero-section" aria-label="Home">
      <MobileHeroBackgroundVideo />
      <HeroDarkOverlay />
      <FloatingGraphicsLayer />
      <HeroBottomGradient />
      <HeroContent />
    </section>
  );
}
