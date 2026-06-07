import { useLang } from '../../context/LangContext';
import { useScrollTo } from '../../hooks/useScrollTo';

export default function MobileArtist() {
  const { t } = useLang();
  const a = t('artist');
  const scrollTo = useScrollTo();

  return (
    <section id="artists" className="m-section m-artist">
      <p className="m-eyebrow">{a.tag}</p>
      <h2 className="m-section-title">ACAT CHAN</h2>
      <div className="m-artist-card">
        <img src="/artist-intro.jpg" alt={a.caption} />
        <p className="m-artist-caption">{a.caption}</p>
      </div>
      <p className="m-artist-lead">{a.lead}</p>
      <p className="m-artist-body">{a.body}</p>
      <button type="button" className="m-btn m-btn--blue" onClick={() => scrollTo('works')}>
        {a.cta}
      </button>
    </section>
  );
}
