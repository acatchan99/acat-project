import { Suspense, lazy } from 'react';
import { useMediaQuery, MOBILE_QUERY } from './hooks/useMediaQuery';

const DesktopApp = lazy(() => import('./desktop/DesktopApp'));
const MobileApp = lazy(() => import('./mobile/MobileApp'));

function AppLoader() {
  return (
    <div className="app-loader" role="status" aria-label="Loading">
      <span className="app-loader-dot" />
      <span className="app-loader-dot" />
      <span className="app-loader-dot" />
    </div>
  );
}

export default function App() {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return (
    <Suspense fallback={<AppLoader />}>
      {isMobile ? <MobileApp /> : <DesktopApp />}
    </Suspense>
  );
}
