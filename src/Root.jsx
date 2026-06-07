import { Suspense, lazy } from 'react';
import { useMediaQuery, MOBILE_QUERY } from './hooks/useMediaQuery';
import { ContentProvider } from './context/ContentContext';
import { LangProvider } from './context/LangContext';
import { PageTransitionProvider } from './context/PageTransitionContext';
import DesktopApp from './desktop/DesktopApp';
import MobileApp from './mobile/MobileApp';

const AdminApp = lazy(() => import('./admin/AdminApp'));

function AppLoader() {
  return (
    <div className="app-loader" role="status" aria-label="Loading">
      <span className="app-loader-dot" />
      <span className="app-loader-dot" />
      <span className="app-loader-dot" />
    </div>
  );
}

export default function Root() {
  const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Suspense fallback={<AppLoader />}>
        <AdminApp />
      </Suspense>
    );
  }

  return (
    <ContentProvider>
      <LangProvider>
        <PageTransitionProvider>
          <SiteApp />
        </PageTransitionProvider>
      </LangProvider>
    </ContentProvider>
  );
}

function SiteApp() {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  return isMobile ? <MobileApp /> : <DesktopApp />;
}
