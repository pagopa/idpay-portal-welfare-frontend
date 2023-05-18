import React from 'react';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { RefundDetailDTO } from '../../../api/generated/initiative/RefundDetailDTO';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import InitiativeRefundsDetailsModal from '../initiativeRefundsDetailsModal';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('initiativeRefundsDetailsModal', () => {
  test('render of initiativeRefundsDetailsModal', async () => {
    renderWithHistoryAndStore(
      <InitiativeRefundsDetailsModal
        openRefundsDetailModal={true}
        handleCloseRefundModal={function (_event: React.MouseEvent<Element, MouseEvent>): void {
          throw new Error('Function not implemented.');
        }}
        refundEventId="mockedRefundId"
        initiativeId="mockedInitativeId"
      />
    );

    // test refund type REMEDIAL from response

    const mockedResponse = {
      amount: 10,
      endDate: new Date(),
      fiscalCode: 'RSSMRA94C31F205K',
      iban: 'IT60X0542811101000000123456',
      userNotificationDate: new Date(),
      refundType: 'REMEDIAL',
      transferDate: new Date(),
      startDate: new Date(),
      status: 'COMPLETED_OK',
      cro: '12345678901',
    };

    InitiativeApiMocked.getRefundDetail = async (
      _initiativeId: string,
      _refundEventId: string
    ): Promise<RefundDetailDTO> => new Promise((resolve) => resolve(mockedResponse));
  });

  test('catch case ', async () => {
    InitiativeApiMocked.getRefundDetail = async (): Promise<RefundDetailDTO> =>
      Promise.reject('mocked error response for tests');

    renderWithHistoryAndStore(
      <InitiativeRefundsDetailsModal
        openRefundsDetailModal={true}
        handleCloseRefundModal={function (_event: React.MouseEvent<Element, MouseEvent>): void {
          throw new Error('Function not implemented.');
        }}
        refundEventId="mockedRefundId"
        initiativeId="mockedInitativeId"
      />
    );
  });
});
