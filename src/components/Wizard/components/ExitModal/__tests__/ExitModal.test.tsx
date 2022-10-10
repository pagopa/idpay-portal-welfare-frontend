/* eslint-disable react/jsx-no-bind */
import { render, waitFor } from '@testing-library/react';
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
  useHistory: () => {},
}));

describe('<ExitModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const closeWithoutSaving = jest.fn();

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
            handleCloseExitModal={function (event: React.MouseEvent<Element>): void {
              console.log(event);
            }}
          />
        </Provider>
      );
    });
  });

  it('the functions should be defined', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ExitModal
            openExitModal={false}
            handleCloseExitModal={function (event: React.MouseEvent<Element>): void {
              console.log(event);
            }}
          />
        </Provider>
      );

      expect(closeWithoutSaving).toBeDefined();
    });
  });

  it('the modal should be in the document', async () => {
    await waitFor(async () => {
      render(
        <Provider store={store}>
          <ExitModal
            openExitModal={true}
            handleCloseExitModal={function (event: React.MouseEvent<Element>): void {
              console.log(event);
            }}
          />
        </Provider>
      );

      const modal = document.querySelector('[data-testid="exit-modal-test"') as HTMLElement;
      expect(modal).toBeInTheDocument();

      const fade = document.querySelector('[data-testid="fade-test"]') as HTMLElement;
      expect(fade).toBeInTheDocument();
    });
  });
});
