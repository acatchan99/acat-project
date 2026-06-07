import { useLang } from '../../context/LangContext';

export default function MobileAbout() {
  const { t } = useLang();
  const mission = t('mission');

  return (
    <section id="about" className="m-section m-about">
      <h2 className="m-section-title">
        {mission.statement[0]}
        {mission.statement[1]}
      </h2>
      <div className="m-pillars">
        {mission.pillars.map(({ title, desc }) => (
          <article key={title} className="m-pillar">
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
