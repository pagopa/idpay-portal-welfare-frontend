/* eslint-disable react/jsx-no-bind */
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import ExitModal from '../ExitModal';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the ExitModal component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ExitModal
            openExitModal={false}
            handleCloseExitModal={function (_event: React.MouseEvent<Element>): void {
              //
            }}
          />
        </Provider>
      );
    });
  });

  it('the modal should be in the document', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ExitModal
          openExitModal={true}
          handleCloseExitModal={function (event: React.MouseEvent<Element>): void {
            //
          }}
        />
      </Provider>
    );

    const setCloseExitModal = jest.fn();
    const useStateMock: any = (closeExitModal: boolean) => [closeExitModal, setCloseExitModal];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    const modal = document.querySelector('[data-testid="exit-modal-test"') as HTMLElement;
    expect(modal).toBeInTheDocument();

    const fade = document.querySelector('[data-testid="fade-test"]') as HTMLElement;
    expect(fade).toBeInTheDocument();

    await waitFor(async () => {
      const cancelBtn = getByTestId('cancel-button-test') as HTMLButtonElement;
      fireEvent.click(cancelBtn);
    });

    await waitFor(async () => {
      const exitBtn = getByTestId('exit-button-test') as HTMLButtonElement;
      fireEvent.click(exitBtn);
    });
  });
});
