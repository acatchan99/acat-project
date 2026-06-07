import { useState, useCallback, useEffect } from 'react';

import Header from '../components/Header';

import Hero from '../components/Hero';

import Mission from '../components/Mission';

import Collections from '../components/Collections';

import Works from '../components/Works';

import Artist from '../components/Artist';

import StreetCases from '../components/StreetCases';

import Pricing from '../components/Pricing';

import Process from '../components/Process';

import Contact from '../components/Contact';

import Footer from '../components/Footer';

import WorkDetail from '../components/WorkDetail';

import PageTransition from '../components/PageTransition';

import { useScrollReveal } from '../hooks/useScrollReveal';

import { useContent } from '../context/ContentContext';

import { getAlbums, getWorksByAlbum } from '../data/content';



export default function DesktopApp() {

  const { content } = useContent();

  const albums = content?.albums ?? getAlbums();

  const [selectedWork, setSelectedWork] = useState(null);

  const [activeAlbum, setActiveAlbum] = useState(() => albums[0]?.id ?? 'fag');

  useScrollReveal();



  useEffect(() => {

    if (albums.length && !albums.some((a) => a.id === activeAlbum)) {

      setActiveAlbum(albums[0].id);

    }

  }, [albums, activeAlbum]);



  const handleSelectWork = useCallback((work) => {

    setSelectedWork(work);

  }, []);



  return (

    <>

      <PageTransition />

      <Header />

      <main>

        <Hero />

        <Mission />

        <Collections onSelectAlbum={setActiveAlbum} />

        <Artist />

        <Works album={activeAlbum} onAlbumChange={setActiveAlbum} onSelect={handleSelectWork} />

        <StreetCases />

        <Pricing />

        <Process />

        <Contact />

      </main>

      <Footer />

      {selectedWork && (
        <WorkDetail
          work={selectedWork}
          items={getWorksByAlbum(activeAlbum)}
          onChange={setSelectedWork}
          onClose={() => setSelectedWork(null)}
        />
      )}

    </>

  );

}

