import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import InitiativeList from '../InitiativeList';
import React from 'react';
import { store } from '../../../redux/store';
import { getInitativeSummary } from '../../../services/intitativeService';
import { setPermissionsList } from '../../../redux/slices/permissionsSlice';
import { Provider } from 'react-redux';
import { theme } from '@pagopa/mui-italia';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { ThemeProvider } from '@mui/system';
import { setStatus } from '../../../redux/slices/initiativeSlice';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div></div>,
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

window.scrollTo = jest.fn();

describe('<InitiativeList />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test render InitiativeList component with update permission', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <InitiativeList />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const searchInitiative = screen.getByTestId(
      'search-initiative-no-permission-test'
    ) as HTMLInputElement;

    fireEvent.change(searchInitiative, { target: { value: 'Fish' } });
    expect(searchInitiative.value).toBe('Fish');

    const menuButton = await waitFor(() => {
      return screen.getAllByTestId('menu-open-test');
    });

    fireEvent.click(menuButton[2]);

    const updateBtn = screen.getByText('pages.initiativeList.actions.update');
    fireEvent.click(updateBtn);

    fireEvent.change(searchInitiative, { target: { value: '' } });
    expect(searchInitiative.value).toBe('');
  });

  test('Test render InitiativeList component with delete permission', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'deleteInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <InitiativeList />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const searchInitiative = screen.getByTestId(
      'search-initiative-no-permission-test'
    ) as HTMLInputElement;

    fireEvent.change(searchInitiative, { target: { value: 'Fish' } });
    expect(searchInitiative.value).toBe('Fish');

    const menuButton = await waitFor(() => {
      return screen.getAllByTestId('menu-open-test');
    });

    fireEvent.click(menuButton[2]);

    const deleteBtn = screen.getByText('pages.initiativeList.actions.delete');
    fireEvent.click(deleteBtn);
  });

  test('Test render InitiativeList component with create permission', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'createInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <InitiativeList />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const createNewFullList = screen.getByTestId('create-full-onclick-test') as HTMLButtonElement;
    fireEvent.click(createNewFullList);

    const createNewEmptyList = screen.getByTestId('create-empty-onclick-test') as HTMLButtonElement;
    fireEvent.click(createNewEmptyList);

    const searchInitiative = screen.getByTestId('search-initiative-test') as HTMLInputElement;
    fireEvent.change(searchInitiative, { target: { value: 'Fish' } });
    expect(searchInitiative.value).toBe('Fish');
    fireEvent.change(searchInitiative, { target: { value: '' } });
    expect(searchInitiative.value).toBe('');
  });

  test('Test FilterList of InitiativeList', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <InitiativeList />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const searchInitiative = screen.getByTestId('search-initiative-test') as HTMLInputElement;
    fireEvent.change(searchInitiative, { target: { value: 'Fish' } });
    expect(searchInitiative.value).toBe('Fish');
  });

  test('Test Open/Close Menu of initiative list item', async () => {
    store.dispatch(setStatus('APPROVED'));
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <InitiativeList />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const searchInitiative = screen.getByTestId('search-initiative-test') as HTMLInputElement;
    fireEvent.change(searchInitiative, { target: { value: 'Fish' } });

    const menuButton = await waitFor(() => {
      return screen.getAllByTestId('menu-open-test');
    });
    fireEvent.click(menuButton[0]);

    const detailBtn = screen.getByText('pages.initiativeList.actions.details');
    fireEvent.click(detailBtn);

    const menuOnClose = await waitFor(() => {
      return screen.getAllByTestId('menu-close-test');
    });
    fireEvent.keyDown(menuOnClose[0], {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
  });
});
