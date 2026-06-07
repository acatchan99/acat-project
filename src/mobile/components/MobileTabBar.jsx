import { useLang } from '../../context/LangContext';
import { useScrollTo } from '../../hooks/useScrollTo';

const TABS = [
  { id: 'about', labelKey: 'about' },
  { id: 'works', labelKey: 'works' },
  { id: 'street-cases', labelKey: 'streetCases' },
  { id: 'contact', labelKey: 'contact' },
];

export default function MobileTabBar() {
  const { t } = useLang();
  const nav = t('nav');
  const scrollTo = useScrollTo();

  return (
    <nav className="m-tabbar" aria-label="Mobile navigation">
      {TABS.map(({ id, labelKey }) => (
        <button
          key={id}
          type="button"
          className="m-tab"
          onClick={() => scrollTo(id)}
        >
          {nav[labelKey]}
        </button>
      ))}
    </nav>
  );
}
