import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
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
        operationTypeLabel={jest.fn()}
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
        operationTypeLabel={jest.fn()}
      />
    );
  });
});
