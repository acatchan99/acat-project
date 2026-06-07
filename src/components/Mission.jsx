import { useLang } from '../context/LangContext';

export default function Mission() {
  const { t } = useLang();
  const mission = t('mission');

  return (
    <section id="about" className="mission">
      <div className="container">
        <h2 className="mission-statement reveal">
          {mission.statement[0]}<br />
          {mission.statement[1]}
        </h2>

        <div className="pillars">
          {mission.pillars.map(({ title, desc }, i) => (
            <article key={title} className={`pillar-card reveal reveal-d${i + 1}`}>
              <div className="pillar-icon">{['◆', '♥', '◎'][i]}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
