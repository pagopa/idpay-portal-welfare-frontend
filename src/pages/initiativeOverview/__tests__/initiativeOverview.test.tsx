import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { InitiativeGeneralDtoBeneficiaryTypeEnum } from '../../../api/generated/initiative/apiClient';
import {
  resetInitiative,
  setAdditionalInfo,
  setGeneralInfo,
  setInitiativeCreationDate,
  setInitiativeId,
  setInitiativeName,
  setInitiativeUpdateDate,
  setStatus,
} from '../../../redux/slices/initiativeSlice';
import { setPermissionsList } from '../../../redux/slices/permissionsSlice';
import { createStore } from '../../../redux/store';
import ROUTES, { BASE_ROUTE } from '../../../routes';
import InitiativeOverview from '../initiativeOverview';

const mockUseInitiative = jest.fn();
const mockSetLoading = jest.fn();
const mockGetGroupOfBeneficiaryStatusAndDetail = jest.fn();
const mockInitiativeStatistics = jest.fn();
const mockUpdateInitiativePublishedStatus = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../../hooks/useInitiative', () => ({
  useInitiative: () => mockUseInitiative(),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/hooks/useLoading', () => ({
  __esModule: true,
  default: () => mockSetLoading,
}));

jest.mock('../../../services/groupsService', () => ({
  getGroupOfBeneficiaryStatusAndDetail: (...args: Array<any>) =>
    mockGetGroupOfBeneficiaryStatusAndDetail(...args),
}));

jest.mock('../../../services/intitativeService', () => ({
  initiativeStatistics: (...args: Array<any>) => mockInitiativeStatistics(...args),
  updateInitiativePublishedStatus: (...args: Array<any>) =>
    mockUpdateInitiativePublishedStatus(...args),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib', () => ({
  TitleBox: ({ title }: { title: string }) => <div data-testid="title-box">{title}</div>,
}));

jest.mock('../../components/BreadcrumbsBox', () => () => <div data-testid="breadcrumbs-box" />);

jest.mock('../../components/ConfirmPublishInitiativeModal', () => (props: any) =>
  props.publishModalOpen ? (
    <div data-testid="publish-modal">
      <button
        data-testid="publish-confirm"
        onClick={() =>
          props.handlePusblishInitiative(props.initiative.initiativeId, props.userCanPublishInitiative)
        }
      >
        confirm
      </button>
      <button data-testid="publish-cancel" onClick={() => props.setPublishModalOpen(false)}>
        cancel
      </button>
    </div>
  ) : null
);

jest.mock('../../components/DeleteInitiativeModal', () => (props: any) =>
  props.openInitiativeDeleteModal ? (
    <div data-testid="delete-modal">
      <button data-testid="delete-modal-close" onClick={props.handleCloseInitiativeDeleteModal}>
        close
      </button>
    </div>
  ) : null
);

jest.mock('../components/StatusSnackBar', () => (props: any) =>
  props.openSnackBar ? <div data-testid="status-snackbar">{props.fileStatus}</div> : null
);

jest.mock('../components/DateReference', () => () => <div data-testid="date-reference" />);

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  jest.resetAllMocks();
  window.scrollTo = jest.fn();
});

const buildGeneralInfo = (beneficiaryKnown: 'true' | 'false') => ({
  beneficiaryType: InitiativeGeneralDtoBeneficiaryTypeEnum.PF,
  beneficiaryKnown,
  rankingEnabled: undefined,
  budget: '1500',
  beneficiaryBudget: '300',
  startDate: undefined,
  endDate: undefined,
  rankingStartDate: undefined,
  rankingEndDate: undefined,
  introductionTextIT: undefined,
  introductionTextEN: undefined,
  introductionTextFR: undefined,
  introductionTextDE: undefined,
  introductionTextSL: undefined,
});

const renderOverview = (params: {
  status: string;
  permissions: Array<{ name: string; description: string; mode: 'enabled' | 'disabled' }>;
  beneficiaryKnown?: 'true' | 'false';
  initiativeId?: string;
  initiativeName?: string;
  serviceId?: string;
  creationDate?: Date;
  updateDate?: Date;
  groupResponse?: any;
  groupRejected?: boolean;
  statisticsResponse?: any;
  statisticsRejected?: boolean;
  publishRejected?: boolean;
}) => {
  const initiativeId = params.initiativeId ?? 'initiative-1';
  const store = createStore();
  const history = createMemoryHistory();

  store.dispatch(resetInitiative(undefined as any));
  store.dispatch(setInitiativeId(initiativeId));
  store.dispatch(setInitiativeName(params.initiativeName ?? 'initiative name'));
  store.dispatch(setStatus(params.status));
  store.dispatch(setGeneralInfo(buildGeneralInfo(params.beneficiaryKnown ?? 'true')));
  if (typeof params.serviceId === 'string') {
    store.dispatch(setAdditionalInfo({ serviceId: params.serviceId } as any));
  }
  if (params.creationDate instanceof Date) {
    store.dispatch(setInitiativeCreationDate(params.creationDate));
  }
  if (params.updateDate instanceof Date) {
    store.dispatch(setInitiativeUpdateDate(params.updateDate));
  }
  store.dispatch(setPermissionsList(params.permissions));

  if (params.groupRejected) {
    mockGetGroupOfBeneficiaryStatusAndDetail.mockRejectedValueOnce(new Error('group fail'));
  } else {
    mockGetGroupOfBeneficiaryStatusAndDetail.mockResolvedValue(
      params.groupResponse ?? { status: 'OK', beneficiariesReached: 11 }
    );
  }
  if (params.statisticsRejected) {
    mockInitiativeStatistics.mockRejectedValueOnce(new Error('stats fail'));
  } else {
    mockInitiativeStatistics.mockResolvedValue(params.statisticsResponse);
  }
  if (params.publishRejected) {
    mockUpdateInitiativePublishedStatus.mockRejectedValueOnce(new Error('publish failed'));
  } else {
    mockUpdateInitiativePublishedStatus.mockResolvedValue(undefined);
  }

  window.history.pushState({}, 'Test', `${BASE_ROUTE}/panoramica-iniziativa/${initiativeId}`);

  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <InitiativeOverview />
        </Router>
      </ThemeProvider>
    </Provider>
  );

  return { store, history, initiativeId };
};

describe('<InitiativeOverview />', () => {
  test('renders revision actions and details view when reviewer cannot review', async () => {
    const { history, initiativeId } = renderOverview({
      status: 'IN_REVISION',
      permissions: [
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
        { name: 'reviewInitiative', description: 'description', mode: 'disabled' },
      ],
      groupResponse: { status: 'KO', beneficiariesReached: 7 },
    });

    await waitFor(() =>
      expect(mockGetGroupOfBeneficiaryStatusAndDetail).toHaveBeenCalledWith(initiativeId)
    );

    expect(screen.getByTestId('view-datails-test')).toBeInTheDocument();
    expect(screen.getByTestId('revision-onclick-test')).toBeInTheDocument();
    expect(screen.getByTestId('status-snackbar')).toHaveTextContent('KO');

    fireEvent.click(screen.getByTestId('view-datails-test'));
    expect(history.location.pathname).toBe(`${BASE_ROUTE}/dettagli-iniziativa/${initiativeId}`);
  });

  test('renders the TO_CHECK reviewer flow without snackbar and disables the button', async () => {
    renderOverview({
      status: 'TO_CHECK',
      permissions: [{ name: 'reviewInitiative', description: 'description', mode: 'enabled' }],
    });

    await waitFor(() => expect(mockGetGroupOfBeneficiaryStatusAndDetail).toHaveBeenCalled());

    expect(screen.getByTestId('to-check-onclick-test')).toBeDisabled();
    expect(screen.queryByTestId('status-snackbar')).not.toBeInTheDocument();
  });

  test('publishes an approved initiative and shows update and delete actions', async () => {
    const { history, initiativeId } = renderOverview({
      status: 'APPROVED',
      permissions: [
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
        { name: 'publishInitiative', description: 'description', mode: 'enabled' },
        { name: 'deleteInitiative', description: 'description', mode: 'enabled' },
      ],
      groupResponse: { status: 'OK', beneficiariesReached: 18 },
    });

    await waitFor(() => expect(screen.getByTestId('approved-onclick-test')).toBeEnabled());

    fireEvent.click(screen.getByTestId('view-custom-test'));
    expect(history.location.pathname).toBe(`${BASE_ROUTE}/iniziativa/${initiativeId}`);

    fireEvent.click(screen.getByTestId('view-action-button-test'));
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('approved-onclick-test'));
    expect(screen.getByTestId('publish-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('publish-confirm'));

    await waitFor(() => {
      expect(mockUpdateInitiativePublishedStatus).toHaveBeenCalledWith(initiativeId);
      expect(history.location.pathname).toBe(ROUTES.HOME);
    });
  });

  test('closes the publish modal when publishing fails', async () => {
    renderOverview({
      status: 'APPROVED',
      permissions: [{ name: 'publishInitiative', description: 'description', mode: 'enabled' }],
      groupResponse: { status: 'OK', beneficiariesReached: 18 },
      publishRejected: true,
    });

    await waitFor(() => expect(screen.getByTestId('approved-onclick-test')).toBeEnabled());

    fireEvent.click(screen.getByTestId('approved-onclick-test'));
    fireEvent.click(screen.getByTestId('publish-confirm'));

    await waitFor(() => expect(screen.queryByTestId('publish-modal')).not.toBeInTheDocument());
    expect(mockUpdateInitiativePublishedStatus).toHaveBeenCalled();
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  test('renders published statistics and the suspend action', async () => {
    const { history, initiativeId } = renderOverview({
      status: 'PUBLISHED',
      permissions: [{ name: 'suspendInitiative', description: 'description', mode: 'enabled' }],
      statisticsResponse: {
        accruedRewards: 42,
        onboardedCitizenCount: 5,
        lastUpdatedDateTime: new Date('2026-03-28T10:15:00.000Z'),
      },
      groupResponse: { status: 'OK', beneficiariesReached: 11 },
    });

    await waitFor(() => expect(mockInitiativeStatistics).toHaveBeenCalled());

    expect(screen.getByTestId('date-reference')).toBeInTheDocument();
    expect(screen.getByTestId('status-snackbar')).toHaveTextContent('OK');
    expect(screen.getByTestId('view-users-test')).toBeInTheDocument();
    expect(screen.getByTestId('view-action-button-test')).toBeDisabled();

    fireEvent.click(screen.getByTestId('view-users-test'));
    expect(history.location.pathname).toBe(`${BASE_ROUTE}/utenti-iniziativa/${initiativeId}`);
  });

  test('handles a closed initiative with empty statistics response', async () => {
    renderOverview({
      status: 'CLOSED',
      permissions: [{ name: 'reviewInitiative', description: 'description', mode: 'enabled' }],
      statisticsResponse: undefined,
      groupResponse: { status: 'OK', beneficiariesReached: 9 },
    });

    await waitFor(() => expect(mockInitiativeStatistics).toHaveBeenCalled());

    expect(screen.getByTestId('date-reference')).toBeInTheDocument();
    expect(screen.queryByTestId('status-snackbar')).not.toBeInTheDocument();
  });

  test('keeps rendering when the statistics call fails', async () => {
    renderOverview({
      status: 'PUBLISHED',
      permissions: [{ name: 'reviewInitiative', description: 'description', mode: 'disabled' }],
      groupResponse: { status: 'OK', beneficiariesReached: 9 },
      statisticsRejected: true,
    });

    await waitFor(() => expect(mockSetLoading).toHaveBeenCalledWith(false));
    expect(screen.getByTestId('date-reference')).toBeInTheDocument();
    expect(screen.getByTestId('status-snackbar')).toHaveTextContent('OK');
  });

  test('keeps rendering when beneficiary file loading fails', async () => {
    renderOverview({
      status: 'IN_REVISION',
      permissions: [{ name: 'reviewInitiative', description: 'description', mode: 'disabled' }],
      groupRejected: true,
    });

    await waitFor(() => expect(mockSetLoading).toHaveBeenCalledWith(false));
    expect(screen.getByTestId('view-datails-test')).toBeInTheDocument();
  });

  test('does not fetch beneficiary details when beneficiaryKnown is false', async () => {
    renderOverview({
      status: 'PUBLISHED',
      beneficiaryKnown: 'false',
      permissions: [],
      statisticsResponse: {
        accruedRewards: 42,
        onboardedCitizenCount: 5,
        lastUpdatedDateTime: new Date('2026-03-28T10:15:00.000Z'),
      },
    });

    await waitFor(() => expect(mockGetGroupOfBeneficiaryStatusAndDetail).not.toHaveBeenCalled());
    await waitFor(() => expect(mockInitiativeStatistics).toHaveBeenCalled());
    expect(screen.queryByTestId('status-snackbar')).not.toBeInTheDocument();
    expect(screen.getByTestId('date-reference')).toBeInTheDocument();
  });

  test('hides the draft CTA when update permission is missing', () => {
    renderOverview({
      status: 'DRAFT',
      permissions: [],
    });

    expect(screen.queryByTestId('draft-onclick-test')).not.toBeInTheDocument();
    expect(screen.queryByText('pages.initiativeOverview.next.status.subtitleDraft')).not.toBeInTheDocument();
  });

  test('shows the TO_CHECK modify flow when review permission is missing', () => {
    const { history } = renderOverview({
      status: 'TO_CHECK',
      beneficiaryKnown: 'false',
      permissions: [],
    });

    expect(screen.getByText('pages.initiativeOverview.next.status.subtitleModify')).toBeInTheDocument();
    expect(screen.getByTestId('to-check-onclick-test')).toBeEnabled();

    fireEvent.click(screen.getByTestId('to-check-onclick-test'));
    expect(history.location.pathname).toBe('/');
  });

  test('shows the approved wait-for-publish subtitle when publish permission is missing', () => {
    renderOverview({
      status: 'APPROVED',
      beneficiaryKnown: 'false',
      permissions: [],
    });

    expect(screen.getByText('pages.initiativeOverview.next.status.waitForPublish')).toBeInTheDocument();
    expect(screen.queryByTestId('approved-onclick-test')).not.toBeInTheDocument();
  });

  test('renders overview fields when service id and dates are available', () => {
    const toLocaleDateStringSpy = jest
      .spyOn(Date.prototype, 'toLocaleDateString')
      .mockReturnValue('formatted-date');

    try {
      renderOverview({
        status: 'DRAFT',
        permissions: [],
        serviceId: 'service-123',
        creationDate: new Date('2024-01-01T00:00:00.000Z'),
        updateDate: new Date('2024-02-01T00:00:00.000Z'),
      });

      expect(screen.getByText('service-123')).toBeInTheDocument();
      expect(screen.getAllByText('formatted-date')).toHaveLength(2);
    } finally {
      toLocaleDateStringSpy.mockRestore();
    }
  });

  test('disables the approved publish action when the beneficiary file is not ready', async () => {
    renderOverview({
      status: 'APPROVED',
      permissions: [{ name: 'publishInitiative', description: 'description', mode: 'enabled' }],
      groupResponse: { status: 'KO', beneficiariesReached: 4 },
    });

    expect(await screen.findByTestId('approved-onclick-test')).toBeDisabled();
  });

  test('renders IN_REVISION reviewer flow with review CTA when reviewer is enabled', async () => {
    renderOverview({
      status: 'IN_REVISION',
      permissions: [{ name: 'reviewInitiative', description: 'description', mode: 'enabled' }],
      groupResponse: { status: 'OK', beneficiariesReached: 10 },
    });

    await waitFor(() => expect(mockGetGroupOfBeneficiaryStatusAndDetail).toHaveBeenCalled());

    expect(screen.queryByTestId('view-datails-test')).not.toBeInTheDocument();
    expect(screen.getByTestId('revision-onclick-test')).toBeInTheDocument();
    expect(
      screen.getByText('pages.initiativeOverview.next.status.checkInitiative')
    ).toBeInTheDocument();
  });

  test('renders the approved snackbar for reviewers while keeping publish available', async () => {
    renderOverview({
      status: 'APPROVED',
      permissions: [
        { name: 'reviewInitiative', description: 'description', mode: 'enabled' },
        { name: 'publishInitiative', description: 'description', mode: 'enabled' },
      ],
      groupResponse: { status: 'OK', beneficiariesReached: 18 },
    });

    await waitFor(() => expect(screen.getByTestId('status-snackbar')).toHaveTextContent('OK'));

    expect(screen.getByTestId('approved-onclick-test')).toBeEnabled();
    expect(screen.queryByTestId('view-custom-test')).not.toBeInTheDocument();
    expect(screen.queryByTestId('view-action-button-test')).not.toBeInTheDocument();
  });

  test('navigates to the initiative editor from draft when update is enabled', () => {
    const { history, initiativeId } = renderOverview({
      status: 'DRAFT',
      permissions: [{ name: 'updateInitiative', description: 'description', mode: 'enabled' }],
    });

    fireEvent.click(screen.getByTestId('draft-onclick-test'));
    expect(history.location.pathname).toBe(`${BASE_ROUTE}/iniziativa/${initiativeId}`);
  });

  test('does not render snackbar in published view for reviewers', async () => {
    renderOverview({
      status: 'PUBLISHED',
      permissions: [{ name: 'reviewInitiative', description: 'description', mode: 'enabled' }],
      statisticsResponse: {
        accruedRewards: 1,
        onboardedCitizenCount: 1,
        lastUpdatedDateTime: new Date('2026-03-28T10:15:00.000Z'),
      },
      groupResponse: { status: 'OK', beneficiariesReached: 2 },
    });

    await waitFor(() => expect(mockInitiativeStatistics).toHaveBeenCalled());
    expect(screen.queryByTestId('status-snackbar')).not.toBeInTheDocument();
  });

  test('shows and closes delete action in draft when delete permission is enabled', async () => {
    renderOverview({
      status: 'DRAFT',
      permissions: [
        { name: 'updateInitiative', description: 'description', mode: 'disabled' },
        { name: 'deleteInitiative', description: 'description', mode: 'enabled' },
      ],
    });

    const deleteBtn = await screen.findByTestId('view-action-button-test');
    fireEvent.click(deleteBtn);
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('delete-modal-close'));
    await waitFor(() => expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument());
  });

  test('shows delete action in approved state when update permission is disabled', async () => {
    renderOverview({
      status: 'APPROVED',
      permissions: [
        { name: 'updateInitiative', description: 'description', mode: 'disabled' },
        { name: 'deleteInitiative', description: 'description', mode: 'enabled' },
        { name: 'publishInitiative', description: 'description', mode: 'disabled' },
      ],
      groupResponse: { status: 'OK', beneficiariesReached: 8 },
    });

    expect(await screen.findByTestId('view-action-button-test')).toBeInTheDocument();
    expect(screen.queryByTestId('view-custom-test')).not.toBeInTheDocument();
    expect(screen.queryByTestId('approved-onclick-test')).not.toBeInTheDocument();
  });
});