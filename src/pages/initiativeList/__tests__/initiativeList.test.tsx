import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { InitiativeSummaryArrayDTO } from '../../../api/generated/initiative/apiClient';
import { getInitativeSummary } from '../../../services/intitativeService';
import { createStore } from '../../../redux/store';
import { setPermissionsList } from '../../../redux/slices/permissionsSlice';
import { setInitiativeId, setInitiativeName } from '../../../redux/slices/initiativeSlice';
import { initiativeSummarySelector } from '../../../redux/slices/initiativeSummarySlice';
import routes, { BASE_ROUTE } from '../../../routes';
import { renderWithContext } from '../../../utils/test-utils';
import InitiativeList from '../InitiativeList';

const mockSetLoading = jest.fn();

jest.mock('../../../services/intitativeService', () => ({
  getInitativeSummary: jest.fn(),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/hooks/useLoading', () => ({
  __esModule: true,
  default: () => mockSetLoading,
}));

jest.mock('@pagopa/selfcare-common-frontend/lib', () => ({
  TitleBox: () => <div />,
}));

const mockGetSummary = getInitativeSummary as jest.MockedFunction<typeof getInitativeSummary>;

const makeSummary = (): InitiativeSummaryArrayDTO => [
  {
    initiativeId: 'beta-id',
    initiativeName: 'Beta benefit',
    organizationName: 'Alpha organization',
    status: 'PUBLISHED',
    startDate: '2026-02-01',
    endDate: '2026-12-31',
  },
  {
    initiativeId: 'alpha-id',
    initiativeName: 'Alpha benefit',
    organizationName: 'Zulu organization',
    status: 'DRAFT',
  },
];

const renderList = (canCreate = false) => {
  const store = createStore();
  store.dispatch(
    setPermissionsList([
      { name: 'createInitiative', description: '', mode: canCreate ? 'enabled' : 'disabled' },
    ])
  );
  return renderWithContext(<InitiativeList />, store);
};

const displayedNames = () =>
  screen.getAllByTestId('initiative-btn-test').map((button) => button.textContent);

describe('<InitiativeList />', () => {
  beforeEach(() => {
    mockGetSummary.mockResolvedValue(makeSummary());
    jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  test('loads and stores initiatives, sorts by name, and formats enrollment dates', async () => {
    const { store } = renderList();

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    await screen.findByRole('button', { name: 'Alpha benefit' });
    await waitFor(() => expect(mockSetLoading).toHaveBeenLastCalledWith(false));

    expect(mockGetSummary).toHaveBeenCalledTimes(1);
    expect(initiativeSummarySelector(store.getState())).toEqual(
      expect.arrayContaining(makeSummary())
    );
    expect(displayedNames()).toEqual(['Alpha benefit', 'Beta benefit']);
    expect(screen.getByText('01/02/2026 - 31/12/2026')).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(screen.queryByTestId('menu-open-test')).not.toBeInTheDocument();
  });

  test.each([true, false])(
    'filters case-insensitively and restores results (create permission: %s)',
    async (canCreate) => {
      renderList(canCreate);
      await screen.findByRole('button', { name: 'Alpha benefit' });
      const search = screen.getByRole('textbox');

      fireEvent.change(search, { target: { value: 'BETA' } });
      expect(displayedNames()).toEqual(['Beta benefit']);

      fireEvent.change(search, { target: { value: 'unmatched' } });
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.getByText('pages.initiativeList.emptyList')).toBeInTheDocument();

      fireEvent.change(search, { target: { value: '' } });
      expect(displayedNames()).toEqual(['Alpha benefit', 'Beta benefit']);
    }
  );

  test('toggles name sorting and switches the sort column', async () => {
    renderList();
    await screen.findByRole('button', { name: 'Alpha benefit' });
    const nameHeading = screen.getByText('pages.initiativeList.tableColumns.initiativeName');

    fireEvent.click(nameHeading);
    expect(displayedNames()).toEqual(['Beta benefit', 'Alpha benefit']);
    expect(nameHeading.closest('th')).toHaveAttribute('aria-sort', 'descending');

    fireEvent.click(nameHeading);
    expect(displayedNames()).toEqual(['Alpha benefit', 'Beta benefit']);
    expect(nameHeading.closest('th')).toHaveAttribute('aria-sort', 'ascending');

    const organizationHeading = screen.getByText(
      'pages.initiativeList.tableColumns.organizationName'
    );
    fireEvent.click(organizationHeading);
    expect(displayedNames()).toEqual(['Beta benefit', 'Alpha benefit']);
    expect(organizationHeading.closest('th')).toHaveAttribute('aria-sort', 'ascending');
  });

  test('opens the selected initiative refunds page', async () => {
    const { history } = renderList();
    fireEvent.click(await screen.findByRole('button', { name: 'Beta benefit' }));
    expect(history.location.pathname).toBe(`${BASE_ROUTE}/rimborsi-iniziativa/beta-id`);
  });

  test.each(['create-full-onclick-test', 'create-empty-onclick-test'])(
    'resets the previous initiative and opens creation from %s',
    async (buttonId) => {
      if (buttonId === 'create-empty-onclick-test') {
        mockGetSummary.mockResolvedValue([]);
      }
      const { store, history } = renderList(true);
      await waitFor(() => expect(mockSetLoading).toHaveBeenLastCalledWith(false));
      const initialInitiative = store.getState().initiative;
      store.dispatch(setInitiativeId('previous-id'));
      store.dispatch(setInitiativeName('Previous initiative'));

      fireEvent.click(screen.getByTestId(buttonId));

      expect(history.location.pathname).toBe(routes.NEW_INITIATIVE);
      expect(store.getState().initiative).toEqual(initialInitiative);
    }
  );

  test('shows an empty list without creation actions when creation is denied', async () => {
    mockGetSummary.mockResolvedValue([]);
    const { store } = renderList();
    await waitFor(() => expect(mockSetLoading).toHaveBeenLastCalledWith(false));

    expect(screen.getByText('pages.initiativeList.emptyList')).toBeInTheDocument();
    expect(screen.queryByText('pages.initiativeList.createNew')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(initiativeSummarySelector(store.getState())).toEqual([]);
  });

  test('stops loading and keeps the list empty when the request fails', async () => {
    mockGetSummary.mockRejectedValue(new Error('Request failed'));
    const { store } = renderList();
    await waitFor(() => expect(mockSetLoading).toHaveBeenLastCalledWith(false));

    expect(screen.getByText('pages.initiativeList.emptyList')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(initiativeSummarySelector(store.getState())).toBeUndefined();
  });

  test('renders incomplete summaries with empty fields and missing-date placeholders', async () => {
    mockGetSummary.mockResolvedValue([{}]);
    renderList();
    const button = await screen.findByTestId('initiative-btn-test');
    const cells = within(button.closest('tr') as HTMLElement).getAllByRole('cell');

    expect(button).toBeEmptyDOMElement();
    expect(cells[1]).toBeEmptyDOMElement();
    expect(cells[2]).toHaveTextContent('— - —');
  });
});
