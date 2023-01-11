import { store } from '../../../redux/store';
import { TOS } from '../TOS';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div></div>,
}));

window.scrollTo = jest.fn();

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<TOS />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('render TOS components', () => {
    render(
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <Provider store={store}>
            <TOS />
          </Provider>
        </Router>
      </ThemeProvider>
    );
  });
});
