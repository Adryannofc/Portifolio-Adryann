import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from './contexts/I18nContext';
import './styles/tokens.css';
import './styles/styles.css';
import './styles/bottom-nav.css';
import './styles/case-study.css';
import './styles/diagnostico.css';
import './styles/admin.css';
import './styles/not-found.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <App />
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
);
