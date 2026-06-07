import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LangProvider } from './context/LangContext';
import { ContentProvider } from './context/ContentContext';
import { PageTransitionProvider } from './context/PageTransitionContext';
import Root from './Root';
import './style.css';
import './mobile/mobile.css';
import './admin/admin.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContentProvider>
      <LangProvider>
        <PageTransitionProvider>
          <Root />
        </PageTransitionProvider>
      </LangProvider>
    </ContentProvider>
  </StrictMode>,
);
