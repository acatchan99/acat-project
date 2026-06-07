import { useLang } from '../context/LangContext';
import { getExhibitions, pickLang } from '../data/content';

export default function Events() {
  const { lang, t } = useLang();

  return (
    <section id="events" className="events-section">
      <div className="container">
        <h2 className="events-heading reveal">{t('events').title}</h2>
        <div className="events-list">
          {getExhibitions().map(({ year, title }, i) => (
            <div key={pickLang(title, 'zh')} className={`event-row reveal reveal-d${(i % 4) + 1}`}>
              <span className="event-year">{year}</span>
              <span className="event-title">{pickLang(title, lang)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
