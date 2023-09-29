import React from 'react';
import { cleanup } from '@testing-library/react';
import OnboardingContent from '../components/InitiativeWithDiscount/OnboardingContent';
import { renderWithContext } from '../../../utils/test-utils';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(cleanup);

describe('test suite OnboardingContent component', () => {
  test('Render component', () => {
    const transactionDetail = {
      operationId: '1234',
      instrumentType: 'IDPAYCODE',
      operationType: 'ADD_INSTRUMENT',
      operationDate: '2023-09-29',
    };

    renderWithContext(<OnboardingContent transactionDetail={transactionDetail} />);
  });
});
