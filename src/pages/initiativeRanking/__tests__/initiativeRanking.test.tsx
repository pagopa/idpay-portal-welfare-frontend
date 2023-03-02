import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { PageOnboardingRankingsDTO } from '../../../api/generated/initiative/PageOnboardingRankingsDTO';
import { SasToken } from '../../../api/generated/initiative/SasToken';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import ROUTES from '../../../routes';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import InitiativeRanking from '../initiativeRanking';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
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
    href: 'http://localhost:3000/portale-enti/graduatoria-iniziativa/2333333',
    origin: 'http://localhost:3000/portale-enti',
    pathname: ROUTES.INITIATIVE_RANKING,
    search: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
});

afterEach(cleanup);

describe('<InitiativeRefunds />', () => {
  window.scrollTo = jest.fn();
  const mockedRes = {
    content: [
      {
        beneficiary: 'string',
        criteriaConsensusTimestamp: new Date(),
        rankingValue: 0,
        ranking: 0,
        beneficiaryRankingStatus: 'ELIGIBLE_OK',
      },
    ],
    pageNumber: 0,
    pageSize: 0,
    totalElements: 0,
    totalPages: 0,
    rankingStatus: 'READY',
    rankingPublishedTimestamp: new Date(),
    rankingGeneratedTimestamp: new Date(),
    totalEligibleOk: 0,
    totalEligibleKo: 0,
    totalOnboardingKo: 0,
    rankingFilePath: 'string',
  };

  const mockedResEmptyContent = {
    content: [],
    pageNumber: 0,
    pageSize: 0,
    totalElements: 0,
    totalPages: 0,
    rankingStatus: 'READY',
    rankingPublishedTimestamp: new Date(),
    rankingGeneratedTimestamp: new Date(),
    totalEligibleOk: 0,
    totalEligibleKo: 0,
    totalOnboardingKo: 0,
    rankingFilePath: 'string',
  };

  it('Test InitiativeRanking to be Rendered with state', async () => {
    renderWithHistoryAndStore(<InitiativeRanking />);

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    const alertBtn = await screen.findByText('pages.initiativeRanking.publishModal.alertBtn');
    fireEvent.click(alertBtn);

    const publishClosingBtn = await screen.findByText(
      'pages.initiativeRanking.rankingStatus.publishedCloseBtn'
    );
    fireEvent.click(publishClosingBtn);

    const searchUser = screen.getByLabelText(
      'pages.initiativeUsers.form.search'
    ) as HTMLInputElement;
    fireEvent.change(searchUser, { target: { value: 'user' } });
    expect(searchUser.value).toBe('user');

    const filterStatusSelect = screen.getByTestId('filterStatus-select');

    fireEvent.click(filterStatusSelect);
    fireEvent.change(filterStatusSelect, {
      target: { value: 'ELIGIBLE_OK' },
    });

    const filterBtn = screen.getByText('pages.initiativeRanking.form.filterBtn');
    fireEvent.click(filterBtn);
  });

  test('test case of READY status from getInitiativeOnboardingRankingStatus', async () => {
    InitiativeApiMocked.getInitiativeOnboardingRankingStatusPaged =
      async (): Promise<PageOnboardingRankingsDTO> => new Promise((resolve) => resolve(mockedRes));

    renderWithHistoryAndStore(<InitiativeRanking />);

    // test reset filter btn click
    const resetFilterBtn = await screen.findByText('pages.initiativeRanking.form.resetFiltersBtn');
    fireEvent.click(resetFilterBtn);

    const downloadRankingFileBtn = await screen.findByText(
      'pages.initiativeRanking.publishModal.alertBtn'
    );
    fireEvent.click(downloadRankingFileBtn);

    // publish btn
    const publishBtn = screen.getByText(
      'pages.initiativeRanking.rankingStatus.publishBtn'
    ) as HTMLButtonElement;

    fireEvent.click(publishBtn);

    const publishModalTitle = await screen.findByText('pages.initiativeRanking.publishModal.title');
    expect(publishModalTitle).toBeInTheDocument();

    const publishModalBtn = await screen.findByTestId('publish-button-test');
    fireEvent.click(publishModalBtn);

    const closeModalBtn = await screen.findByTestId('cancel-button-test');
    fireEvent.click(closeModalBtn);
  });

  test('test case of getInitiativeOnboardingRankingStatus with no content', async () => {
    InitiativeApiMocked.getInitiativeOnboardingRankingStatusPaged =
      async (): Promise<PageOnboardingRankingsDTO> =>
        new Promise((resolve) => resolve(mockedResEmptyContent));

    renderWithHistoryAndStore(<InitiativeRanking />);
  });

  test('test case getBeneficiaryStatus ELIGIBLE_KO', () => {
    const mockedBeneficiaryStatusArr = ['ELIGIBLE_KO', 'ONBOARDING_KO', ''];

    mockedBeneficiaryStatusArr.forEach((item) => {
      InitiativeApiMocked.getInitiativeOnboardingRankingStatusPaged = async (): Promise<any> =>
        new Promise((resolve) =>
          resolve({
            content: [
              {
                beneficiary: 'string',
                criteriaConsensusTimestamp: new Date(),
                rankingValue: 0,
                ranking: 0,
                beneficiaryRankingStatus: item,
              },
            ],
            pageNumber: 0,
            pageSize: 0,
            totalElements: 0,
            totalPages: 0,
            rankingStatus: 'READY',
            rankingPublishedTimestamp: new Date(),
            rankingGeneratedTimestamp: new Date(),
            totalEligibleOk: 0,
            totalEligibleKo: 0,
            totalOnboardingKo: 0,
            rankingFilePath: 'string',
          })
        );
      renderWithHistoryAndStore(<InitiativeRanking />);
    });
  });

  test('test catch case of getInitiativeOnboardingRankingStatus', async () => {
    InitiativeApiMocked.getInitiativeOnboardingRankingStatusPaged =
      async (): Promise<PageOnboardingRankingsDTO> => Promise.reject('test of catch case');
    renderWithHistoryAndStore(<InitiativeRanking />);
  });

  test('test catch case of getRankingFileDownload', async () => {
    InitiativeApiMocked.getRankingFileDownload = async (): Promise<SasToken> =>
      Promise.reject('test of catch case');
    renderWithHistoryAndStore(<InitiativeRanking />);
  });

  test('test catch case of notifyCitizenRankings', async () => {
    InitiativeApiMocked.notifyCitizenRankings = async (): Promise<void> =>
      Promise.reject('test of catch case');
    renderWithHistoryAndStore(<InitiativeRanking />);
  });
});
