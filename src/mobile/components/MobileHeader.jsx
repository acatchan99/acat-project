import { useLang } from '../../context/LangContext';
import { useScrollTo } from '../../hooks/useScrollTo';

export default function MobileHeader() {
  const { lang, toggleLang } = useLang();
  const scrollTo = useScrollTo();

  return (
    <header className="m-header">
      <button type="button" className="m-logo" onClick={() => scrollTo('hero')}>
        <img src="/fag-logo.png" alt="ACAT 陈吖猫" className="m-logo-icon" />
        <span>ACAT</span>
      </button>
      <button type="button" className="m-lang" onClick={toggleLang}>
        {lang === 'zh' ? 'EN' : '中文'}
      </button>
    </header>
  );
}
