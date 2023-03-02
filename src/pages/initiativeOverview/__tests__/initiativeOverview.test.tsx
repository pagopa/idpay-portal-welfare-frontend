import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { setGeneralInfo, setInitiativeId, setStatus } from '../../../redux/slices/initiativeSlice';
import { setPermissionsList } from '../../../redux/slices/permissionsSlice';
import { createStore } from '../../../redux/store';
import ROUTES from '../../../routes';
import { BeneficiaryTypeEnum } from '../../../utils/constants';
import InitiativeOverview from '../initiativeOverview';

export function mockLocationFunction() {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useLocation: jest.fn().mockReturnValue({
      pathname: '/localhost:3000/portale-enti',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }),
  };
}

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  //@ts-expect-error
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    ancestorOrigins: ['string'] as unknown as DOMStringList,
    hash: 'hash',
    host: 'localhost',
    port: '3000',
    protocol: 'http:',
    hostname: 'localhost:3000/portale-enti',
    href: 'http://localhost:3000/portale-enti/panoramica-iniziativa/2333333',
    origin: 'http://localhost:3000/portale-enti',
    pathname: ROUTES.INITIATIVE_OVERVIEW,
    search: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
});

afterEach(cleanup);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

window.scrollTo = jest.fn();

describe('<InitiativeOverview />', (injectedStore?: ReturnType<
  typeof createStore
>, injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test Button details', async () => {
    store.dispatch(setStatus('IN_REVISION'));
    store.dispatch(setInitiativeId('233333'));
    store.dispatch(
      setGeneralInfo({
        beneficiaryType: BeneficiaryTypeEnum.PF,
        beneficiaryKnown: 'true',
        rankingEnabled: undefined,
        budget: '',
        beneficiaryBudget: '',
        startDate: undefined,
        endDate: undefined,
        rankingStartDate: undefined,
        rankingEndDate: undefined,
        introductionTextIT: undefined,
        introductionTextEN: undefined,
        introductionTextFR: undefined,
        introductionTextDE: undefined,
        introductionTextSL: undefined,
      })
    );
    store.dispatch(
      setPermissionsList([
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );

    const datailsBtn = screen.getByTestId('view-datails-test') as HTMLButtonElement;
    fireEvent.click(datailsBtn);
  });

  test('Test TO_CHECK button', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'publishInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );
    store.dispatch(setStatus('TO_CHECK'));

    const toCheckBtn = screen.getByTestId('to-check-onclick-test');
    fireEvent.click(toCheckBtn);
  });

  test('Test APPROVED button', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'publishInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );
    store.dispatch(setStatus('APPROVED'));
    const approvedBtn = screen.getByTestId('approved-onclick-test');
    fireEvent.click(approvedBtn);
  });

  test('Test DRAFT button', async () => {
    store.dispatch(setStatus('DRAFT'));
    store.dispatch(
      setPermissionsList([
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );

    store.dispatch(setStatus('DRAFT'));

    const draftBtn = screen.getByTestId('draft-onclick-test');
    fireEvent.click(draftBtn);
  });

  test('Testing breadCrumb back button', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );

    const overviewBackBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    // Not Found
    const oldLocPathname = history.location.pathname;
    fireEvent.click(overviewBackBtn);
    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());
  });

  test('Test revision Button', () => {
    store.dispatch(setStatus('IN_REVISION'));
    store.dispatch(
      setPermissionsList([
        { name: 'reviewInitiative', description: 'description', mode: 'enabled' },
      ])
    );

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );

    const revisionBtn = screen.getByTestId('revision-onclick-test') as HTMLButtonElement;
    fireEvent.click(revisionBtn);
  });

  test('Test of update action button', () => {
    store.dispatch(
      setPermissionsList([
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );
    store.dispatch(setStatus('APPROVED'));

    const updateActionBtn = screen.getByText('pages.initiativeList.actions.update');
    fireEvent.click(updateActionBtn);
  });

  test('Test of view users button', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <InitiativeOverview />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    store.dispatch(
      setGeneralInfo({
        beneficiaryType: BeneficiaryTypeEnum.PF,
        beneficiaryKnown: 'true',
        rankingEnabled: undefined,
        budget: '',
        beneficiaryBudget: '',
        startDate: undefined,
        endDate: undefined,
        rankingStartDate: undefined,
        rankingEndDate: undefined,
        introductionTextIT: undefined,
        introductionTextEN: undefined,
        introductionTextFR: undefined,
        introductionTextDE: undefined,
        introductionTextSL: undefined,
      })
    );

    store.dispatch(setStatus('PUBLISHED'));
    store.dispatch(setInitiativeId(':id'));

    const viewUsers = screen.getByText(/pages.initiativeOverview.next.ViewUsers/);
    fireEvent.click(viewUsers);
  });
});
