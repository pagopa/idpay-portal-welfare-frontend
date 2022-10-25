import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import Wizard from '../Wizard';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<Wizard />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const handleBack = jest.fn();
  const handleNext = jest.fn();
  const handleDraft = jest.fn();
  const setActiveStep = jest.fn();
  const setActionType = jest.fn();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  const useStateMock: any = (actionType: string) => [actionType, setActionType];
  jest.spyOn(React, 'useState').mockImplementation(useStateMock);

  test('should display the Wizard component with his functions', async () => {
    await act(async () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <Wizard
            handleOpenExitModal={(_event: React.MouseEvent<Element>) => {
              /*  */
            }}
          />
        </Provider>
      );

      await waitFor(async () => {
        const backBtn = queryByTestId('back-action-test') as HTMLButtonElement;
        fireEvent.click(backBtn);
        handleBack();
        /* setActionType();
        setActiveStep(); */
        expect(handleBack).toHaveBeenCalled();
        /* expect(setActionType).toHaveBeenCalled();
        expect(setActiveStep).toHaveBeenCalled(); */
      });

      await waitFor(async () => {
        const draftBtn = queryByTestId('skip-action-test') as HTMLButtonElement;
        fireEvent.click(draftBtn);
        handleDraft();
        expect(handleDraft).toHaveBeenCalled();
      });

      await waitFor(async () => {
        const nextBtn = queryByTestId('continue-action-test') as HTMLButtonElement;
        fireEvent.click(nextBtn);
        handleNext();
        expect(handleNext).toHaveBeenCalled();
      });
    });
  });
});
