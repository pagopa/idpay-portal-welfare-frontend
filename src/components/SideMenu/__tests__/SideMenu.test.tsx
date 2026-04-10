import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { InitiativeSummaryArrayDTO } from '../../../api/generated/initiative/apiClient';
import { setInitiativeSummaryList } from '../../../redux/slices/initiativeSummarySlice';
import { createStore } from '../../../redux/store';
import { BASE_ROUTE } from '../../../routes';
import { renderWithContext } from '../../../utils/test-utils';
import SideMenu from '../SideMenu';

const mockDispatch = jest.fn();
const mockSetAlert = jest.fn();
const mockSetLoading = jest.fn();
const mockGetInitiativeSummary = jest.fn();
const mockParseJwt = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/hooks/useUnloadEventInterceptor', () => ({
  useUnloadEventOnExit: () => (cb: any) => cb(),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/hooks/useLoading', () => ({
  __esModule: true,
  default: () => mockSetLoading,
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', () => ({
  storageTokenOps: { read: () => 'token' },
}));

jest.mock('../../../utils/jwt-utils', () => ({
  parseJwt: (...args: Array<any>) => mockParseJwt(...args),
}));

jest.mock('../../../hooks/useAlert', () => ({
  useAlert: () => ({ setAlert: mockSetAlert }),
}));

jest.mock('../../../services/intitativeService', () => ({
  getInitativeSummary: (...args: Array<any>) => mockGetInitiativeSummary(...args),
}));

jest.mock('../../../redux/hooks', () => {
  const actual = jest.requireActual('../../../redux/hooks');

  return {
    ...actual,
    useAppDispatch: () => mockDispatch,
  };
});
const oldWindowLocation = global.window.location;

const mockedLocation = {
  assign: jest.fn(),
  pathname: `${BASE_ROUTE}/panoramica-iniziativa/fakeIDIniziativa`,
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeEach(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});
afterEach(cleanup);

afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

describe('<SideMenu />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParseJwt.mockReturnValue({ org_role: 'admin' });
    mockedLocation.pathname = `${BASE_ROUTE}/panoramica-iniziativa/fakeIDIniziativa`;
  });

  const mockedSummary: InitiativeSummaryArrayDTO = [
    {
      creationDate: new Date('2022-12-16T11:24:23.96').toString(),
      initiativeId: '639c4757f9904d5a4e5a3c2e',
      initiativeName: 'Test Graduatoria 16/12',
      rankingEnabled: true,
      status: 'PUBLISHED',
      updateDate: new Date('2022-12-16T11:46:26.335').toString(),
      initiativeRewardType: 'REFUND',
    },
    {
      creationDate: new Date('2022-12-16T15:46:05.37').toString(),
      initiativeId: '639c84ad9a8280046cc04a7c',
      initiativeName: 'Skin care',
      rankingEnabled: false,
      status: 'PUBLISHED',
      updateDate: new Date('2022-12-16T15:52:27.644').toString(),
      initiativeRewardType: 'DISCOUNT',
    },
    {
      creationDate: new Date('2022-12-16T16:20:18.877').toString(),
      initiativeId: '639c8cb29a8280046cc04a7d',
      initiativeName: 'Prova123',
      rankingEnabled: false,
      status: 'PUBLISHED',
      updateDate: new Date('2022-12-19T18:07:34.364').toString(),
      initiativeRewardType: 'REFUND',
    },
    {
      creationDate: new Date('2022-12-19T11:19:41.23').toString(),
      initiativeId: '63a03abd70d330297c486a44',
      initiativeName: 'Soap',
      rankingEnabled: true,
      status: 'IN_REVISION',
      updateDate: new Date('2022-12-19T16:19:39.483').toString(),
      initiativeRewardType: 'REFUND',
    },
    {
      creationDate: new Date('2022-12-19T11:19:45.113').toString(),
      initiativeId: '63a03ac170d330297c486a45',
      initiativeName: 'Keyboard',
      rankingEnabled: false,
      status: 'DRAFT',
      updateDate: new Date('2022-12-23T17:12:15.819').toString(),
      initiativeRewardType: 'DISCOUNT',
    },
    {
      creationDate: new Date('2022-12-19T11:22:45.797').toString(),
      initiativeId: '63a03b7570d330297c486a46',
      initiativeName: 'Mouse',
      rankingEnabled: true,
      status: 'DRAFT',
      updateDate: new Date('2022-12-20T10:41:37.537').toString(),
    },
  ];

  test('fetches summary list and dispatches it when the menu is empty', async () => {
    const store = createStore();
    mockedLocation.pathname = `${BASE_ROUTE}/not-found`;
    mockGetInitiativeSummary.mockResolvedValueOnce([]);
    renderWithContext(<SideMenu />, store);

    await waitFor(() => {
      expect(mockGetInitiativeSummary).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(setInitiativeSummaryList([]));
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  test('expands the matched initiative and shows optional ranking and merchant items', async () => {
    const store = createStore();
    store.dispatch(setInitiativeSummaryList(mockedSummary));
    const rankingItem = mockedSummary.find((item) => item.initiativeName === 'Test Graduatoria 16/12');
    const merchantItem = mockedSummary.find((item) => item.initiativeName === 'Keyboard');

    expect(rankingItem).toBeDefined();
    expect(merchantItem).toBeDefined();

    const history = createMemoryHistory({
      initialEntries: [`${BASE_ROUTE}/panoramica-iniziativa/${rankingItem!.initiativeId}`],
    });
    mockedLocation.pathname = history.location.pathname;

    renderWithContext(<SideMenu />, store, history);

    const firstHeader = screen.getByRole('button', { name: rankingItem!.initiativeName });

    await waitFor(() => expect(firstHeader).toHaveAttribute('aria-expanded', 'true'));

    const firstAccordion = firstHeader.closest('.MuiAccordion-root') as HTMLElement;
    expect(
      within(firstAccordion).getByRole('button', {
        name: 'sideMenu.initiativeRanking.title',
      })
    ).toBeInTheDocument();
    expect(
      within(firstAccordion).queryByRole('button', {
        name: 'sideMenu.initiativeMerchant.title',
      })
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: merchantItem!.initiativeName,
      })
    );

    const secondHeader = screen.getByRole('button', { name: merchantItem!.initiativeName });

    await waitFor(() => expect(secondHeader).toHaveAttribute('aria-expanded', 'true'));

    const secondAccordion = secondHeader.closest('.MuiAccordion-root') as HTMLElement;
    expect(
      within(secondAccordion).getByRole('button', {
        name: 'sideMenu.initiativeMerchant.title',
      })
    ).toBeInTheDocument();
    expect(
      within(secondAccordion).queryByRole('button', {
        name: 'sideMenu.initiativeRanking.title',
      })
    ).not.toBeInTheDocument();
  });

  test('marks active menu paths and keeps inactive items unselected', async () => {
    const store = createStore();
    store.dispatch(setInitiativeSummaryList(mockedSummary));
    const activeItem = mockedSummary.find((item) => item.initiativeName === 'Skin care');

    expect(activeItem).toBeDefined();

    const activePath = `${BASE_ROUTE}/panoramica-iniziativa/${activeItem!.initiativeId}`;
    const history = createMemoryHistory({ initialEntries: [activePath] });
    mockedLocation.pathname = activePath;

    renderWithContext(<SideMenu />, store, history);

    const header = screen.getByRole('button', { name: activeItem!.initiativeName });

    await waitFor(() => expect(header).toHaveAttribute('aria-expanded', 'true'));

    const accordion = header.closest('.MuiAccordion-root') as HTMLElement;
    const overviewItem = within(accordion).getByRole('button', {
      name: 'sideMenu.initiativeOverview.title',
    });
    const usersItem = within(accordion).getByRole('button', {
      name: 'sideMenu.initiativeUsers.title',
    });

    expect(overviewItem).toHaveClass('Mui-selected');
    expect(usersItem).not.toHaveClass('Mui-selected');
  });

  test('shows ranking only for published initiatives with ranking enabled', async () => {
    const store = createStore();
    store.dispatch(setInitiativeSummaryList(mockedSummary));
    const publishedItem = mockedSummary.find(
      (item) => item.initiativeName === 'Test Graduatoria 16/12'
    );
    const inRevisionItem = mockedSummary.find((item) => item.initiativeName === 'Soap');

    expect(publishedItem).toBeDefined();
    expect(inRevisionItem).toBeDefined();

    mockedLocation.pathname = `${BASE_ROUTE}/not-found`;
    renderWithContext(<SideMenu />, store);

    const publishedHeader = screen.getByRole('button', { name: publishedItem!.initiativeName });

    fireEvent.click(publishedHeader);
    await waitFor(() => expect(publishedHeader).toHaveAttribute('aria-expanded', 'true'));

    const publishedAccordion = publishedHeader.closest('.MuiAccordion-root') as HTMLElement;
    expect(
      within(publishedAccordion).getByRole('button', {
        name: 'sideMenu.initiativeRanking.title',
      })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: inRevisionItem!.initiativeName,
      })
    );

    const inRevisionHeader = screen.getByRole('button', { name: inRevisionItem!.initiativeName });

    await waitFor(() => expect(inRevisionHeader).toHaveAttribute('aria-expanded', 'true'));

    const inRevisionAccordion = inRevisionHeader.closest('.MuiAccordion-root') as HTMLElement;
    expect(
      within(inRevisionAccordion).queryByRole('button', {
        name: 'sideMenu.initiativeRanking.title',
      })
    ).not.toBeInTheDocument();
  });

  test('expands the first initiative when no route matches', async () => {
    const store = createStore();
    store.dispatch(setInitiativeSummaryList(mockedSummary));
    mockedLocation.pathname = `${BASE_ROUTE}/not-found`;

    renderWithContext(<SideMenu />, store);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: mockedSummary[0].initiativeName })
      ).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test('renders menu entries and navigates when items are clicked', async () => {
    const store = createStore();
    store.dispatch(setInitiativeSummaryList(mockedSummary));
    mockedLocation.pathname = `${BASE_ROUTE}/not-found`;
    const { history } = renderWithContext(<SideMenu />, store);

    const firstHeader = screen.getByRole('button', { name: mockedSummary[0].initiativeName });

    await waitFor(() => expect(firstHeader).toHaveAttribute('aria-expanded', 'true'));

    const firstAccordion = firstHeader.closest('.MuiAccordion-root');
    expect(firstAccordion).not.toBeNull();

    fireEvent.click(
      within(firstAccordion as HTMLElement).getByRole('button', {
        name: 'sideMenu.initiativeOverview.title',
      })
    );
    expect(history.location.pathname).toContain('/panoramica-iniziativa/');

    fireEvent.click(
      within(firstAccordion as HTMLElement).getByRole('button', {
        name: 'sideMenu.exportReport.title',
      })
    );
    expect(history.location.pathname).toContain('/esporta-report/');

    fireEvent.click(
      within(firstAccordion as HTMLElement).getByRole('button', {
        name: 'sideMenu.exportReportUsers.title',
      })
    );
    expect(history.location.pathname).toContain('/esporta-report-dati-utenti/');
  });

  test('collapses the first accordion when its header is clicked twice', async () => {
    const store = createStore();
    store.dispatch(setInitiativeSummaryList(mockedSummary));
    mockedLocation.pathname = `${BASE_ROUTE}/not-found`;
    renderWithContext(<SideMenu />, store);

    const firstHeader = screen.getByRole('button', { name: mockedSummary[0].initiativeName });

    await waitFor(() => expect(firstHeader).toHaveAttribute('aria-expanded', 'true'));

    fireEvent.click(firstHeader);

    await waitFor(() => expect(firstHeader).toHaveAttribute('aria-expanded', 'false'));
  });

  test('does not navigate again when clicking the active export report item', async () => {
    const store = createStore();
    store.dispatch(setInitiativeSummaryList(mockedSummary));
    const activeItem = mockedSummary.find((item) => item.initiativeName === 'Keyboard');
    expect(activeItem).toBeDefined();

    const currentPath = `${BASE_ROUTE}/esporta-report/${activeItem!.initiativeId}`;
    const history = createMemoryHistory({ initialEntries: [currentPath] });
    mockedLocation.pathname = currentPath;

    const { history: renderedHistory } = renderWithContext(<SideMenu />, store, history);
    const replaceSpy = jest.spyOn(renderedHistory, 'replace');

    const firstHeader = screen.getByRole('button', { name: activeItem!.initiativeName });

    await waitFor(() => expect(firstHeader).toHaveAttribute('aria-expanded', 'true'));

    const firstAccordion = firstHeader.closest('.MuiAccordion-root') as HTMLElement;

    fireEvent.click(
      within(firstAccordion).getByRole('button', {
        name: 'sideMenu.exportReport.title',
      })
    );

    expect(replaceSpy).not.toHaveBeenCalled();
    expect(renderedHistory.location.pathname).toBe(currentPath);
  });

  test('does not navigate again when clicking the active refunds item', async () => {
    const store = createStore();
    store.dispatch(setInitiativeSummaryList(mockedSummary));
    const activeItem = mockedSummary.find((item) => item.initiativeName === 'Test Graduatoria 16/12');
    expect(activeItem).toBeDefined();

    const currentPath = `${BASE_ROUTE}/rimborsi-iniziativa/${activeItem!.initiativeId}`;
    const history = createMemoryHistory({ initialEntries: [currentPath] });
    mockedLocation.pathname = currentPath;

    const { history: renderedHistory } = renderWithContext(<SideMenu />, store, history);
    const replaceSpy = jest.spyOn(renderedHistory, 'replace');

    const firstHeader = screen.getByRole('button', { name: activeItem!.initiativeName });

    await waitFor(() => expect(firstHeader).toHaveAttribute('aria-expanded', 'true'));

    const firstAccordion = firstHeader.closest('.MuiAccordion-root') as HTMLElement;

    fireEvent.click(
      within(firstAccordion).getByRole('button', {
        name: 'sideMenu.initiativeRefunds.title',
      })
    );

    expect(replaceSpy).not.toHaveBeenCalled();
    expect(renderedHistory.location.pathname).toBe(currentPath);
  });

  test('does not navigate again when clicking the active export report users item', async () => {
    const store = createStore();
    store.dispatch(setInitiativeSummaryList(mockedSummary));
    const activeItem = mockedSummary.find((item) => item.initiativeName === 'Keyboard');
    expect(activeItem).toBeDefined();

    const currentPath = `${BASE_ROUTE}/esporta-report-dati-utenti/${activeItem!.initiativeId}`;
    const history = createMemoryHistory({ initialEntries: [currentPath] });
    mockedLocation.pathname = currentPath;

    const { history: renderedHistory } = renderWithContext(<SideMenu />, store, history);
    const replaceSpy = jest.spyOn(renderedHistory, 'replace');

    const firstHeader = screen.getByRole('button', { name: activeItem!.initiativeName });

    await waitFor(() => expect(firstHeader).toHaveAttribute('aria-expanded', 'true'));

    const firstAccordion = firstHeader.closest('.MuiAccordion-root') as HTMLElement;

    fireEvent.click(
      within(firstAccordion).getByRole('button', {
        name: 'sideMenu.exportReportUsers.title',
      })
    );

    expect(replaceSpy).not.toHaveBeenCalled();
    expect(renderedHistory.location.pathname).toBe(currentPath);
  });

  test('marks the initiative users item selected on user details routes', async () => {
    const store = createStore();
    store.dispatch(setInitiativeSummaryList(mockedSummary));
    const activeItem = mockedSummary.find((item) => item.initiativeName === 'Skin care');

    expect(activeItem).toBeDefined();

    const currentPath = `${BASE_ROUTE}/dettagli-utente/${activeItem!.initiativeId}/CFTEST`;
    const history = createMemoryHistory({ initialEntries: [currentPath] });
    mockedLocation.pathname = currentPath;

    renderWithContext(<SideMenu />, store, history);

    const header = screen.getByRole('button', { name: activeItem!.initiativeName });

    await waitFor(() => expect(header).toHaveAttribute('aria-expanded', 'true'));

    const accordion = header.closest('.MuiAccordion-root') as HTMLElement;
    expect(
      within(accordion).getByRole('button', {
        name: 'sideMenu.initiativeUsers.title',
      })
    ).toHaveClass('Mui-selected');
  });

  test('hides restricted items for blocked roles', async () => {
    const store = createStore();
    store.dispatch(setInitiativeSummaryList(mockedSummary));
    mockParseJwt.mockReturnValue({ org_role: 'operator1' });
    renderWithContext(<SideMenu />, store);

    expect(screen.queryByText('sideMenu.initiativeOverview.title')).not.toBeInTheDocument();
    expect(screen.queryByText('sideMenu.initiativeUsers.title')).not.toBeInTheDocument();
  });
});
