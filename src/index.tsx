import '@pagopa/selfcare-common-frontend/lib/common-polyfill';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@pagopa/selfcare-common-frontend/index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import './bootstrap';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './redux/store';
import './consentAndAnalyticsConfiguration';
import './locale';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Root element with id "root" not found');
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();