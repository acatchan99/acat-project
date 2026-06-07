import { useLang } from '../context/LangContext';
import { useNavigate } from '../hooks/useNavigate';
import ArtistEvents from './ArtistEvents';
import OptimizedImage from './OptimizedImage';

export default function Artist() {
  const { t } = useLang();
  const { goTo } = useNavigate();
  const a = t('artist');

  return (
    <section id="artists" className="artist-section">
      <div className="container">
        <div className="artist-panel reveal">
          <div className="artist-panel-body reveal reveal-d1">
            <div className="artist-photo-wrap">
              <div className="artist-photo">
                <OptimizedImage src="/artist-intro.png" alt="ACAT 陈吖猫" variant="display" loading="lazy" />
              </div>
            </div>

            <div className="artist-info">
              <header className="artist-head">
                <p className="section-tag">{a.tag}</p>
                <h2 className="artist-title">ACAT CHAN</h2>
              </header>
              <div className="artist-intro">
                <p className="artist-lead">{a.lead}</p>
                <p className="artist-body">{a.body}</p>
              </div>
              <ArtistEvents />
            </div>
          </div>

          <div className="artist-panel-sub reveal reveal-d2">
            <p className="artist-caption">{a.caption}</p>
            <div className="artist-panel-foot">
              <button
                type="button"
                className="btn btn-blue artist-cta"
                onClick={() => goTo('works')}
              >
                {a.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
