import { useLang } from '../../context/LangContext';
import { useScrollTo } from '../../hooks/useScrollTo';
import ArtistEvents from '../../components/ArtistEvents';

export default function MobileArtist() {
  const { t } = useLang();
  const a = t('artist');
  const scrollTo = useScrollTo();

  return (
    <section id="artists" className="m-section m-artist">
      <div className="artist-panel">
        <div className="artist-panel-body">
          <div className="artist-photo-wrap">
            <div className="artist-photo">
              <img src="/artist-intro.png" alt={a.caption} />
            </div>
          </div>

          <div className="artist-info">
            <header className="m-artist-head">
              <p className="m-eyebrow">{a.tag}</p>
              <h2 className="m-section-title">ACAT CHAN</h2>
            </header>
            <div className="m-artist-intro">
              <p className="m-artist-lead">{a.lead}</p>
              <p className="m-artist-body">{a.body}</p>
            </div>
            <ArtistEvents />
          </div>
        </div>

        <div className="artist-panel-sub">
          <p className="artist-caption">{a.caption}</p>
          <div className="artist-panel-foot">
            <button type="button" className="m-btn m-btn--blue" onClick={() => scrollTo('works')}>
              {a.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
