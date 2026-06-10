import { useLang } from '../../../context/LangContext';
import { useScrollTo } from '../../../hooks/useScrollTo';
import OptimizedImage from '../../OptimizedImage';

export default function MobileHeroCardSection() {
  const { t } = useLang();
  const hero = t('hero');
  const scrollTo = useScrollTo();

  return (
    <section id="hero" className="m-hero" aria-label="Home">
      <div className="m-hero-visual">
        <OptimizedImage
          src="/about-artist.jpg"
          alt="ACAT 陈吖猫"
          variant="display"
          loading="eager"
          fetchPriority="high"
          className="m-hero-photo"
        />
        <span className="m-hero-tag">FAG</span>
      </div>
      <h1 className="m-hero-title">
        {hero.headline[0]}
        <br />
        {hero.headline[1]}
      </h1>
      <p className="m-hero-sub">{hero.subline}</p>
      <p className="m-hero-desc">{hero.desc}</p>
      <button type="button" className="m-btn m-btn--white" onClick={() => scrollTo('works')}>
        {hero.cta}
      </button>
    </section>
  );
}
