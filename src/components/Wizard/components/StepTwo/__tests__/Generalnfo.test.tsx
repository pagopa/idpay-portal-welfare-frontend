import { act, fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { date } from 'yup';
import { isDate, parse } from 'date-fns';
import { BeneficiaryTypeEnum, WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import Generalnfo from '../Generalnfo';
import { createStore } from '../../../../../redux/store';
import React from 'react';
import { InitiativeApi } from '../../../../../api/InitiativeApiClient';
import { updateInitiativeGeneralInfoDraft } from '../../../../../services/intitativeService';
import {
  mockedInitiativeId,
  mockedInitiativeGeneralBody,
} from '../../../../../services/__mocks__/initiativeService';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

// jest.mock('../../../../../api/InitiativeApiClient');

beforeEach(() => {
  // jest.spyOn(InitiativeApi, 'updateInitiativeGeneralInfoDraft');
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<Genaralnfo />', (injectedStore?: ReturnType<typeof createStore>) => {
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  const store = injectedStore ? injectedStore : createStore();
  test('should display the first form, with validation on input data', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <Generalnfo
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisabledNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );
    });
  });

  it('call the formik handleSubmit event when form is submitted', async () => {
    await waitFor(async () => {
      const handleSumbit = jest.fn();
      render(
        <Provider store={store}>
          <Generalnfo
            action={WIZARD_ACTIONS.SUBMIT}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisabledNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );
      handleSumbit();
      expect(handleSumbit).toHaveBeenCalled();
    });
  });

  it('call the submit event when form is submitted', async () => {
    await act(async () => {
      const parseValuesFormToInitiativeGeneralDTO = jest.fn();
      const setGeneralInfo = jest.fn();

      render(
        <Provider store={store}>
          <Generalnfo
            action={WIZARD_ACTIONS.DRAFT}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisabledNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );
      parseValuesFormToInitiativeGeneralDTO();
      setGeneralInfo();
      expect(parseValuesFormToInitiativeGeneralDTO).toHaveBeenCalled();
      expect(setGeneralInfo).toHaveBeenCalled();

      // if (mockedInitiativeId) {
      //   await updateInitiativeGeneralInfoDraft(mockedInitiativeId, mockedInitiativeGeneralBody);
      //   expect(InitiativeApi.updateInitiativeGeneralInfoDraft).toBeCalled();
      // }
    });
  });

  it('draft action makes the dispatch', async () => {
    await act(async () => {
      const parseValuesFormToInitiativeGeneralDTO = jest.fn();
      const saveGeneralInfoService = jest.fn();
      const setGeneralInfo = jest.fn();
      const setAdditionalInfo = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard handleOpenExitModal={() => console.log('exit modal')} />
        </Provider>
      );

      const skip = getByTestId('skip-action-test');

      expect(WIZARD_ACTIONS.DRAFT).toBe('DRAFT');

      fireEvent.click(skip);
      expect(parseValuesFormToInitiativeGeneralDTO).toBeDefined();
      expect(saveGeneralInfoService).toBeDefined();
      expect(setGeneralInfo).toBeDefined();
      expect(setAdditionalInfo).toBeDefined();
    });
  });

  // eslint-disable-next-line sonarjs/no-identical-functions
  it('Form Fields not null', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <Generalnfo
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisabledNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );
      await act(async () => {
        expect(getByTestId('beneficiary-type-test')).not.toBeNull();
      });
      await act(async () => {
        expect(getByTestId('beneficiary-known-test')).not.toBeNull();
      });
      await act(async () => {
        expect(getByTestId('budget-test')).not.toBeNull();
      });
      await act(async () => {
        expect(getByTestId('beneficiary-budget-test')).not.toBeNull();
      });
      await act(async () => {
        expect(getByTestId('start-date-test')).not.toBeNull();
      });
      await act(async () => {
        expect(getByTestId('end-date-test')).not.toBeNull();
      });
    });
  });

  // eslint-disable-next-line sonarjs/no-identical-functions
  it('BeneficiaryTypes / BeneficiaryKnowns have the correct values', async () => {
    await act(async () => {
      const fn = jest.fn();
      const { getByLabelText } = render(
        <Provider store={store}>
          <Generalnfo
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisabledNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );

      /* Test of value of radio button */
      const beneficiaryType = getByLabelText(/components.wizard.stepTwo.form.beneficiaryType/);
      const beneficiaryType1 = getByLabelText(/components.wizard.stepTwo.form.person/);
      const beneficiaryType2 = getByLabelText(/components.wizard.stepTwo.form.family/);
      // const beneficiaryKnown = getByLabelText(/components.wizard.stepTwo.form.beneficiaryKnown/);
      const beneficiaryKnown1 = getByLabelText(
        /components.wizard.stepTwo.form.taxCodeList/
      ) as HTMLInputElement;
      const beneficiaryKnown2 = getByLabelText(
        /components.wizard.stepTwo.form.manualSelection/
      ) as HTMLInputElement;

      fireEvent.click(beneficiaryType);
      expect(fn).toBeDefined();

      await act(async () => {
        expect(beneficiaryType1).toBeChecked();
      });
      await act(async () => {
        expect(beneficiaryType2).toBeDisabled();
      });

      await act(async () => {
        fireEvent.click(beneficiaryKnown1);
        expect(beneficiaryKnown1.checked).toEqual(false);
        expect(beneficiaryKnown2.checked).toEqual(true);
        fireEvent.click(beneficiaryKnown2);
        expect(beneficiaryKnown2.checked).toEqual(true);
        expect(beneficiaryKnown1.checked).toEqual(false);
      });
      expect(fn).not.toBeCalled();
    });
  });

  it('Total Budget / Budget per Person Test', async () => {
    const { getByLabelText, getByDisplayValue } = render(
      <Provider store={store}>
        <Generalnfo
          action={''}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (_value: SetStateAction<string>): void {
            //
          }}
          currentStep={0}
          // eslint-disable-next-line react/jsx-no-bind
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //
          }}
          // eslint-disable-next-line react/jsx-no-bind
          setDisabledNext={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      </Provider>
    );

    type TestElement = Document | Element | Window | Node;

    /* check if the field are required */

    function hasInputValueTot(e: TestElement, budgetTot: string) {
      return getByDisplayValue(budgetTot) === e;
    }
    const budget = getByLabelText(/components.wizard.stepTwo.form.budget/);
    fireEvent.change(budget, { target: { value: '1000' } });
    await act(async () => {
      expect(hasInputValueTot(budget, '1000')).toBe(true);
      expect(budget).toBeRequired();
    });

    function hasInputValuePerPerson(e: TestElement, budgetPerPerson: string) {
      return getByDisplayValue(budgetPerPerson) === e;
    }
    const beneficiaryBudget = getByLabelText(/components.wizard.stepTwo.form.beneficiaryBudget/);
    fireEvent.change(beneficiaryBudget, { target: { value: '100' } });

    await act(async () => {
      expect(hasInputValuePerPerson(beneficiaryBudget, '100')).toBe(true);
      expect(beneficiaryBudget).toBeRequired();
    });
  });

  it('Date Join / Spend Test', async () => {
    await act(async () => {
      const { getByLabelText } = render(
        <Provider store={store}>
          <Generalnfo
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisabledNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );

      function parseDateString(_value: any, originalValue: string) {
        return isDate(originalValue)
          ? originalValue
          : parse(originalValue, 'dd-MM-yyyy', new Date());
      }

      function isValidDate(date: any): date is Date {
        return date instanceof Date && !isNaN(date.getTime());
      }

      const rankingStartDate = getByLabelText(/components.wizard.stepTwo.form.rankingStartDate/);
      const rankingEndDate = getByLabelText(/components.wizard.stepTwo.form.rankingEndDate/);
      const startDate = getByLabelText(/components.wizard.stepTwo.form.startDate/);
      const endDate = getByLabelText(/components.wizard.stepTwo.form.endDate/);

      const d = date().transform(parseDateString);
      /* check if the fields are required */
      await act(async () => {
        expect(startDate).toBeRequired();
      });
      await act(async () => {
        expect(endDate).toBeRequired();
      });

      /* Checking if invalid cast return invalid date */
      await act(async () => {
        expect(isValidDate(d.cast(null, { assert: false }))).toBe(false);
      });
      await act(async () => {
        expect(isValidDate(d.cast('', { assert: false }))).toBe(false);
      });
      /* Casting */
      await act(async () => {
        expect(d.cast(new Date())).toBeInstanceOf(Date);
      });
      /* join-from */

      fireEvent.click(rankingStartDate);
      fireEvent.change(rankingStartDate, { target: { value: '19/07/2022' } });
      await act(async () => {
        expect(
          d
            .cast('19-07-2022')
            ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
        ).toBe('19/07/2022');
      });
      /* join-to */

      fireEvent.mouseOver(rankingEndDate);
      fireEvent.change(rankingEndDate, { target: { value: '20/07/2022' } });
      await act(async () => {
        expect(
          d
            .cast('20-07-2022')
            ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
        ).toBe('20/07/2022');
      });
      /* spend-from */

      fireEvent.mouseOver(startDate);
      fireEvent.change(startDate, { target: { value: '21/07/2022' } });
      await act(async () => {
        expect(
          d
            .cast('21-07-2022')
            ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
        ).toBe('21/07/2022');
      });
      /* spend-to */

      fireEvent.mouseOver(endDate);
      fireEvent.change(endDate, { target: { value: '22/07/2022' } });
      await act(async () => {
        expect(
          d
            .cast('22-07-2022')
            ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
        ).toBe('22/07/2022');
      });
    });
  });

  it('Test beneficiary type onChange', async () => {
    await waitFor(async () => {
      const setFieldValue = jest.fn();
      const { queryByTestId, getByLabelText } = render(
        <Provider store={store}>
          <Generalnfo
            action={WIZARD_ACTIONS.SUBMIT}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            // eslint-disable-next-line react/jsx-no-bind
            setDisabledNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );

      const beneficiaryType = queryByTestId('beneficiary-radio-test') as HTMLInputElement;
      const beneficiaryType1 = getByLabelText(
        /components.wizard.stepTwo.form.person/
      ) as HTMLInputElement;
      const beneficiaryType2 = getByLabelText(
        /components.wizard.stepTwo.form.family/
      ) as HTMLInputElement;

      waitFor(async () => {
        fireEvent.click(beneficiaryType1);
        expect(beneficiaryType1).toBeChecked();
        expect(beneficiaryType1.value).toBe('true');
        expect(beneficiaryType2).not.toBeChecked();
        fireEvent.click(beneficiaryType2);
        expect(beneficiaryType2).toBeChecked();
        expect(beneficiaryType2.value).toBe('true');
        expect(beneficiaryType1).not.toBeChecked();

        fireEvent.change(beneficiaryType, { target: { value: BeneficiaryTypeEnum.PF } });
        expect(beneficiaryType.value).toBe('PF');
        fireEvent.change(beneficiaryType, { target: { value: BeneficiaryTypeEnum.PG } });
        expect(beneficiaryType.value).toBe('PG');
      });
    });
  });
});

// it('Initiative on IO switch on off', async () => {
//   await act(async () => {
//     const handleAssistanceChannelDTOChange = jest.fn();
//     const handleContactSelect = jest.fn();
//     const handleInitiativeOnIO = jest.fn();
//     const deleteAssistanceChannel = jest.fn();
//     const { getByTestId, getByRole, container } = render(
//       <Provider store={store}>
//         <Generalnfo
//   action={''}
//   // eslint-disable-next-line react/jsx-no-bind
//   setAction={function (_value: SetStateAction<string>): void {
//     //
//   }}
//   currentStep={0}
//   // eslint-disable-next-line react/jsx-no-bind
//   setCurrentStep={function (_value: SetStateAction<number>): void {
//     //
//   }}
//   // eslint-disable-next-line react/jsx-no-bind
//   setDisabledNext={function (_value: SetStateAction<boolean>): void {
//     //
//   }}
//   // eslint-disable-next-line react/jsx-no-bind
//   setDraftEnabled={function (_value: SetStateAction<boolean>): void {
//     //
//   }}
// />
//       </Provider>
//     );

//     type TestElement = Document | Element | Window | Node;
//     const switchEl = getByTestId('initiative-on-io-test');
//     const checkbox = switchEl.children[0];
//     const serviceIdEl = container.querySelector('#service-id-select') as HTMLDivElement;
//     const defaultChannelTypeEl = container.querySelector('input[name="channels[0].type"]');

//     const defaultContactEl = container.querySelector(`#channels_0_contact`) as HTMLDivElement;

//     const serviceName = getByRole('input', { name: 'serviceName' });
//     const serviceArgument = getByRole('input', { name: 'argument' });
//     const serviceDescription = getByRole('input', { name: 'description' });
//     expect(checkbox).not.toBeChecked();
//     expect(serviceIdEl).not.toBeInTheDocument();
//     expect(serviceName).toBeInTheDocument();
//     expect(serviceArgument).toBeInTheDocument();
//     expect(serviceDescription).toBeInTheDocument();
//     expect(defaultChannelTypeEl).toBeInTheDocument();
//     expect(defaultChannelTypeEl?.getAttribute('value') === 'web');
//     expect(defaultContactEl).toBeInTheDocument();

//     expect(handleAssistanceChannelDTOChange).toBeDefined();
//     expect(deleteAssistanceChannel).toBeDefined();
//     expect(deleteAssistanceChannel).toHaveBeenCalledTimes(0);

//     fireEvent.change(serviceName.querySelector('input') as TestElement, {
//       target: { value: 'test name' },
//     });
//     expect(serviceName.getAttribute('value') === 'test name');
//     expect(serviceName).not.toBeNull();

//     fireEvent.change(serviceArgument.querySelector('input') as TestElement, {
//       target: { value: 'test argument' },
//     });
//     expect(serviceArgument.getAttribute('value') === 'test argument');
//     expect(serviceArgument).not.toBeNull();

//     fireEvent.change(serviceDescription.querySelector('textarea') as TestElement, {
//       target: { value: 'test description' },
//     });
//     expect(serviceDescription.getAttribute('value') === 'test description');
//     expect(serviceDescription).not.toBeNull();

//     expect(handleContactSelect).toBeDefined();

//     fireEvent.change(defaultChannelTypeEl as TestElement, {
//       target: { value: 'email' },
//     });
//     expect((defaultChannelTypeEl as HTMLElement).getAttribute('value') === 'email');

//     fireEvent.change(defaultContactEl, {
//       target: { value: 'test@mail.it' },
//     });
//     expect(defaultContactEl.getAttribute('value') === 'test@mail.it');

//     fireEvent.change(defaultChannelTypeEl as TestElement, {
//       target: { value: 'mobile' },
//     });
//     expect((defaultChannelTypeEl as HTMLElement).getAttribute('value') === 'mobile');

//     fireEvent.change(defaultContactEl, {
//       target: { value: '023456789' },
//     });
//     expect(defaultContactEl.getAttribute('value') === '023456789');

//     fireEvent.change(defaultChannelTypeEl as TestElement, {
//       target: { value: 'web' },
//     });
//     expect((defaultChannelTypeEl as HTMLElement).getAttribute('value') === 'web');

//     fireEvent.change(defaultContactEl, {
//       target: { value: 'http://test.it' },
//     });
//     expect(defaultContactEl.getAttribute('value') === 'http://test.it');

//     fireEvent.change(checkbox as TestElement, {
//       target: { value: 'true' },
//     });

//     expect(handleInitiativeOnIO).toBeDefined();
//   });
// });

// it('Initiative on IO switch change', async () => {
//   await act(async () => {
//     const fn = jest.fn();
//     const { getByRole } = render(
//       <Provider store={store}>
//       <Generalnfo
//   action={''}
//   // eslint-disable-next-line react/jsx-no-bind
//   setAction={function (_value: SetStateAction<string>): void {
//     //
//   }}
//   currentStep={0}
//   // eslint-disable-next-line react/jsx-no-bind
//   setCurrentStep={function (_value: SetStateAction<number>): void {
//     //
//   }}
//   // eslint-disable-next-line react/jsx-no-bind
//   setDisabledNext={function (_value: SetStateAction<boolean>): void {
//     //
//   }}
//   // eslint-disable-next-line react/jsx-no-bind
//   setDraftEnabled={function (_value: SetStateAction<boolean>): void {
//     //
//   }}
// />
//       </Provider>
//     );

//     const switchEl = getByRole('checkbox');

//     expect(switchEl).toHaveAttribute('value', 'false');
//     fireEvent.click(switchEl);
//     fireEvent.change(switchEl, { target: { value: 'true' } });
//     await act(async () => {
//       expect(switchEl).toHaveAttribute('value', 'true');
//       expect(fn).toBeDefined();
//     });
//   });
// });

// it('Add option', async () => {
//   await act(async () => {
//     const addAssistanceChannel = jest.fn();
//     const { container } = render(
//       <Provider store={store}>
//         <Generalnfo
//            action={''}
//   // eslint-disable-next-line react/jsx-no-bind
//   setAction={function (_value: SetStateAction<string>): void {
//     //
//   }}
//   currentStep={0}
//   // eslint-disable-next-line react/jsx-no-bind
//   setCurrentStep={function (_value: SetStateAction<number>): void {
//     //
//   }}
//   // eslint-disable-next-line react/jsx-no-bind
//   setDisabledNext={function (_value: SetStateAction<boolean>): void {
//     //
//   }}
//   // eslint-disable-next-line react/jsx-no-bind
//   setDraftEnabled={function (_value: SetStateAction<boolean>): void {
//     //
//   }}
// />
//       </Provider>
//     );

//     type TestElement = Document | Element | Window | Node;
//     const addButton = container.querySelector('#add-option') as TestElement;
//     fireEvent.click(addButton);
//     expect(addAssistanceChannel).toBeDefined();
//   });
// });

// it('Remove option', async () => {
//   await act(async () => {
//     const deleteAssistanceChannel = jest.fn();
//     const { container } = render(
//       <Provider store={store}>
//         <Generalnfo
//   action={''}
//   // eslint-disable-next-line react/jsx-no-bind
//   setAction={function (_value: SetStateAction<string>): void {
//     //
//   }}
//   currentStep={0}
//   // eslint-disable-next-line react/jsx-no-bind
//   setCurrentStep={function (_value: SetStateAction<number>): void {
//     //
//   }}
//   // eslint-disable-next-line react/jsx-no-bind
//   setDisabledNext={function (_value: SetStateAction<boolean>): void {
//     //
//   }}
//   // eslint-disable-next-line react/jsx-no-bind
//   setDraftEnabled={function (_value: SetStateAction<boolean>): void {
//     //
//   }}
// />
//       </Provider>
//     );
//     type TestElement = Document | Element | Window | Node;

//     const typeEl = container.querySelector(`#channels_1_type`) as TestElement;
//     const contactEl = container.querySelector(`#channels_1_contact`) as TestElement;
//     expect(typeEl).toBeFalsy();
//     expect(contactEl).toBeFalsy();

//     expect(typeEl).not.toBeInTheDocument();
//     expect(contactEl).not.toBeInTheDocument();

//     expect(deleteAssistanceChannel).toBeDefined();
//     expect(deleteAssistanceChannel).toBeCalledTimes(0);
//   });
// });
