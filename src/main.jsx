import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LangProvider } from './context/LangContext';
import { PageTransitionProvider } from './context/PageTransitionContext';
import App from './App';
import './style.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LangProvider>
      <PageTransitionProvider>
        <App />
      </PageTransitionProvider>
    </LangProvider>
  </StrictMode>,
);
