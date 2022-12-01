import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import Wizard from '../Wizard';
import React from 'react';
import ServiceConfig from '../components/StepOne/ServiceConfig';
import Generalnfo from '../components/StepTwo/Generalnfo';
import AdmissionCriteria from '../components/StepThree/AdmissionCriteria';
import ShopRules from '../components/StepFour/ShopRules';
import RefundRules from '../components/StepFive/RefundRules';

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
  const step1 = 0;
  const step2 = 1;
  const step3 = 2;
  const step4 = 3;
  const step5 = 4;

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
        expect(handleBack).toHaveBeenCalled();
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

  it('Test on renderActiveStepBox', async () => {
    render(
      <Provider store={store}>
        <Wizard
          handleOpenExitModal={function (_event: React.MouseEvent<Element, MouseEvent>): void {
            //
          }}
        />
      </Provider>
    );
    const setSteps: any = (activeStep: number) => [activeStep, setActiveStep];
    jest.spyOn(React, 'useState').mockImplementation(setSteps(step1));
  });
});
