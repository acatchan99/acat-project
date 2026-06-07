import { useEffect } from 'react';
import { getWorksByAlbum } from '../data/content';

/** 切换 / 进入作品集时预加载当前专辑全部缩略图 */
export function useAlbumImagePreload(albumId) {
  useEffect(() => {
    if (!albumId) return undefined;
    const works = getWorksByAlbum(albumId);
    const imgs = works.map((w) => {
      if (!w?.image) return null;
      const img = new Image();
      img.src = w.image;
      return img;
    });
    return () => {
      imgs.forEach((img) => {
        if (img) img.src = '';
      });
    };
  }, [albumId]);
}

/** 首次进入作品集时预取各专辑前几项 */
export function usePrefetchAllAlbums(albumIds) {
  const key = albumIds?.join(',') ?? '';
  useEffect(() => {
    if (!key) return undefined;
    const ids = key.split(',');
    const imgs = [];
    ids.forEach((id) => {
      getWorksByAlbum(id).slice(0, 6).forEach((w) => {
        if (!w?.image) return;
        const img = new Image();
        img.src = w.image;
        imgs.push(img);
      });
    });
    return () => {
      imgs.forEach((img) => { img.src = ''; });
    };
  }, [key]);
}
