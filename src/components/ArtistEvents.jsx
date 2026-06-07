import { useLang } from '../context/LangContext';
import { getExhibitions, pickLang } from '../data/content';

export default function ArtistEvents({ className = '' }) {
  const { lang, t } = useLang();
  const events = getExhibitions();

  if (!events.length) return null;

  return (
    <div id="events" className={`artist-events ${className}`.trim()}>
      <div className="artist-events-head">
        <span className="artist-events-mark" aria-hidden="true" />
        <h3 className="artist-events-title">{t('events').title}</h3>
      </div>
      <div className="artist-events-panel">
        <ul className="artist-events-list">
          {events.map(({ year, title }) => (
            <li key={`${year}-${pickLang(title, 'zh')}`} className="artist-events-item">
              <span className="artist-events-year">{year}</span>
              <span className="artist-events-name">{pickLang(title, lang)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
