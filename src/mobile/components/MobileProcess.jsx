import { useLang } from '../../context/LangContext';

export default function MobileProcess() {
  const { t } = useLang();
  const proc = t('process');

  return (
    <section id="process" className="m-section m-process">
      <p className="m-eyebrow">{proc.eyebrow}</p>
      <h2 className="m-section-title">{proc.title}</h2>
      <p className="m-process-intro">{proc.intro}</p>
      <ol className="m-process-list">
        {proc.steps.map((step, i) => (
          <li key={i} className="m-process-step">
            <span className="m-process-index">{String(i + 1).padStart(2, '0')}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
