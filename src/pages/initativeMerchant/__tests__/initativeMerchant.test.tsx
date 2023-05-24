import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { merchantsApiMocked } from '../../../api/__mocks__/merchantsApiClient';
// import { MerchantStatusEnum } from '../../../api/generated/merchants/MerchantOnboardingStatusDTO';
import { MerchantUpdateDTO } from '../../../api/generated/merchants/MerchantUpdateDTO';
import ROUTES from '../../../routes';
import { renderWithContext } from '../../../utils/test-utils';
import InitativeMerchant from '../initativeMerchant';

window.scrollTo = jest.fn();

const oldWindowLocation = global.window.location;

const mockedLocation = {
  assign: jest.fn(),
  pathname: ROUTES.INITIATIVE_MERCHANT,
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});

afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(cleanup);

describe('test suite for InitativeMerchant ', () => {
  test('render of compoment InitativeMerchant', async () => {
    renderWithContext(<InitativeMerchant />);
  });

  test('test that location changes on click of back button', async () => {
    const { history } = renderWithContext(<InitativeMerchant />);

    const merchantBackBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;

    const oldLocPathname = history.location.pathname;

    fireEvent.click(merchantBackBtn);

    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());
  });

  test('test that location changes on click of upload button', async () => {
    const { history } = renderWithContext(<InitativeMerchant />);

    const merchantUploadBtn = screen.getByTestId('upload-btn-test') as HTMLButtonElement;

    const oldLocPathname = history.location.pathname;

    fireEvent.click(merchantUploadBtn);

    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());
  });

  test('test filters of merchant list, submit button and reset button  ', async () => {
    renderWithContext(<InitativeMerchant />);

    //TEXTFIELD TEST

    const searcMerchant = screen.getByLabelText(
      'pages.initiativeMerchant.form.search'
    ) as HTMLInputElement;

    fireEvent.change(searcMerchant, { target: { value: 'searcMerchant' } });
    expect(searcMerchant.value).toBe('searcMerchant');

    expect(searcMerchant).toBeInTheDocument();

    //SELECT TEST

    // const filterStatus = screen.getByTestId('filterStatus-select') as HTMLSelectElement;

    // fireEvent.click(filterStatus);

    // fireEvent.change(filterStatus, {
    //   target: { value: MerchantStatusEnum.UPLOADED },
    // });

    // expect(filterStatus.value).toBe(MerchantStatusEnum.UPLOADED);

    // SUBMIT BUTTON TEST

    const filterBtn = screen.getByTestId('apply-filters-test') as HTMLButtonElement;
    fireEvent.click(filterBtn);

    // RESET BUTTON TEST

    fireEvent.change(searcMerchant, { target: { value: 'searchUser' } });
    expect(searcMerchant.value).toBe('searchUser');

    const resetBtn = screen.getByText(
      'pages.initiativeMerchant.form.removeFiltersBtn'
    ) as HTMLButtonElement;

    fireEvent.click(resetBtn);

    await waitFor(() => expect(searcMerchant.value).toEqual(''));
  });

  test('test addError of getMerchantsOnboardingList in case of error response', async () => {
    merchantsApiMocked.getMerchantsOnboardingList = async (
      _id: string,
      _page: number
    ): Promise<MerchantUpdateDTO> =>
      await Promise.reject('test reject getMerchantsOnboardingList addError');

    renderWithContext(<InitativeMerchant />);
  });
});
