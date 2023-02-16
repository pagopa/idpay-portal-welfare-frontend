import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { OperationDTO } from '../../../api/generated/initiative/OperationDTO';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import TransactionDetailModal from '../TransactionDetailModal';
beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(cleanup);

describe('test suite initiative user details', () => {
  window.scrollTo = jest.fn();
  test('test of component TransactionDetailModal open', async () => {
    renderWithHistoryAndStore(
      <TransactionDetailModal
        operationId={'7e7e7e7e7e7e7e7e'}
        openModal={true}
        handleCloseModal={jest.fn()}
        initiativeId={''}
        holderBank={''}
        fiscalCode={''}
      />
    );

    const closeModal = screen.getByTestId('close-modal-test');
    fireEvent.click(closeModal);
  });

  test('test of component TransactionDetailModal open', async () => {
    renderWithHistoryAndStore(
      <TransactionDetailModal
        operationId={''}
        openModal={false}
        handleCloseModal={jest.fn()}
        initiativeId={''}
        holderBank={undefined}
        fiscalCode={''}
      />
    );
  });

  test('test of render TransactionDetailModal with different type of opeType', () => {
    const operationTypes = [
      'ADD_IBAN',
      'ADD_INSTRUMENT',
      'DELETE_INSTRUMENT',
      'ONBOARDING',
      'PAID_REFUND',
      'REJECTED_ADD_INSTRUMENT',
      'REJECTED_DELETE_INSTRUMENT',
      'DELETE_INSTRUMENT_KO',
      'REJECTED_REFUND',
      'REVERSAL',
      'TRANSACTION',
    ];

    operationTypes.forEach((operation) => {
      InitiativeApiMocked.getTimelineDetail = async (
        _cf: string,
        _id: string,
        _opeId: string
      ): Promise<any> =>
        new Promise((resolve) =>
          resolve({
            operationId: '',
            operationType: operation,
            operationDate: '',
            maskedPan: '',
            amount: 0,
            accrued: 0,
            circuitType: '',
            iban: '',
            channel: '',
            brandLogo: '',
            idTrxAcquirer: '',
            idTrxIssuer: '',
          })
        );

      renderWithHistoryAndStore(
        <TransactionDetailModal
          operationId={'7e7e7e7e7e7e7e7e'}
          openModal={true}
          handleCloseModal={jest.fn()}
          initiativeId={''}
          holderBank={''}
          fiscalCode={''}
        />
      );
    });
  });

  test('test catch case of getTimelineDetail api call', () => {
    InitiativeApiMocked.getTimelineDetail = async (): Promise<any> => Promise.reject('reason');
    renderWithHistoryAndStore(
      <TransactionDetailModal
        operationId={'7e7e7e7e7e7e7e7e'}
        openModal={true}
        handleCloseModal={jest.fn()}
        initiativeId={''}
        holderBank={''}
        fiscalCode={''}
      />
    );
  });
});
