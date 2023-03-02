import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { isDate, parse } from 'date-fns';
import React from 'react';
import { date } from 'yup';
import { AccumulatedTypeEnum } from '../../../api/generated/initiative/AccumulatedAmountDTO';
import { TypeEnum } from '../../../api/generated/initiative/ChannelDTO';
import { ServiceScopeEnum } from '../../../api/generated/initiative/InitiativeAdditionalDTO';
import { OnboardingDTO } from '../../../api/generated/initiative/OnboardingDTO';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { Initiative } from '../../../model/Initiative';
import { mockedInitiative } from '../../../model/__tests__/Initiative.test';
import {
  setGeneralInfo,
  setInitiative,
  setInitiativeId,
} from '../../../redux/slices/initiativeSlice';
import { store } from '../../../redux/store';
import { BASE_ROUTE } from '../../../routes';
import { BeneficiaryTypeEnum } from '../../../utils/constants';
import { renderWithHistoryAndStore, renderWithProviders } from '../../../utils/test-utils';
import { mockLocationFunction } from '../../initiativeOverview/__tests__/initiativeOverview.test';
import InitiativeUsers from '../initiativeUsers';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

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
    href: 'http://localhost:3000/portale-enti/utenti-iniziativa/23232333',
    origin: 'http://localhost:3000/portale-enti',
    pathname: '/portale-enti/utenti-iniziativa/23232333',
    search: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
});

afterEach(cleanup);

describe('<InitiativeUsers />', () => {
  window.scrollTo = jest.fn();
  const mockedResponde = {
    content: [
      {
        beneficiary: 'string',
        beneficiaryState: 'ONBOARDING_OK',
        updateStatusDate: new Date(),
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
      serviceArea: ServiceScopeEnum.NATIONAL,
      serviceDescription: 'newStepOneTest',
      privacyPolicyUrl: 'http://test.it',
      termsAndConditions: 'http://test.it',
      assistanceChannels: [
        { type: TypeEnum.web, contact: 'http://test.it' },
        { type: TypeEnum.email, contact: 'http://test.it' },
        { type: TypeEnum.mobile, contact: 'http://test.it' },
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
    rewardRule: { _type: 'rewardValue', rewardValue: 1 },
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

  test('Reset Form on Click Annulla filtri and test click beneficiaryBtn', async () => {
    renderWithHistoryAndStore(<InitiativeUsers />);

    const searchUser = screen.getByLabelText(
      'pages.initiativeUsers.form.search'
    ) as HTMLInputElement;

    fireEvent.change(searchUser, { target: { value: 'searchUser' } });
    expect(searchUser.value).toBe('searchUser');

    const annullaFiltriBtn = screen.getByText(
      'pages.initiativeUsers.form.resetFiltersBtn'
    ) as HTMLButtonElement;

    fireEvent.click(annullaFiltriBtn);

    await waitFor(() => expect(searchUser.value).toEqual(''));

    // click beneficiaryBtn
    const beneficiaryBtn = (await screen.findByTestId('beneficiary-test')) as HTMLButtonElement;
    fireEvent.click(beneficiaryBtn);
  });

  test('render with different Onboarding user Status', async () => {
    const onbUserStatusArr = [
      'INVITED',
      'ACCEPTED_TC',
      'ON_EVALUATION',
      'ONBOARDING_OK',
      'ONBOARDING_KO',
      'ELIGIBLE_KO',
      'ELIGIBLE_KO',
      'INACTIVE',
      'UNSUBSCRIBED',
    ];
    onbUserStatusArr.forEach((item) => {
      (InitiativeApiMocked.getOnboardingStatus = async (
        _id: string,
        _page: number,
        _notificationDateFrom: string | undefined,
        _notificationDateTo: string | undefined,
        _status: string | undefined
      ): Promise<OnboardingDTO> =>
        new Promise((resolve) =>
          resolve({
            content: [
              {
                beneficiary: 'string',
                beneficiaryState: item,
                updateStatusDate: new Date(),
              },
            ],
            pageNo: 0,
            pageSize: 0,
            totalElements: 0,
            totalPages: 0,
          })
        )),
        renderWithHistoryAndStore(<InitiativeUsers />);
    });
  });

  test('Render InitiativeUser with status ONBOARDING_OK and rankingEnabled true', () => {
    store.dispatch(setInitiative(mockedInitiative));
    InitiativeApiMocked.getOnboardingStatus = async (
      _id: string,
      _page: number,
      _notificationDateFrom: string | undefined,
      _notificationDateTo: string | undefined,
      _status: string | undefined
    ): Promise<OnboardingDTO> => new Promise((resolve) => resolve(mockedResponde));

    renderWithHistoryAndStore(<InitiativeUsers />);
  });

  test('render component without id in header', () => {
    //@ts-expect-error
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
      ancestorOrigins: ['string'] as unknown as DOMStringList,
      hash: 'hash',
      host: 'localhost',
      port: '3000',
      protocol: 'https//:',
      hostname: 'localhost:3000/portale-enti',
      href: `${BASE_ROUTE}/utenti-iniziativa`,
      origin: `${BASE_ROUTE}`,
      pathname: `${BASE_ROUTE}/utenti-iniziativa`,
      search: '',
      assign: () => {},
      reload: () => {},
      replace: () => {},
    };

    renderWithHistoryAndStore(<InitiativeUsers />);
  });

  test('test catch case of onboarding api call', () => {
    InitiativeApiMocked.getOnboardingStatus = async (): Promise<any> => Promise.reject('reason');
    renderWithHistoryAndStore(<InitiativeUsers />);
  });
});
