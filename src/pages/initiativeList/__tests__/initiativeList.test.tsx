import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import InitiativeList from '../InitiativeList';
import { renderWithContext } from '../../../utils/test-utils';
import React from 'react';
import { store } from '../../../redux/store';
import { setInitiative } from '../../../redux/slices/initiativeSlice';
import { mockedInitiative } from '../../../model/__tests__/Initiative.test';
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

  test('Should render the Initiative List', async () => {
    store.dispatch(setInitiative(mockedInitiative));
    store.dispatch(
      setPermissionsList([
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    renderWithContext(<InitiativeList />);
    // await waitFor(() => expect(getInitativeSummary()).toEqual({ response: 'mocked' }));

    // screen.debug();
    const searchInitiative = screen.getByTestId('search-initiative') as HTMLInputElement;

    fireEvent.change(searchInitiative, { target: { value: 'value' } });
    await waitFor(() => expect(searchInitiative.value).toBe('value'));

    // const initiativeBtn = document.querySelector('initiative-btn-test') as HTMLButtonElement;
    // userEvent.click(initiativeBtn);
  });

  test('Should render the Initiative List', async () => {
    store.dispatch(setInitiativeSummaryList(await getInitativeSummary()));
    store.dispatch(
      setPermissionsList([
        { name: 'reviewInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    //renderWithContext(<InitiativeList />);
    render(
      <Provider store={store}>
        <InitiativeList />
      </Provider>
    );
    const searchInitiative = screen.getByPlaceholderText(
      'pages.initiativeList.search'
    ) as HTMLInputElement;

    fireEvent.change(searchInitiative, { target: { value: 'search initiative' } });
    expect(searchInitiative.value).toBe('search initiative');
  });

  test('Should render the Initiative List with status approved', async () => {
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

    const searchInitiative = screen.getByTestId('search-initiative-test') as HTMLInputElement;

    fireEvent.change(searchInitiative, { target: { value: 'initiative' } });
    expect(searchInitiative.value).toBe('initiative');
  });
});
