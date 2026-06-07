import { useLang } from '../context/LangContext';
import { useNavigate } from '../hooks/useNavigate';

export default function Artist() {
  const { t } = useLang();
  const { goTo } = useNavigate();
  const a = t('artist');

  return (
    <section id="artists" className="artist-section">
      <div className="container artist-grid">
        <div className="artist-visual reveal">
          <div className="artist-frame">
            <img src="/artist-intro.jpg" alt="ACAT 陈吖猫" />
          </div>
          <p className="artist-caption">{a.caption}</p>
        </div>

        <div className="artist-copy">
          <p className="section-tag reveal">{a.tag}</p>
          <h2 className="artist-title reveal reveal-d1">ACAT CHAN</h2>
          <p className="artist-lead reveal reveal-d2">{a.lead}</p>
          <p className="artist-body reveal reveal-d3">{a.body}</p>

          <button
            type="button"
            className="btn btn-blue reveal reveal-d4"
            onClick={() => goTo('works')}
          >
            {a.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
