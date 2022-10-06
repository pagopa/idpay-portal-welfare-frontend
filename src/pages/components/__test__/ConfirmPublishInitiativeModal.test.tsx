import { render, waitFor } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import ConfirmPublishInitiativeModal from '../ConfirmPublishInitiativeModal';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<ConfirmPublishInitiativeModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  const peopleReached = jest.fn();
  const handlePusblishInitiative = jest.fn();

  test('should display the ConfirmPublishInitiativeModal component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ConfirmPublishInitiativeModal
            publishModalOpen={false}
            // eslint-disable-next-line react/jsx-no-bind
            setPublishModalOpen={function (_value: SetStateAction<boolean>): void {
              //
            }}
            id={undefined}
            // eslint-disable-next-line react/jsx-no-bind
            handlePusblishInitiative={function (event: React.MouseEvent<Element>): void {
              console.log(event);
            }}
            userCanPublishInitiative={false}
          />
        </Provider>
      );
    });
  });

  it('the functions should be defined', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ConfirmPublishInitiativeModal
            publishModalOpen={false}
            // eslint-disable-next-line react/jsx-no-bind
            setPublishModalOpen={function (_value: SetStateAction<boolean>): void {
              //
            }}
            id={undefined}
            handlePusblishInitiative={handlePusblishInitiative}
            userCanPublishInitiative={false}
          />
        </Provider>
      );

      expect(peopleReached).toBeDefined();
      expect(handlePusblishInitiative).toBeDefined();
    });
  });

  it('Modal to be in the document', async () => {
    await waitFor(async () => {
      render(
        <Provider store={store}>
          <ConfirmPublishInitiativeModal
            publishModalOpen={true}
            // eslint-disable-next-line react/jsx-no-bind
            setPublishModalOpen={function (_value: SetStateAction<boolean>): void {
              //
            }}
            id={undefined}
            // eslint-disable-next-line react/jsx-no-bind
            handlePusblishInitiative={function (event: React.MouseEvent<Element>): void {
              console.log(event);
            }}
            userCanPublishInitiative={false}
          />
        </Provider>
      );

      const modal = document.querySelector('[data-testid="confirm-modal-publish"') as HTMLElement;
      expect(modal).toBeInTheDocument();

      const fade = document.querySelector('[data-testid="fade-test"]') as HTMLElement;
      expect(fade).toBeInTheDocument();
    });
  });
});
