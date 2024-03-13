import React from 'react';
import { cleanup } from '@testing-library/react';
import TransactionContent from '../components/InitiativeWithDiscount/TransactionContent';
import { renderWithContext } from '../../../utils/test-utils';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(cleanup);

describe('test suite TransactionContent component', () => {
  test('Render component with channel: IDPAYCODE', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: 'IDPAYCODE',
      enentId: '123456',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
  });
  test('Render component with channel: QRCODE', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: 'QRCODE',
      enentId: '123456',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
  });

  test('Render component with channel: BARCODE', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: 'BARCODE',
      enentId: '123456',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
  });

  test('Render component with channel: UNEXPECTED', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: 'UNEXPECTED',
      enentId: '123456',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
  });

  test('Render component with channel: undefined', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: undefined,
      enentId: '123456',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
  });

  test('Render component with status cancelled', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      businessName: 'TEST',
      amount: 100,
      accrued: 50,
      channel: undefined,
      enentId: '123456',
      operationType: 'TRANSACTION',
      operationDate: '2023-09-29',
      status: 'CANCELLED',
    };

    renderWithContext(<TransactionContent transactionDetail={transactionDetail} />);
  });
});
