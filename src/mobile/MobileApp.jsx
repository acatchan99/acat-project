import { useState, useCallback } from 'react';
import MobileHeader from './components/MobileHeader';
import MobileTabBar from './components/MobileTabBar';
import MobileHero from './components/MobileHero';
import MobileAbout from './components/MobileAbout';
import MobileArtist from './components/MobileArtist';
import MobileWorks from './components/MobileWorks';
import MobileStreetCases from './components/MobileStreetCases';
import MobileContact from './components/MobileContact';
import WorkDetail from '../components/WorkDetail';

export default function MobileApp() {
  const [selectedWork, setSelectedWork] = useState(null);
  const [activeAlbum, setActiveAlbum] = useState('fag');

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
        <MobileContact />
      </main>
      <MobileTabBar />
      {selectedWork && (
        <WorkDetail work={selectedWork} onClose={() => setSelectedWork(null)} />
      )}
    </div>
  );
}
