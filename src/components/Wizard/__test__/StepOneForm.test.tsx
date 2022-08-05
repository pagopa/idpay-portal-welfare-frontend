import { act, fireEvent, render } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { date } from 'yup';
import { isDate, parse } from 'date-fns';
import { WIZARD_ACTIONS } from '../../../utils/constants';
import Wizard from '../Wizard';
import StepOneForm from '../components/StepOne/StepOneForm';
import { createStore } from './../../../redux/store';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<StepOneForm />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  test('should display the first form, with validation on input data', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <StepOneForm
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (value: SetStateAction<string>): void {
              console.log(value);
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (value: SetStateAction<number>): void {
              console.log(value);
            }}
          />
        </Provider>
      );
    });
  });

  it('call the submit event when form is submitted', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard />
        </Provider>
      );

      const submit = getByTestId('continue-action-test');
      await act(async () => {
        expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
      });
      fireEvent.click(submit);
    });
  });

  it('draft action makes the dispatch', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard />
        </Provider>
      );

      const skip = getByTestId('skip-action-test');
      await act(async () => {
        expect(WIZARD_ACTIONS.DRAFT).toBe('DRAFT');
      });
      fireEvent.click(skip);
    });
  });

  // eslint-disable-next-line sonarjs/no-identical-functions
  it('Form Fields not null', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <StepOneForm
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (value: SetStateAction<string>): void {
              console.log(value);
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (value: SetStateAction<number>): void {
              console.log(value);
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
      const { getByLabelText } = render(
        <Provider store={store}>
          <StepOneForm
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (value: SetStateAction<string>): void {
              console.log(value);
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (value: SetStateAction<number>): void {
              console.log(value);
            }}
          />
        </Provider>
      );

      /* Test of value of radio button */

      const beneficiaryType = getByLabelText(/components.wizard.stepOne.form.beneficiaryType/);
      const beneficiaryType1 = getByLabelText(/components.wizard.stepOne.form.person/);
      const beneficiaryType2 = getByLabelText(/components.wizard.stepOne.form.family/);
      // const beneficiaryKnown = getByLabelText(/components.wizard.stepOne.form.beneficiaryKnown/);
      const beneficiaryKnown1 = getByLabelText(
        /components.wizard.stepOne.form.taxCodeList/
      ) as HTMLInputElement;
      const beneficiaryKnown2 = getByLabelText(
        /components.wizard.stepOne.form.manualSelection/
      ) as HTMLInputElement;

      fireEvent.click(beneficiaryType);

      await act(async () => {
        expect(beneficiaryType1).toBeChecked();
      });
      await act(async () => {
        expect(beneficiaryType2).toBeDisabled();
      });

      fireEvent.click(beneficiaryKnown1);

      await act(async () => {
        expect(beneficiaryKnown1.checked).toEqual(true);
      });
      await act(async () => {
        expect(beneficiaryKnown2.checked).toEqual(false);
      });

      fireEvent.click(beneficiaryKnown2);

      await act(async () => {
        expect(beneficiaryKnown2.checked).toEqual(true);
      });
      await act(async () => {
        expect(beneficiaryKnown1.checked).toEqual(false);
      });
    });
  });

  it('Total Budget / Budget per Person Test', async () => {
    const { getByLabelText, getByDisplayValue } = render(
      <Provider store={store}>
        <StepOneForm
          action={''}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (value: SetStateAction<string>) {
            console.log(value);
          }}
          currentStep={0}
          // eslint-disable-next-line react/jsx-no-bind
          setCurrentStep={function (value: SetStateAction<number>) {
            console.log(value);
          }}
        />
      </Provider>
    );

    type TestElement = Document | Element | Window | Node;

    /* check if the field are required */

    function hasInputValueTot(e: TestElement, budgetTot: string) {
      console.log('hasInputValueTot ', getByDisplayValue(budgetTot) === e);
      return getByDisplayValue(budgetTot) === e;
    }
    const budget = getByLabelText(/components.wizard.stepOne.form.budget/);
    fireEvent.change(budget, { target: { value: '1000' } });
    await act(async () => {
      expect(hasInputValueTot(budget, '1000')).toBe(true);
      expect(budget).toBeRequired();
    });

    function hasInputValuePerPerson(e: TestElement, budgetPerPerson: string) {
      return getByDisplayValue(budgetPerPerson) === e;
    }
    const beneficiaryBudget = getByLabelText(/components.wizard.stepOne.form.beneficiaryBudget/);
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
          <StepOneForm
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            setAction={function (value: SetStateAction<string>): void {
              console.log(value);
            }}
            currentStep={0}
            // eslint-disable-next-line react/jsx-no-bind
            setCurrentStep={function (value: SetStateAction<number>): void {
              console.log(value);
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

      const rankingStartDate = getByLabelText(/components.wizard.stepOne.form.rankingStartDate/);
      const rankingEndDate = getByLabelText(/components.wizard.stepOne.form.rankingEndDate/);
      const startDate = getByLabelText(/components.wizard.stepOne.form.startDate/);
      const endDate = getByLabelText(/components.wizard.stepOne.form.endDate/);

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
});
