import { useMemo } from 'react';
import { useLang } from '../../context/LangContext';
import { useScrollTo } from '../../hooks/useScrollTo';
import { useScrollSpy } from '../../hooks/useScrollSpy';

const TABS = [
  { id: 'about', labelKey: 'about' },
  { id: 'artists', labelKey: 'artist' },
  { id: 'works', labelKey: 'works' },
  { id: 'street-cases', labelKey: 'streetCases' },
  { id: 'pricing', labelKey: 'pricing' },
  { id: 'contact', labelKey: 'contact' },
];

export default function MobileTabBar() {
  const { t } = useLang();
  const nav = t('nav');
  const scrollTo = useScrollTo();
  const sectionIds = useMemo(() => TABS.map((tab) => tab.id), []);
  const activeId = useScrollSpy(sectionIds);

  return (
    <nav className="m-tabbar" aria-label="Mobile navigation">
      {TABS.map(({ id, labelKey }) => (
        <button
          key={id}
          type="button"
          className={`m-tab${activeId === id ? ' m-tab--active' : ''}`}
          onClick={() => scrollTo(id)}
          aria-current={activeId === id ? 'page' : undefined}
        >
          {nav[labelKey]}
        </button>
      ))}
    </nav>
  );
}
