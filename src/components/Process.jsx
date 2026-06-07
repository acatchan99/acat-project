import { useLang } from '../context/LangContext';

export default function Process() {
  const { t } = useLang();
  const proc = t('process');

  return (
    <section id="process" className="process-section">
      <div className="container">
        <header className="process-head reveal">
          <p className="process-eyebrow">{proc.eyebrow}</p>
          <h2 className="process-title">{proc.title}</h2>
          <p className="process-intro">{proc.intro}</p>
        </header>

        <ol className="process-list reveal">
          {proc.steps.map((step, i) => (
            <li key={i} className="process-step">
              <span className="process-index">{String(i + 1).padStart(2, '0')}</span>
              <p className="process-text">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
