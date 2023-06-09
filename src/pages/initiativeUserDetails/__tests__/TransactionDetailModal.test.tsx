import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { OperationDTO } from '../../../api/generated/initiative/OperationDTO';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { renderWithContext } from '../../../utils/test-utils';
import TransactionDetailModal from '../TransactionDetailModal';
beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(cleanup);

describe('test suite initiative user details', () => {
  window.scrollTo = jest.fn();
  test('test of component TransactionDetailModal open', async () => {
    renderWithContext(
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

  test('test of component TransactionDetailModal closed', async () => {
    renderWithContext(
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

      renderWithContext(
        <TransactionDetailModal
          operationId={'7e7e7e7e7e7e7e7e'}
          openModal={true}
          handleCloseModal={jest.fn()}
          initiativeId={''}
          holderBank={undefined}
          fiscalCode={''}
        />
      );
    });
  });

  test('test of render TransactionDetailModal with brand', () => {
    InitiativeApiMocked.getTimelineDetail = async (
      _cf: string,
      _id: string,
      _opeId: string
    ): Promise<OperationDTO> =>
      new Promise((resolve) =>
        resolve({
          operationId: '1u1u1u1u1u1u1u',
          operationType: 'TRANSACTION',
          operationDate: '2023-02-05T10:22:28.012Z',
          maskedPan: '1234123412341234',
          amount: 345,
          accrued: 10,
          brand: 'undefined',
          iban: '',
          channel: 'App IO',
          idTrxAcquirer: '349589304999',
          idTrxIssuer: '0001923192038',
        })
      );

    renderWithContext(
      <TransactionDetailModal
        operationId={'7e7e7e7e7e7e7e7e'}
        openModal={true}
        handleCloseModal={jest.fn()}
        initiativeId={''}
        holderBank={'undefined'}
        fiscalCode={''}
      />
    );
  });

  test('test of render TransactionDetailModal with holderBank', () => {
    InitiativeApiMocked.getTimelineDetail = async (
      _cf: string,
      _id: string,
      _opeId: string
    ): Promise<OperationDTO> =>
      new Promise((resolve) =>
        resolve({
          operationId: '1u1u1u1u1u1u1u',
          operationType: 'ADD_IBAN',
          operationDate: '2023-02-05T10:22:28.012Z',
          maskedPan: '1234123412341234',
          amount: 345,
          accrued: 10,
          brand: 'undefined',
          iban: '',
          channel: 'App IO',
          idTrxAcquirer: '349589304999',
          idTrxIssuer: '0001923192038',
        })
      );

    renderWithContext(
      <TransactionDetailModal
        operationId={'7e7e7e7e7e7e7e7e'}
        openModal={true}
        handleCloseModal={jest.fn()}
        initiativeId={''}
        holderBank={'banca'}
        fiscalCode={''}
      />
    );
  });

  test('test of formatDate condition', () => {
    InitiativeApiMocked.getTimelineDetail = async (
      _cf: string,
      _id: string,
      _opeId: string
    ): Promise<OperationDTO> =>
      new Promise((resolve) =>
        resolve({
          operationId: '1u1u1u1u1u1u1u',
          operationType: 'TRANSACTION',
          operationDate: 'aaaaa',
          maskedPan: '1234123412341234',
          amount: 345,
          accrued: 10,
          brand: 'undefined',
          iban: '',
          channel: 'App IO',
          idTrxAcquirer: '349589304999',
          idTrxIssuer: '0001923192038',
        })
      );

    renderWithContext(
      <TransactionDetailModal
        operationId={'7e7e7e7e7e7e7e7e'}
        openModal={true}
        handleCloseModal={jest.fn()}
        initiativeId={'banca'}
        holderBank={'banca'}
        fiscalCode={'banca'}
      />
    );
  });

  test('test catch case of getTimelineDetail not an object', () => {
    InitiativeApiMocked.getTimelineDetail = async (): Promise<any> =>
      new Promise<void>((res) => res());
    renderWithContext(
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

  test('test catch case of getTimelineDetail api call', () => {
    InitiativeApiMocked.getTimelineDetail = async (): Promise<any> => Promise.reject('reason');
    renderWithContext(
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
