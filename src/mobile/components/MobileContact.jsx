import { useLang } from '../../context/LangContext';
import { SOCIAL_GROUPS, getLinksByIp, pickLang } from '../../data/social';

export default function MobileContact() {
  const { lang, t } = useLang();
  const c = t('contact');

  return (
    <section id="contact" className="m-section m-contact">
      <p className="m-eyebrow">{c.eyebrow}</p>
      <h2 className="m-section-title">{c.title}</h2>
      <p className="m-contact-name">{c.name}</p>
      <p className="m-contact-desc">{c.desc}</p>

      {SOCIAL_GROUPS.map((group) => {
        const items = getLinksByIp(group.ip);
        if (!items.length) return null;

        return (
          <div key={group.id} className="m-social-group">
            <h3>{pickLang(group.label, lang)}</h3>
            <p className="m-social-group-desc">{pickLang(group.desc, lang)}</p>
            <ul className="m-social-list">
              {items.map((item) => (
                <li key={`${item.platform}-${item.url}`}>
                  <a
                    className="m-social-link"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="m-social-abbr">{item.label.abbr}</span>
                    <span className="m-social-info">
                      <span className="m-social-platform">{pickLang(item.label, lang)}</span>
                      {item.handle && <span className="m-social-handle">{item.handle}</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <footer className="m-footer">
        <p>© ACAT CHAN · FAG</p>
      </footer>
    </section>
  );
}
