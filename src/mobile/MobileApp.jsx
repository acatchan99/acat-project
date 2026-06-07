import { useState, useCallback, useEffect } from 'react';
import MobileHeader from './components/MobileHeader';
import MobileTabBar from './components/MobileTabBar';
import MobileHero from './components/MobileHero';
import MobileAbout from './components/MobileAbout';
import MobileArtist from './components/MobileArtist';
import MobileWorks from './components/MobileWorks';
import MobileStreetCases from './components/MobileStreetCases';
import MobilePricing from './components/MobilePricing';
import MobileProcess from './components/MobileProcess';
import MobileContact from './components/MobileContact';
import WorkDetail from '../components/WorkDetail';
import { useContent } from '../context/ContentContext';
import { getAlbums, getWorksByAlbum } from '../data/content';

export default function MobileApp() {
  const { content } = useContent();
  const albums = content?.albums ?? getAlbums();
  const [selectedWork, setSelectedWork] = useState(null);
  const [activeAlbum, setActiveAlbum] = useState(() => albums[0]?.id ?? 'fag');

  useEffect(() => {
    if (albums.length && !albums.some((a) => a.id === activeAlbum)) {
      setActiveAlbum(albums[0].id);
    }
  }, [albums, activeAlbum]);

  const handleSelectWork = useCallback((work) => {
    setSelectedWork(work);
  }, []);

  return (
    <div className="mobile-shell">
      <MobileHeader />
      <main className="m-main">
        <MobileHero />
        <MobileAbout />
        <MobileArtist />
        <MobileWorks
          album={activeAlbum}
          onAlbumChange={setActiveAlbum}
          onSelect={handleSelectWork}
        />
        <MobileStreetCases />
        <MobilePricing />
        <MobileProcess />
        <MobileContact />
      </main>
      <MobileTabBar />
      {selectedWork && (
        <WorkDetail
          work={selectedWork}
          items={getWorksByAlbum(activeAlbum)}
          onChange={setSelectedWork}
          onClose={() => setSelectedWork(null)}
        />
      )}
    </div>
  );
}
