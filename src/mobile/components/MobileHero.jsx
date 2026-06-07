import { useLang } from '../../context/LangContext';
import { useScrollTo } from '../../hooks/useScrollTo';

export default function MobileHero() {
  const { t } = useLang();
  const hero = t('hero');
  const scrollTo = useScrollTo();

  return (
    <section id="hero" className="m-hero">
      <div className="m-hero-visual">
        <img src="/about-artist.jpg" alt="ACAT 陈吖猫" className="m-hero-photo" />
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
