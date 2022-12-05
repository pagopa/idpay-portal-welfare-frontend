import React, { FC, ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, RenderOptions } from '@testing-library/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { store } from '../redux/store';
import { createStore } from '../redux/store';

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);

export const renderWithProviders = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

type ContextProps = {
  element?: ReactElement;
  injectedStore?: ReturnType<typeof createStore>;
  injectedHistory?: ReturnType<typeof createMemoryHistory>;
};

export const renderWithContext = ({ element, injectedStore, injectedHistory }: ContextProps) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  const storeInjected = injectedStore ? injectedStore : createStore();
  render(
    <Provider store={storeInjected}>
      <Router history={history}>{element}</Router>
    </Provider>
  );
  return { store, history };
};

export * from '@testing-library/react';
// export { customRender as renderWithProviders };
