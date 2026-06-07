import { useLang } from '../context/LangContext';
import { useNavigate } from '../hooks/useNavigate';
import { getCollections, getWorksByAlbum, getAlbumById, pickLang } from '../data/content';

export default function Collections({ onSelectAlbum }) {
  const { lang, t } = useLang();
  const { goTo } = useNavigate();
  const col = t('collections');
  const collections = getCollections();

  const goCollection = (item) => {
    const album = getAlbumById(item.id);
    onSelectAlbum?.(item.id);
    goTo('works', {
      title: pickLang(album?.title, lang),
      subtitle: pickLang(album?.subtitle, lang),
    });
  };

  return (
    <section className="collections">
      <div className="container">
        <div className="collection-split collection-split--albums">
          {collections.map((item) => {
            const album = getAlbumById(item.id);
            return (
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
                  <h3>{pickLang(album?.title, lang)}</h3>
                  <span>{pickLang(album?.subtitle, lang)}</span>
                  <span className="collection-count">
                    {getWorksByAlbum(item.id).length} {col.pieces}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
