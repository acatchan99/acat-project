import { useLang } from '../../../context/LangContext';
import { useScrollTo } from '../../../hooks/useScrollTo';

export default function HeroContent() {
  const { t } = useLang();
  const hero = t('hero');
  const scrollTo = useScrollTo();

  return (
    <div className="m-hero-content">
      <h1 className="m-hero-content__title">
        {hero.headline[0]}
        <br />
        {hero.headline[1]}
      </h1>
      <p className="m-hero-content__subline">{hero.subline}</p>
      <p className="m-hero-content__desc">{hero.desc}</p>
      <button
        type="button"
        className="m-hero-content__cta"
        onClick={() => scrollTo('works')}
      >
        {hero.cta}
      </button>
    </div>
  );
}
