import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cloneDefaultContent } from '../data/defaultContent';
import { applySiteContent } from '../data/contentSync';
import { mergeRemoteContent } from '../lib/mergeRemoteContent';
import { api } from '../lib/api';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContentState] = useState(() => {
    const initial = cloneDefaultContent();
    applySiteContent(initial);
    return initial;
  });
  const [cmsOnline, setCmsOnline] = useState(false);

  const setContent = useCallback((next) => {
    setContentState(next);
    applySiteContent(next);
  }, []);

  useEffect(() => {
    api.fetchContent()
      .then((remote) => {
        setContent(mergeRemoteContent(remote));
        setCmsOnline(true);
      })
      .catch(() => setCmsOnline(false));
  }, [setContent]);

  return (
    <ContentContext.Provider value={{ content, setContent, cmsOnline }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
