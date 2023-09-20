import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithContext } from '../../../utils/test-utils';
import MerchantTransactionsProcessed from '../MerchantTransactionsProcessed';
import { merchantsApiMocked } from '../../../api/__mocks__/merchantsApiClient';
import { MerchantTransactionsProcessedListDTO } from '../../../api/generated/merchants/MerchantTransactionsProcessedListDTO';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('Test suite for MerchantTransactionsProcessed component', () => {
  test('Render component', () => {
    renderWithContext(
      <MerchantTransactionsProcessed
        initiativeId={'initativeTestId321'}
        merchantId={'merchantTestId123'}
      />
    );
  });

  test('Render component when user resets filters', async () => {
    renderWithContext(
      <MerchantTransactionsProcessed
        initiativeId={'initativeTestId321'}
        merchantId={'merchantTestId123'}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByTestId('reset-filters-btn-test'));
  });

  test('Render component when user applies filters', async () => {
    renderWithContext(
      <MerchantTransactionsProcessed
        initiativeId={'initativeTestId321'}
        merchantId={'merchantTestId123'}
      />
    );
    const user = userEvent.setup();
    const filterByUser = screen.getByLabelText(
      'pages.initiativeMerchantDetail.searchByFiscalCode'
    ) as HTMLInputElement;
    await user.type(filterByUser, 'test');
    await user.click(screen.getByTestId('apply-filters-btn-test'));
  });

  test('should render MerchantTransactionsProcessed content array is empty from getMerchantTransactionsProcessed API response', async () => {
    merchantsApiMocked.getMerchantTransactionsProcessed =
      async (): Promise<MerchantTransactionsProcessedListDTO> =>
        new Promise((resolve) =>
          resolve({
            content: [],
            pageNo: 0,
            pageSize: 10,
            totalElements: 0,
            totalPages: 0,
          })
        );

    renderWithContext(
      <MerchantTransactionsProcessed
        initiativeId={'initativeTestId321'}
        merchantId={'merchantTestId123'}
      />
    );

    const emptyDiscountList = await screen.findByText(
      'pages.initiativeMerchantDetail.emptyProcessedList'
    );
    expect(emptyDiscountList).toBeInTheDocument();
  });

  test('should render initative empty component in case of  Error from getMerchantTransactionsProcessed API response', async () => {
    merchantsApiMocked.getMerchantTransactionsProcessed =
      async (): Promise<MerchantTransactionsProcessedListDTO> =>
        Promise.reject('mocked error response for tests');

    renderWithContext(
      <MerchantTransactionsProcessed
        initiativeId={'initativeTestId321'}
        merchantId={'merchantTestId123'}
      />
    );

    const emptyDiscountList = await screen.findByText(
      'pages.initiativeMerchantDetail.emptyProcessedList'
    );
    expect(emptyDiscountList).toBeInTheDocument();
  });
});
