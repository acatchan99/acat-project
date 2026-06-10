import { useLang } from '../context/LangContext';
import { useNavigate } from '../hooks/useNavigate';
import GraffitiCanvas from './GraffitiCanvas';
import HeroBackgroundVideo from './hero/HeroBackgroundVideo';

export default function Hero() {
  const { t } = useLang();
  const { goTo } = useNavigate();
  const hero = t('hero');

  return (
    <section id="hero" className="hero">
      <HeroBackgroundVideo platform="desktop" />
      <div className="hero-graffiti-bg">
        <GraffitiCanvas variant="hero" />
        <div className="hero-graffiti-shade" />
        <div className="graffiti-tags graffiti-tags--hero" aria-hidden="true">
          <span className="graffiti-tag graffiti-tag--1">FAG</span>
          <span className="graffiti-tag graffiti-tag--2">ACAT</span>
          <span className="graffiti-tag graffiti-tag--3">SPRAY</span>
          <span className="graffiti-tag graffiti-tag--4">CY</span>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-deco hero-deco--arc" aria-hidden="true" />
        <div className="hero-deco hero-deco--star" aria-hidden="true">✦</div>
        <div className="hero-deco hero-deco--bubble" aria-hidden="true">FAG</div>
      </div>

      <div className="container hero-layout">
        <div className="hero-left reveal">
          <h1 className="hero-headline">
            {hero.headline[0]}<br />{hero.headline[1]}
          </h1>
          <p className="hero-subline">{hero.subline}</p>
        </div>

        <div className="hero-right reveal reveal-d2">
          <p className="hero-desc">{hero.desc}</p>
          <button type="button" className="btn btn-white" onClick={() => goTo('works')}>
            {hero.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
