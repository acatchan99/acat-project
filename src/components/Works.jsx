import { useEffect } from 'react';

import { useLang } from '../context/LangContext';

import { getAlbumTabs, getWorksByAlbum, getAlbumById, pickLang } from '../data/content';

import { refreshScrollReveal } from '../hooks/useScrollReveal';

import { useAlbumImagePreload, usePrefetchAllAlbums } from '../hooks/useAlbumImagePreload';

import WorkThumbnail from './WorkThumbnail';



export default function Works({ album, onAlbumChange, onSelect }) {

  const { lang, t } = useLang();

  const w = t('works');

  const col = t('collections');

  const tabs = getAlbumTabs();

  const works = getWorksByAlbum(album);

  const activeAlbum = getAlbumById(album);

  const tabIds = tabs.map((t) => t.id);



  useAlbumImagePreload(album);

  usePrefetchAllAlbums(tabIds);



  useEffect(() => {

    const section = document.getElementById('works');

    if (!section) return;

    requestAnimationFrame(() => refreshScrollReveal(section));

  }, [album, works.length]);



  const prefetchAlbum = (albumId) => {

    getWorksByAlbum(albumId).forEach((item) => {

      if (!item?.image) return;

      const img = new Image();

      img.src = item.image;

    });

  };



  return (

    <section id="works" className="works-section">

      <div className="container">

        <div className="works-head reveal">

          <div className="works-head-text">

            <h2 className="works-title">{w.title}</h2>

            <p className="works-sub">

              {activeAlbum ? pickLang(activeAlbum.subtitle, lang) : w.sub}

            </p>

          </div>

          <span className="works-badge">{works.length} {col.pieces}</span>

        </div>



        <nav className="album-nav reveal" aria-label={w.title}>

          <div className="album-tabs" role="tablist">

            {tabs.map((item) => (

              <button

                key={item.id}

                type="button"

                role="tab"

                aria-selected={album === item.id}

                className={`album-tab${album === item.id ? ' album-tab--active' : ''}`}

                onClick={() => onAlbumChange(item.id)}

                onMouseEnter={() => prefetchAlbum(item.id)}

                onFocus={() => prefetchAlbum(item.id)}

              >

                <span className="album-tab-label">

                  {pickLang(getAlbumById(item.id)?.title, lang)}

                </span>

                <span className="album-tab-count">{getWorksByAlbum(item.id).length}</span>

              </button>

            ))}

          </div>

        </nav>



        <div className="product-grid" key={album}>

          {works.map((work) => (

            <article key={work.id} className="product-card">

              <button type="button" className="product-img-btn" onClick={() => onSelect(work)}>

                <WorkThumbnail

                  src={work.image}

                  alt={pickLang(work.title, lang)}

                  className="work-thumb--product"

                />

              </button>

              <div className="product-info">

                <button type="button" className="product-name" onClick={() => onSelect(work)}>

                  {pickLang(work.title, lang)}

                </button>

                <div className="product-meta">

                  <span>{pickLang(work.price, lang)}</span>

                  <span>{pickLang(work.size, lang)}</span>

                </div>

                <button type="button" className="product-more" onClick={() => onSelect(work)}>

                  {w.moreInfo}

                </button>

                <button type="button" className="btn btn-blue product-buy" onClick={() => onSelect(work)}>

                  {w.view}

                </button>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>

  );

}

