import { useLang } from '../context/LangContext';
import { useNavigate } from '../hooks/useNavigate';

const NAV_ITEMS = [
  { id: 'about', labelKey: 'about' },
  { id: 'works', labelKey: 'works' },
  { id: 'street-cases', labelKey: 'streetCases' },
  { id: 'artists', labelKey: 'artist' },
  { id: 'contact', labelKey: 'contact' },
];

export default function Header() {
  const { lang, toggleLang, t } = useLang();
  const { goTo } = useNavigate();
  const nav = t('nav');

  return (
    <header className="site-header">
      <div className="container header-row">
        <button type="button" className="logo" onClick={() => goTo('hero')}>
          <img src="/fag-logo.png" alt="" className="logo-icon" />
          <span>ACAT</span>
        </button>

        <nav className="nav-center">
          {NAV_ITEMS.map(({ id, labelKey }) => (
            <button
              key={id}
              type="button"
              className="nav-link"
              onClick={() => goTo(id)}
            >
              {nav[labelKey]}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="nav-link lang-switch"
            onClick={toggleLang}
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </div>
    </header>
  );
}
