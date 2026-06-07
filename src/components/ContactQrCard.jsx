import { useLang } from '../context/LangContext';
import { useContent } from '../context/ContentContext';
import { DEFAULT_CONTACT_CARD } from '../data/contactCard';

export default function ContactQrCard({ className = '' }) {
  const { content } = useContent();
  const { lang, t } = useLang();
  const f = t('footer');
  const card = content?.contactCard ?? DEFAULT_CONTACT_CARD;

  if (!card.image) return null;

  const hint = card.hint?.[lang] || card.hint?.zh || f.scanHint;

  return (
    <figure className={`contact-qr-card ${className}`.trim()}>
      <div className="contact-qr-card__glow" aria-hidden="true" />
      <div className="contact-qr-card__frame">
        <img
          src={card.image}
          alt={f.cardAlt}
          loading="lazy"
          decoding="async"
        />
      </div>
      {hint && <figcaption className="contact-qr-card__hint">{hint}</figcaption>}
    </figure>
  );
}
