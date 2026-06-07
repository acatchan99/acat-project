import { useLang } from '../context/LangContext';
import {
  SOCIAL_GROUPS,
  getLinksByIp,
  pickLang,
} from '../data/social';

export default function Contact() {
  const { lang, t } = useLang();
  const c = t('contact');

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <header className="contact-head reveal">
          <p className="contact-eyebrow">{c.eyebrow}</p>
          <h2 className="contact-title">{c.title}</h2>
          <p className="contact-name">{c.name}</p>
          <p className="contact-desc">{c.desc}</p>
        </header>

        <div className="social-groups">
          {SOCIAL_GROUPS.map((group) => {
            const items = getLinksByIp(group.ip);
            if (!items.length) return null;

            return (
              <div key={group.id} className="social-group reveal">
                <div className="social-group-head">
                  <h3>{pickLang(group.label, lang)}</h3>
                  <p>{pickLang(group.desc, lang)}</p>
                </div>
                <ul className="social-orbit">
                  {items.map((item) => (
                    <li key={`${item.platform}-${item.url}`}>
                      <a
                        className="social-chip"
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="social-chip-ring">
                          <span className="social-chip-abbr">{item.label.abbr}</span>
                        </span>
                        <span className="social-chip-platform">
                          {pickLang(item.label, lang)}
                        </span>
                        {item.handle && (
                          <span className="social-chip-handle">{item.handle}</span>
                        )}
                        {item.followers != null && (
                          <span className="social-chip-meta">
                            {item.followers} {c.followers}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
