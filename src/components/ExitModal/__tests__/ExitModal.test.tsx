/* eslint-disable react/jsx-no-bind */
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import ExitModal from '../ExitModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    replace: jest.fn(),
  }),
}));

describe('<ExitModal />', () => {
  const handleCloseExitModal = jest.fn();

  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  it('the modal should be in the document', async () => {
    renderWithHistoryAndStore(
      <ExitModal
        title="Test title"
        subtitle="test subtitle"
        openExitModal={true}
        handleCloseExitModal={handleCloseExitModal}
      />
    );

    const modal = document.querySelector('[data-testid="exit-modal-test"') as HTMLElement;
    expect(modal).toBeInTheDocument();

    const fade = document.querySelector('[data-testid="fade-test"]') as HTMLElement;
    expect(fade).toBeInTheDocument();

    const cancelBtn = screen.getByTestId('cancel-button-test') as HTMLButtonElement;
    fireEvent.click(cancelBtn);

    const exitBtn = screen.getByTestId('exit-button-test') as HTMLButtonElement;
    fireEvent.click(exitBtn);
  });
});
function renderWithHistoryAndStore(arg0: JSX.Element) {
  throw new Error('Function not implemented.');
}
