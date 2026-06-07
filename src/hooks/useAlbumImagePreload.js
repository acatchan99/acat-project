import { useEffect } from 'react';
import { getWorksByAlbum } from '../data/content';
import { getDisplaySrc } from '../lib/imageUrl';
import { wrapIndex } from './useDetailCardStack';

/** 仅预加载当前专辑相邻几张（display 尺寸），避免一次拉满 20 张原图 */
export function useAlbumImagePreload(albumId, currentIndex = 0) {
  useEffect(() => {
    if (!albumId) return undefined;
    const works = getWorksByAlbum(albumId);
    if (!works.length) return undefined;

    const indices = new Set([
      wrapIndex(currentIndex, works.length),
      wrapIndex(currentIndex + 1, works.length),
      wrapIndex(currentIndex - 1, works.length),
    ]);

    const imgs = [...indices].map((i) => {
      const src = works[i]?.image;
      if (!src) return null;
      const img = new Image();
      img.src = getDisplaySrc(src);
      return img;
    });

    return () => {
      imgs.forEach((img) => { if (img) img.src = ''; });
    };
  }, [albumId, currentIndex]);
}
