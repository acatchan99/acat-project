import { Suspense, lazy } from 'react';
import { useMediaQuery, MOBILE_QUERY } from './hooks/useMediaQuery';

const DesktopApp = lazy(() => import('./desktop/DesktopApp'));
const MobileApp = lazy(() => import('./mobile/MobileApp'));
const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function Root() {
  const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    );
  }

  return <SiteApp />;
}

function SiteApp() {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return (
    <Suspense fallback={null}>
      {isMobile ? <MobileApp /> : <DesktopApp />}
    </Suspense>
  );
}
