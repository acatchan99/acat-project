import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Root from './Root';
import './style.css';
import './mobile/mobile.css';
import './admin/admin.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
