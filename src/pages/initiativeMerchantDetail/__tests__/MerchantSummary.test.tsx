import React from 'react';
import { renderWithContext } from '../../../utils/test-utils';
import MerchantSummary from '../MerchantSummary';
import {
  mockedMerchantDetail,
  mockedMerchantStatistics,
} from '../../../services/__mocks__/merchantsService';
import { merchantsApiMocked } from '../../../api/__mocks__/merchantsApiClient';
import { MerchantDetailDTO } from '../../../api/generated/merchants/MerchantDetailDTO';
import { MerchantStatisticsDTO } from '../../../api/generated/merchants/MerchantStatisticsDTO';

jest.mock('../../../services/merchantsService');

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('Test suite for InitiativeDiscountSummary component', () => {
  window.scrollTo = jest.fn();
  test('Render component', () => {
    renderWithContext(
      <MerchantSummary
        initiativeId={'initativeTestId321'}
        merchantId={'merchantTestId123'}
        merchantDetail={mockedMerchantDetail}
        setMerchantDetail={jest.fn()}
        merchantStatistics={mockedMerchantStatistics}
        setMerchantStatistics={jest.fn()}
      />
    );
  });

  test('Render component with undefined initiativeId prop', () => {
    window.scrollTo = jest.fn();
    renderWithContext(
      <MerchantSummary
        initiativeId={undefined}
        merchantId={'merchantTestId123'}
        merchantDetail={mockedMerchantDetail}
        setMerchantDetail={jest.fn()}
        merchantStatistics={mockedMerchantStatistics}
        setMerchantStatistics={jest.fn()}
      />
    );
  });

  test('Render component with undefined merchantId prop', () => {
    window.scrollTo = jest.fn();
    renderWithContext(
      <MerchantSummary
        initiativeId={'initativeTestId321'}
        merchantId={undefined}
        merchantDetail={mockedMerchantDetail}
        setMerchantDetail={jest.fn()}
        merchantStatistics={mockedMerchantStatistics}
        setMerchantStatistics={jest.fn()}
      />
    );
  });

  test('Catch in case of error from API getMerchantDetail and getMerchantInitiativeStatistics', () => {
    merchantsApiMocked.getMerchantDetail = async (): Promise<MerchantDetailDTO> =>
      Promise.reject('mocked error response for tests');

    merchantsApiMocked.getMerchantInitiativeStatistics = async (
      _initiativeId: string
    ): Promise<MerchantStatisticsDTO> => Promise.reject('mocked error response for tests');

    renderWithContext(
      <MerchantSummary
        initiativeId={'initativeTestId321'}
        merchantId={'merchantTestId123'}
        merchantDetail={mockedMerchantDetail}
        setMerchantDetail={jest.fn()}
        merchantStatistics={mockedMerchantStatistics}
        setMerchantStatistics={jest.fn()}
      />
    );
  });
});
