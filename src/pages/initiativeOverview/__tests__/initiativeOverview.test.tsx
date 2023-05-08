import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { BeneficiaryTypeEnum } from '../../../api/generated/initiative/InitiativeGeneralDTO';
import { InitiativeStatisticsDTO } from '../../../api/generated/initiative/InitiativeStatisticsDTO';
import { setGeneralInfo, setInitiativeId, setStatus } from '../../../redux/slices/initiativeSlice';
import { setPermissionsList } from '../../../redux/slices/permissionsSlice';
import { store } from '../../../redux/store';
import { BASE_ROUTE } from '../../../routes';
import { mockedInitiativeId } from '../../../services/__mocks__/groupService';
import { mockedInitiativeStatistics } from '../../../services/__mocks__/initiativeService';
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
});

const oldWindowLocation = global.window.location;

const mockedLocation = {
  assign: jest.fn(),
  pathname: `${BASE_ROUTE}/panoramica-iniziativa/${mockedInitiativeId}`,
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

afterEach(cleanup);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

describe('<InitiativeOverview />', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  window.scrollTo = jest.fn();
  test('Test Button details', async () => {
    store.dispatch(setStatus('IN_REVISION'));
    store.dispatch(setInitiativeId(mockedInitiativeId));
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
    store.dispatch(setInitiativeId(mockedInitiativeId));

    const viewUsers = screen.getByText(/pages.initiativeOverview.next.viewUsers/);
    fireEvent.click(viewUsers);
  });

  test('Test initiative statistic with empty response', async () => {
    store.dispatch(setStatus('PUBLISHED'));
    store.dispatch(setInitiativeId(mockedInitiativeId));
    InitiativeApiMocked.initiativeStatistics = async (_id: string): Promise<any> =>
      new Promise<void>((resolve) => resolve());

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <InitiativeOverview />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });

  test('Test initiativeStatistic api call', async () => {
    store.dispatch(setStatus('PUBLISHED'));
    store.dispatch(setInitiativeId(mockedInitiativeId));
    InitiativeApiMocked.initiativeStatistics = async (
      _id: string
    ): Promise<InitiativeStatisticsDTO> =>
      new Promise((resolve) => resolve(mockedInitiativeStatistics));

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <InitiativeOverview />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });

  test('Test initiative statistic with empty response', async () => {
    store.dispatch(setStatus('PUBLISHED'));
    store.dispatch(setInitiativeId(mockedInitiativeId));

    InitiativeApiMocked.initiativeStatistics = async (
      _id: string
    ): Promise<InitiativeStatisticsDTO> => Promise.reject('test reject case of api call');

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <InitiativeOverview />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });

  test('test handle close deleteModal', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'deleteInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    store.dispatch(setInitiativeId(mockedInitiativeId));
    store.dispatch(setStatus('APPROVED'));
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );

    const viewActionBtn = screen.getByTestId('view-action-button-test');
    fireEvent.click(viewActionBtn);

    const deleteBtn = await screen.findByTestId('delete-button-test');
    fireEvent.click(deleteBtn);
  });

  test('test initiative status undefined', async () => {
    store.dispatch(setStatus(undefined));
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );
    store.dispatch(setStatus(undefined));
  });

  test('render initiativeOverview without id in the header', () => {
    const oldWindowLocation = global.window.location;

    const mockedLocation = {
      assign: jest.fn(),
      pathname: `${BASE_ROUTE}/panoramica-iniziativa`,
      origin: 'MOCKED_ORIGIN',
      search: '',
      hash: '',
    };

    Object.defineProperty(window, 'location', { value: mockedLocation });

    Object.defineProperty(window, 'location', { value: oldWindowLocation });

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </Provider>
    );
  });
});
