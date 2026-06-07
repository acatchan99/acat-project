import { useLang } from '../context/LangContext';
import { useNavigate } from '../hooks/useNavigate';
import { getPricingItems } from '../data/pricing';
import { pickLang } from '../data/content';

export default function Pricing() {
  const { lang, t } = useLang();
  const { goTo } = useNavigate();
  const p = t('pricing');

  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <header className="pricing-head reveal">
          <p className="pricing-eyebrow">{p.eyebrow}</p>
          <h2 className="pricing-title">{p.title}</h2>
        </header>

        <div className="pricing-table reveal">
          <div className="pricing-row pricing-row--head" aria-hidden="true">
            <span className="pricing-spec">{p.colSpec}</span>
            <span className="pricing-price">{p.colPrice}</span>
          </div>

          <ul className="pricing-list">
            {getPricingItems().map((item) => (
              <li key={item.id} className="pricing-row">
                <div className="pricing-spec">
                  <p className="pricing-spec-text">
                    {pickLang(item.size, lang)}{pickLang(item.product, lang)}
                  </p>
                  <div className="pricing-sample">
                    <img
                      src={item.image}
                      alt={pickLang(item.size, lang)}
                      loading="lazy"
                    />
                  </div>
                </div>
                <span className="pricing-price">{item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="pricing-note reveal">{p.note}</p>

        <button type="button" className="pricing-cta reveal" onClick={() => goTo('contact')}>
          {p.cta}
        </button>
      </div>
    </section>
  );
}
