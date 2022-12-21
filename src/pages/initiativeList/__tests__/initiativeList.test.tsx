import { fireEvent, render, screen } from '@testing-library/react';
import InitiativeList from '../InitiativeList';
import React from 'react';
import { store } from '../../../redux/store';
import { getInitativeSummary } from '../../../services/intitativeService';
import { setPermissionsList } from '../../../redux/slices/permissionsSlice';
import { Provider } from 'react-redux';
import { setInitiativeSummaryList } from '../../../redux/slices/initiativeSummarySlice';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

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
        <Router history={history}>
          <InitiativeList />
        </Router>
      </Provider>
    );

    const searchInitiative = screen.getByTestId('search-initiative') as HTMLInputElement;
    fireEvent.change(searchInitiative, { target: { value: 'value' } });
    expect(searchInitiative.value).toBe('value');

    fireEvent.change(searchInitiative, { target: { value: '' } });
    expect(searchInitiative.value).toBe('');
  });

  test('Test render InitiativeList component with review permission', async () => {
    store.dispatch(setInitiativeSummaryList(await getInitativeSummary()));
    store.dispatch(
      setPermissionsList([
        { name: 'reviewInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeList />
        </Router>
      </Provider>
    );

    const searchInitiative = screen.getByPlaceholderText(
      'pages.initiativeList.search'
    ) as HTMLInputElement;

    fireEvent.change(searchInitiative, { target: { value: 'search initiative' } });
    expect(searchInitiative.value).toBe('search initiative');
  });

  test('Test render InitiativeList component with create permission', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'createInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeList />
        </Router>
      </Provider>
    );

    const createNewFullList = screen.getByTestId('create-full-onclick-test') as HTMLButtonElement;
    fireEvent.click(createNewFullList);

    const createNewEmptyList = screen.getByTestId('create-empty-onclick-test') as HTMLButtonElement;
    fireEvent.click(createNewEmptyList);

    const searchInitiative = screen.getByTestId('search-initiative-test') as HTMLInputElement;
    fireEvent.change(searchInitiative, { target: { value: 'initiative' } });
    expect(searchInitiative.value).toBe('initiative');

    fireEvent.change(searchInitiative, { target: { value: '' } });
    expect(searchInitiative.value).toBe('');
  });
});
