import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import SuspensionModal from '../SuspensionModal';

describe('test suite for suspension modal', () => {
  test('render SuspensionModal', async () => {
    renderWithHistoryAndStore(
      <SuspensionModal
        suspensionModalOpen={false}
        setSuspensionModalOpen={function (value: React.SetStateAction<boolean>): void {
          throw new Error('Function not implemented.');
        }}
        statusOnb={undefined}
        buttonType={''}
      />
    );
  });
});
