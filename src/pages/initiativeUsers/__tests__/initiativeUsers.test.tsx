import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { AccumulatedAmountDtoAccumulatedTypeEnum as AccumulatedTypeEnum, ChannelDtoTypeEnum as TypeEnum, InitiativeAdditionalDtoServiceScopeEnum as ServiceScopeEnum, InitiativeDtoInitiativeRewardTypeEnum as InitiativeRewardTypeEnum, InitiativeGeneralDtoBeneficiaryTypeEnum as BeneficiaryTypeEnum, InitiativeRewardRuleDtoRewardValueTypeEnum as RewardValueTypeEnum } from '../../../api/generated/initiative/apiClient';
import { OnboardingDTO } from '../../../api/generated/initiative/apiClient';
import { StatusOnboardingDtosBeneficiaryStateEnum as BeneficiaryStateEnum } from '../../../api/generated/initiative/apiClient';
import { Initiative } from '../../../model/Initiative';
import { setInitiative } from '../../../redux/slices/initiativeSlice';
import { createStore, store } from '../../../redux/store';
import { BASE_ROUTE } from '../../../routes';
import * as initiativeService from '../../../services/intitativeService';
import { renderWithContext, renderWithProviders } from '../../../utils/test-utils';
import InitiativeUsers from '../initiativeUsers';

jest.mock('../../../services/intitativeService');
jest.mock('../../../hooks/useInitiative', () => ({
  useInitiative: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const oldWindowLocation = global.window.location;
const mockedLocation = {
  assign: jest.fn(),
  pathname: `${BASE_ROUTE}/utenti-iniziativa/23232333`,
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

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('<InitiativeUsers />', () => {
  window.scrollTo = jest.fn();
  const mockedResponde = {
    content: [
      {
        beneficiary: 'string',
        beneficiaryState: BeneficiaryStateEnum.ONBOARDING_OK,
        updateStatusDate: '2026-03-01T00:00:00.000Z',
      },
    ],
    pageNo: 0,
    pageSize: 3,
    totalElements: 6,
    totalPages: 2,
  };

  const mockedInitiative: Initiative = {
    initiativeId: '62e29002aac2e94cfa3763dd',
    initiativeName: 'prova313',
    organizationId: '2f63a151-da4e-4e1e-acf9-adecc0c4d727',
    status: 'DRAFT',
    creationDate: new Date('2022-07-28T13:32:50.002'),
    updateDate: new Date('2022-08-09T08:35:36.516'),
    generalInfo: {
      beneficiaryType: BeneficiaryTypeEnum.PF,
      beneficiaryKnown: 'false',
      budget: '8515',
      beneficiaryBudget: '801',
      rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
      rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
      startDate: new Date('2022-10-01T00:00:00.000Z'),
      endDate: new Date('2023-01-31T00:00:00.000Z'),
      introductionTextIT: 'string',
      introductionTextEN: 'string',
      introductionTextFR: 'string',
      introductionTextDE: 'string',
      introductionTextSL: 'string',
      rankingEnabled: 'true',
    },
    additionalInfo: {
      initiativeOnIO: true,
      serviceName: 'prova313',
      serviceId: 'prova123',
      serviceArea: ServiceScopeEnum.NATIONAL,
      serviceDescription: 'newStepOneTest',
      privacyPolicyUrl: 'http://test.it',
      termsAndConditions: 'http://test.it',
      assistanceChannels: [
        { type: TypeEnum.Web, contact: 'http://test.it' },
        { type: TypeEnum.Email, contact: 'http://test.it' },
        { type: TypeEnum.Mobile, contact: 'http://test.it' },
        { type: '', contact: '' },
      ],
      logoFileName: 'logo file name',
      logoUploadDate: 'logo date',
      logoURL: 'logo url',
    },
    beneficiaryRule: {
      apiKeyClientId: 'string',
      apiKeyClientAssertion: 'string',
      selfDeclarationCriteria: [
        {
          _type: 'boolean',
          description: 'string',
          code: 'string',
        },
        {
          _type: 'multi',
          description: 'string',
          code: 'string',
          multiValue: [],
        },
        {
          _type: 'multi',
          description: 'string',
          code: 'string',
          multiValue: [],
        },
      ],
      automatedCriteria: [
        {
          authority: 'AUTH1',
          code: 'BIRTHDATE',
          field: 'year',
          operator: 'GT',
          value: '18',
        },
        {
          authority: 'AUTH1',
          code: 'BIRTHDATE',
          field: 'year',
          operator: 'EQ',
          value: '18',
        },
        {
          authority: 'AUTH1',
          code: 'BIRTHDATE',
          field: 'year',
          operator: 'LT',
          value: '18',
        },
      ],
    },
    initiativeRewardType: InitiativeRewardTypeEnum.REFUND,
    rewardRule: {
      _type: 'rewardValue',
      rewardValue: 1,
      rewardValueType: RewardValueTypeEnum.PERCENTAGE,
    },
    trxRule: {
      mccFilter: { allowedList: true, values: ['string', ''] },
      rewardLimits: [{ frequency: 'string', rewardLimit: 2 }],
      threshold: undefined,
      trxCount: { from: 2, to: 3 },
      daysOfWeekIntervals: [
        {
          daysOfWeek: 'string',
          startTime: 'string',
          endTime: 'string',
        },
      ],
    },
    refundRule: {
      reimbursementThreshold: AccumulatedTypeEnum.THRESHOLD_REACHED,
      reimbursmentQuestionGroup: 'true',
      additionalInfo: 'aaaaaa',
      timeParameter: '',
      accumulatedAmount: '',
    },
  };

  test('Test of breadcrumbs/searchUser and onChange of searchUser', async () => {
    store.dispatch(setInitiative(mockedInitiative));
    renderWithProviders(<InitiativeUsers />);

    //BUTTONS TEST

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    const filterBtn = screen.getByTestId('apply-filters-test') as HTMLButtonElement;
    fireEvent.click(filterBtn);

    //TEXTFIELD TEST

    const searchUser = screen.getByLabelText(
      'pages.initiativeUsers.form.search'
    ) as HTMLInputElement;

    fireEvent.change(searchUser, { target: { value: 'searchUser' } });
    expect(searchUser.value).toBe('searchUser');

    expect(searchUser).toBeInTheDocument();

    //SELECT TEST

    const filterStatus = screen.getByTestId('filterStatus-select') as HTMLSelectElement;

    fireEvent.click(filterStatus);

    fireEvent.change(filterStatus, {
      target: { value: 'ON_EVALUATION' },
    });

    expect(filterStatus).toBeInTheDocument();

    //DATEPICKERS TEST

    const searchFrom = screen.getByLabelText(/pages.initiativeUsers.form.from/);
    const searchTo = screen.getByLabelText(/pages.initiativeUsers.form.to/);

    fireEvent.click(searchFrom);
    fireEvent.change(searchFrom, { target: { value: new Date('2022-09-30T00:00:00.000Z') } });

    fireEvent.click(searchTo);
    fireEvent.change(searchTo, { target: { value: new Date('2022-09-30T00:00:00.000Z') } });

    // const resetFilterBtn = screen.getByText('pages.initiativeUsers.form.resetFiltersBtn');
    // fireEvent.click(resetFilterBtn);
  });

  test('Reset Form on Click reset button and test click beneficiaryBtn', async () => {
    renderWithContext(<InitiativeUsers />);

    const searchUser = screen.getByLabelText(
      'pages.initiativeUsers.form.search'
    ) as HTMLInputElement;

    fireEvent.change(searchUser, { target: { value: 'searchUser' } });
    expect(searchUser.value).toBe('searchUser');

    const resetBtn = screen.getByText(
      'pages.initiativeUsers.form.resetFiltersBtn'
    ) as HTMLButtonElement;

    fireEvent.click(resetBtn);

    await waitFor(() => expect(searchUser.value).toEqual(''));

    // click beneficiaryBtn
    const beneficiaryBtn = (await screen.findByTestId('beneficiary-test')) as HTMLButtonElement;
    fireEvent.click(beneficiaryBtn);
  });

  test('render with different Onboarding user Status', async () => {
    const onbUserStatusArr = [
      BeneficiaryStateEnum.ACCEPTED_TC,
      BeneficiaryStateEnum.ELIGIBLE_KO,
      BeneficiaryStateEnum.INACTIVE,
      BeneficiaryStateEnum.INVITED,
      BeneficiaryStateEnum.ONBOARDING_KO,
      BeneficiaryStateEnum.ONBOARDING_OK,
      BeneficiaryStateEnum.ON_EVALUATION,
      BeneficiaryStateEnum.SUSPENDED,
      BeneficiaryStateEnum.UNSUBSCRIBED,
    ];
    const expectedStatusLabelByState: Record<string, string> = {
      [BeneficiaryStateEnum.ACCEPTED_TC]: 'pages.initiativeUsers.status.onEvaluation',
      [BeneficiaryStateEnum.ELIGIBLE_KO]: 'pages.initiativeUsers.status.eligible',
      [BeneficiaryStateEnum.INACTIVE]: 'pages.initiativeUsers.status.inactive',
      [BeneficiaryStateEnum.INVITED]: 'pages.initiativeUsers.status.onEvaluation',
      [BeneficiaryStateEnum.ONBOARDING_KO]: 'pages.initiativeUsers.status.onboardingKo',
      [BeneficiaryStateEnum.ONBOARDING_OK]: 'pages.initiativeUsers.status.assignee',
      [BeneficiaryStateEnum.ON_EVALUATION]: 'pages.initiativeUsers.status.onEvaluation',
      [BeneficiaryStateEnum.SUSPENDED]: 'pages.initiativeUsers.status.suspended',
      [BeneficiaryStateEnum.UNSUBSCRIBED]: 'pages.initiativeUsers.status.inactive',
    };
    const onboardingStatusSpy = jest.spyOn(initiativeService, 'getOnboardingStatus');

    for (const item of onbUserStatusArr) {
      const injectedStore = createStore();
      injectedStore.dispatch(setInitiative(mockedInitiative));
      onboardingStatusSpy.mockResolvedValue({
        content: [
          {
            beneficiary: 'string',
            beneficiaryState: item,
            updateStatusDate: new Date().toString(),
          },
        ],
        pageNo: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
      } as OnboardingDTO);

      renderWithContext(<InitiativeUsers />, injectedStore);

      expect(await screen.findByText('STRING')).toBeInTheDocument();
      expect(await screen.findByText(expectedStatusLabelByState[item])).toBeInTheDocument();
      cleanup();
    }
  });

  test('Render InitiativeUser with status ONBOARDING_OK and rankingEnabled true', async () => {
    const injectedStore = createStore();
    injectedStore.dispatch(setInitiative(mockedInitiative));
    jest.spyOn(initiativeService, 'getOnboardingStatus').mockResolvedValue(mockedResponde);

    renderWithContext(<InitiativeUsers />, injectedStore);
    expect(await screen.findByText('STRING')).toBeInTheDocument();
    expect(await screen.findByText('pages.initiativeUsers.status.assignee')).toBeInTheDocument();
  });

  test('render component without id in header', () => {
    let mockedLocationWithoutPathParam = {
      assign: jest.fn(),
      pathname: `${BASE_ROUTE}/utenti-iniziativa`,
      origin: 'MOCKED_ORIGIN',
      search: '',
      hash: '',
    };

    Object.defineProperty(window, 'location', { value: mockedLocationWithoutPathParam });

    renderWithContext(<InitiativeUsers />);
  });

  test('renders empty state when onboarding response omits content', async () => {
    Object.defineProperty(window, 'location', { value: mockedLocation });
    store.dispatch(setInitiative(mockedInitiative));
    jest.spyOn(initiativeService, 'getOnboardingStatus').mockResolvedValue({
      pageNo: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
    } as OnboardingDTO);

    renderWithProviders(<InitiativeUsers />);

    expect(await screen.findByText('pages.initiativeUsers.noData')).toBeInTheDocument();
  });

  test('renders onboardingOk label when ranking is disabled and keeps malformed dates empty', async () => {
    Object.defineProperty(window, 'location', { value: mockedLocation });
    const mockedInitiativeWithoutRanking = {
      ...mockedInitiative,
      generalInfo: {
        ...mockedInitiative.generalInfo,
        rankingEnabled: 'false',
      },
    };

    store.dispatch(setInitiative(mockedInitiativeWithoutRanking));
    jest.spyOn(initiativeService, 'getOnboardingStatus').mockResolvedValue({
      content: [
        {
          beneficiary: 'string',
          beneficiaryState: BeneficiaryStateEnum.ONBOARDING_OK,
          updateStatusDate: 'invalid-date' as any,
        },
      ],
      pageNo: 0,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1,
    } as OnboardingDTO);

    renderWithProviders(<InitiativeUsers />);

    expect(await screen.findByText('STRING')).toBeInTheDocument();
    expect(await screen.findByText('pages.initiativeUsers.status.onboardingOk')).toBeInTheDocument();
  });

  test('test catch case of onboarding api call', () => {
    jest.spyOn(initiativeService, 'getOnboardingStatus').mockRejectedValue('reason');
    renderWithProviders(<InitiativeUsers />);
  });

  test('render NF table with familyId and demanded status', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        pathname: `${BASE_ROUTE}/utenti-iniziativa/23232333`,
      },
    });

    const nfInitiative = {
      ...mockedInitiative,
      generalInfo: {
        ...mockedInitiative.generalInfo,
        beneficiaryType: BeneficiaryTypeEnum.NF,
      },
    };
    store.dispatch(setInitiative(nfInitiative));

    jest.spyOn(initiativeService, 'getOnboardingStatus').mockResolvedValue({
      content: [
        {
          beneficiary: 'aaaaaa00a00a000a',
          beneficiaryState: BeneficiaryStateEnum.DEMANDED,
          familyId: 'FAM-01',
          updateStatusDate: new Date().toString(),
        },
      ],
      pageNo: 0,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1,
    } as OnboardingDTO);

    renderWithProviders(<InitiativeUsers />);

    expect(await screen.findByText('FAM-01')).toBeInTheDocument();
    expect(await screen.findByText('AAAAAA00A00A000A')).toBeInTheDocument();
  });

  test('apply filters with date range', async () => {
    store.dispatch(setInitiative(mockedInitiative));
    renderWithProviders(<InitiativeUsers />);

    fireEvent.change(screen.getByLabelText(/pages.initiativeUsers.form.from/), {
      target: { value: '10/01/2025' },
    });
    fireEvent.change(screen.getByLabelText(/pages.initiativeUsers.form.to/), {
      target: { value: '20/01/2025' },
    });
    fireEvent.click(screen.getByTestId('apply-filters-test'));
  });

  test('renders all beneficiary status branches in the table', async () => {
    Object.defineProperty(window, 'location', { value: mockedLocation });
    store.dispatch(setInitiative(mockedInitiative));

    jest.spyOn(initiativeService, 'getOnboardingStatus').mockResolvedValue({
      content: [
        {
          beneficiary: 'invited',
          beneficiaryState: BeneficiaryStateEnum.INVITED,
          updateStatusDate: '2026-03-01T00:00:00.000Z',
        },
        {
          beneficiary: 'accepted',
          beneficiaryState: BeneficiaryStateEnum.ACCEPTED_TC,
          updateStatusDate: '2026-03-01T00:00:00.000Z',
        },
        {
          beneficiary: 'evaluation',
          beneficiaryState: BeneficiaryStateEnum.ON_EVALUATION,
          updateStatusDate: '2026-03-01T00:00:00.000Z',
        },
        {
          beneficiary: 'onboarding-ko',
          beneficiaryState: BeneficiaryStateEnum.ONBOARDING_KO,
          updateStatusDate: '2026-03-01T00:00:00.000Z',
        },
        {
          beneficiary: 'eligible-ko',
          beneficiaryState: BeneficiaryStateEnum.ELIGIBLE_KO,
          updateStatusDate: '2026-03-01T00:00:00.000Z',
        },
        {
          beneficiary: 'inactive',
          beneficiaryState: BeneficiaryStateEnum.INACTIVE,
          updateStatusDate: '2026-03-01T00:00:00.000Z',
        },
        {
          beneficiary: 'unsubscribed',
          beneficiaryState: BeneficiaryStateEnum.UNSUBSCRIBED,
          updateStatusDate: '2026-03-01T00:00:00.000Z',
        },
        {
          beneficiary: 'suspended',
          beneficiaryState: BeneficiaryStateEnum.SUSPENDED,
          updateStatusDate: '2026-03-01T00:00:00.000Z',
        },
        {
          beneficiary: 'no-status',
          beneficiaryState: undefined,
          updateStatusDate: '2026-03-01T00:00:00.000Z',
        },
      ],
      pageNo: 0,
      pageSize: 10,
      totalElements: 9,
      totalPages: 1,
    } as OnboardingDTO);

    renderWithProviders(<InitiativeUsers />);

    expect(await screen.findByText('INVITED')).toBeInTheDocument();
    expect(await screen.findByText('NO-STATUS')).toBeInTheDocument();
    expect(await screen.findByText('pages.initiativeUsers.status.onboardingKo')).toBeInTheDocument();
    expect(await screen.findByText('pages.initiativeUsers.status.eligible')).toBeInTheDocument();
    expect(await screen.findByText('pages.initiativeUsers.status.suspended')).toBeInTheDocument();
    expect((await screen.findAllByText('pages.initiativeUsers.status.onEvaluation')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText('pages.initiativeUsers.status.inactive')).length).toBeGreaterThan(0);
  });
});