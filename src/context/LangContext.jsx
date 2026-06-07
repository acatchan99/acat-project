import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useContent } from './ContentContext';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const { content } = useContent();
  const translations = content?.translations ?? {};
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'zh';
    return localStorage.getItem('acat-lang') || 'zh';
  });

  useEffect(() => {
    localStorage.setItem('acat-lang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((l) => (l === 'zh' ? 'en' : 'zh'));
  }, []);

  const t = useCallback(
    (section) => translations[lang]?.[section] ?? translations.zh?.[section] ?? {},
    [lang, translations],
  );

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
