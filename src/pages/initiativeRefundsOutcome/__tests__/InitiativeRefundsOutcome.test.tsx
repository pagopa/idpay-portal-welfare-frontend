import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { PageRewardImportsDTO } from '../../../api/generated/initiative/PageRewardImportsDTO';
import { StatusEnum } from '../../../api/generated/initiative/RewardImportsDTO';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { setInitiativeId } from '../../../redux/slices/initiativeSlice';
import { store } from '../../../redux/store';
import { BASE_ROUTE } from '../../../routes';
import { mockedFile, mockedInitiativeId } from '../../../services/__mocks__/groupService';
import {
  mockedFileName,
  mockedNotificationReward,
} from '../../../services/__mocks__/initiativeService';
import { renderWithProviders } from '../../../utils/test-utils';
import InitiativeRefundsOutcome from '../initiativeRefundsOutcome';

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
    href: 'http://localhost:3000/portale-enti/esiti-rimborsi-iniziativa/',
    origin: 'http://localhost:3000/portale-enti',
    pathname: `${BASE_ROUTE}/esiti-rimborsi-iniziativa/${mockedInitiativeId}`,
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

describe('<InitiativeRefundsOutcome />', () => {
  window.scrollTo = jest.fn();

  test('Test InitiativeRefundsOutcome should upload with sucess', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    renderWithProviders(<InitiativeRefundsOutcome />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'application/zip', {
      type: 'application/zip',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('Test Render InitiativeRefundOutcome Table with every status', () => {
    const renderRefundsImportStatus = [
      StatusEnum.IN_PROGRESS,
      StatusEnum.WARN,
      StatusEnum.ERROR,
      StatusEnum.COMPLETE,
      undefined,
    ];

    renderRefundsImportStatus.forEach((status) => {
      InitiativeApiMocked.getRewardNotificationImportsPaged = async (
        _id: string,
        _page: number,
        _sort: string
      ): Promise<PageRewardImportsDTO> =>
        new Promise((resolve) =>
          resolve({
            content: [
              {
                contentLength: 0,
                eTag: 'string',
                elabDate: new Date(),
                errorsSize: 1,
                exportIds: ['string'],
                feedbackDate: new Date(),
                filePath: 'string',
                initiativeId: 'string',
                organizationId: 'string',
                percentageResulted: 'string',
                percentageResultedOk: 'string',
                percentageResultedOkElab: 'string',
                rewardsResulted: 0,
                rewardsResultedError: 0,
                rewardsResultedOk: 0,
                rewardsResultedOkError: 0,
                status: status,
                url: 'string',
              },
            ],
            totalElements: 5,
            totalPages: 1,
          })
        );

      renderWithProviders(<InitiativeRefundsOutcome />);
    });
  });

  test('Test InitiativeRefundsOutcome should fail upload with multiple files', async () => {
    renderWithProviders(<InitiativeRefundsOutcome />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'application/zip', {
      type: 'application/zip',
    });
    const file2 = new File(['file'], 'application/zip', {
      type: 'application/zip',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file, file2],
    });
    fireEvent.drop(inputEl);
  });

  test('Test InitiativeRefundsOutcome should fail upload with wrong type', async () => {
    renderWithProviders(<InitiativeRefundsOutcome />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'image/png', {
      type: 'image/png',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('Test InitiativeRefundsOutcome should fail upload with wrong size', async () => {
    renderWithProviders(<InitiativeRefundsOutcome />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'application/zip', {
      type: 'application/zip',
    });

    Object.defineProperty(file, 'size', { value: 193500800 });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);

    const downloadFileBtn = (await waitFor(() =>
      screen.getByTestId('download-file')
    )) as HTMLButtonElement;
    fireEvent.click(downloadFileBtn);

    const fileRejectedAlert = await waitFor(() => {
      return screen.getByText('pages.initiativeRefundsOutcome.uploadPaper.invalidFileTitle');
    });

    expect(fileRejectedAlert).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('CloseIcon'));
  });

  test('test catch case of putDispFileUpload', () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    InitiativeApiMocked.putDispFileUpload = async (): Promise<void> =>
      Promise.reject('addError for putDispFileUpload');
    renderWithProviders(<InitiativeRefundsOutcome />);
  });

  test('test catch case of getRewardNotificationImportsPaged', () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    InitiativeApiMocked.getRewardNotificationImportsPaged =
      async (): Promise<PageRewardImportsDTO> =>
        Promise.reject('reject case of getRewardNotificationImportsPaged');
  });
});
