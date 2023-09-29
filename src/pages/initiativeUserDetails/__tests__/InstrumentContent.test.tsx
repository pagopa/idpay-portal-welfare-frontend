import React from 'react';
import { cleanup } from '@testing-library/react';
import InstrumentContent from '../components/InitiativeWithDiscount/InstrumentContent';
import { renderWithContext } from '../../../utils/test-utils';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(cleanup);

describe('test suite InstrumentContent component', () => {
  test('test component with an operation of ADD_INSTRUMENT and an instrument type CARD', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'CARD',
      operationType: 'ADD_INSTRUMENT',
      operationDate: '2023-09-29',
    };

    renderWithContext(<InstrumentContent transactionDetail={transactionDetail} />);
  });

  test('test component with an operation of ADD_INSTRUMENT and an instrument type IDPAYCODE', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      operationType: 'ADD_INSTRUMENT',
      operationDate: '2023-09-29',
    };

    renderWithContext(<InstrumentContent transactionDetail={transactionDetail} />);
  });

  test('test component with an operation of ADD_INSTRUMENT and an instrument unexpected type ', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'UNEXPECTED',
      operationType: 'ADD_INSTRUMENT',
      operationDate: '2023-09-29',
    };

    renderWithContext(<InstrumentContent transactionDetail={transactionDetail} />);
  });

  test('test component with an operation of ADD_INSTRUMENT and an instrument type as undefined', () => {
    const transactionDetail = {
      operationId: '1234',
      operationType: 'ADD_INSTRUMENT',
      operationDate: '2023-09-29',
    };

    renderWithContext(<InstrumentContent transactionDetail={transactionDetail} />);
  });
});
