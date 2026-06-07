import { useLang } from '../context/LangContext';
import { useNavigate } from '../hooks/useNavigate';
import { COLLECTIONS, getWorksByAlbum } from '../data/content';

export default function Collections({ onSelectAlbum }) {
  const { t } = useLang();
  const { goTo } = useNavigate();
  const col = t('collections');

  const labels = {
    fag: col.fag,
    digital: col.digital,
    odod: col.odod,
  };

  const goCollection = (item) => {
    onSelectAlbum?.(item.id);
    const label = labels[item.id];
    goTo('works', {
      title: label.title,
      subtitle: label.subtitle,
    });
  };

  return (
    <section className="collections">
      <div className="container">
        <div className="collection-split collection-split--three">
          {COLLECTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="collection-block reveal"
              onClick={() => goCollection(item)}
            >
              <div className="collection-thumb">
                <img src={item.image} alt="" />
              </div>
              <div className="collection-info">
                <h3>{labels[item.id].title}</h3>
                <span>{labels[item.id].subtitle}</span>
                <span className="collection-count">
                  {getWorksByAlbum(item.id).length} {col.pieces}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
