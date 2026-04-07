import { cleanup, screen } from '@testing-library/react';
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

  test('Render component without operation type', () => {
    const transactionDetail = {
      operationId: '1234',
      operationDate: '2023-09-29',
      operationType: undefined as unknown as string,
    };

    renderWithContext(<OnboardingContent transactionDetail={transactionDetail} />);

    expect(screen.queryByText('pages.initiativeUserDetails.transactionDetail.positiveResult')).not.toBeInTheDocument();
    expect(screen.queryByText('pages.initiativeUserDetails.transactionDetail.negativeResult')).not.toBeInTheDocument();
  });

  test('renders positive result when operation type is not rejected', () => {
    const transactionDetail = {
      operationId: '1234',
      operationDate: '2023-09-29',
      operationType: 'ADD_INSTRUMENT',
    };

    renderWithContext(<OnboardingContent transactionDetail={transactionDetail} />);

    expect(screen.getByText('Eseguito')).toBeInTheDocument();
    expect(screen.queryByText('Fallito')).not.toBeInTheDocument();
  });

  test('renders negative result when operation type is rejected', () => {
    const transactionDetail = {
      operationId: '1234',
      operationDate: '2023-09-29',
      operationType: 'REJECTED_ADD_INSTRUMENT',
    };

    renderWithContext(<OnboardingContent transactionDetail={transactionDetail} />);

    expect(screen.getByText('Fallito')).toBeInTheDocument();
    expect(screen.queryByText('Eseguito')).not.toBeInTheDocument();
  });
});