import React from 'react';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { RefundDetailDTO } from '../../../api/generated/initiative/apiClient';
import { renderWithContext } from '../../../utils/test-utils';
import InitiativeRefundsDetailsModal from '../initiativeRefundsDetailsModal';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('initiativeRefundsDetailsModal', () => {
  test('render of initiativeRefundsDetailsModal', async () => {
    renderWithContext(
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

    const mockedResponse: RefundDetailDTO = {
      amountCents: 10,
      endDate: '2026-03-31',
      fiscalCode: 'RSSMRA94C31F205K',
      iban: 'IT60X0542811101000000123456',
      userNotificationDate: '2026-04-01',
      refundType: 'REMEDIAL',
      transferDate: '2026-04-01',
      startDate: '2026-03-01',
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

    renderWithContext(
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
