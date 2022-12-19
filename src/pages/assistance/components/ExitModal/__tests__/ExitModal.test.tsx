/* eslint-disable react/jsx-no-bind */
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import ExitModal from '../ExitModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    replace: jest.fn(),
  }),
}));

describe('<ExitModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const handleCloseExitModal = jest.fn();

  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  it('the modal should be in the document', async () => {
    render(
      <Provider store={store}>
        <ExitModal openExitModal={true} handleCloseExitModal={handleCloseExitModal} />
      </Provider>
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
