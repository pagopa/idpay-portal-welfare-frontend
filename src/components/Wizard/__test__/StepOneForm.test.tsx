import { fireEvent, render } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { date } from 'yup';
import { isDate, parse } from 'date-fns';
import { WIZARD_ACTIONS } from '../../../utils/constants';
import Wizard from '../Wizard';
import StepOneForm from '../components/StepOne/StepOneForm';
import { createStore } from './../../../redux/store';

describe('<StepOneForm />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  test('should display the first form, with validation on input data', () => {
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

  it('call the submit event when form is submitted', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Wizard />
      </Provider>
    );

    // const onSubmit = jest.fn();
    const submit = getByTestId('continue-action-test');
    expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
    fireEvent.click(submit);
  });

  it('draf action makes the dispatch', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Wizard />
      </Provider>
    );

    // const onSkip = jest.fn();
    const skip = getByTestId('skip-action-test');
    expect(WIZARD_ACTIONS.DRAFT).toBe('DRAFT');
    fireEvent.click(skip);
    // expect(onSkip).toHaveBeenCalled();
  });

  // eslint-disable-next-line sonarjs/no-identical-functions
  it('Form Fields not null', () => {
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
    expect(getByTestId('beneficiary-type-test')).not.toBeNull();
    expect(getByTestId('beneficiary-known-test')).not.toBeNull();
    expect(getByTestId('budget-test')).not.toBeNull();
    expect(getByTestId('beneficiary-budget-test')).not.toBeNull();
    expect(getByTestId('start-date-test')).not.toBeNull();
    expect(getByTestId('end-date-test')).not.toBeNull();
    expect(getByTestId('ranking-start-date-test')).not.toBeNull();
    expect(getByTestId('ranking-end-date-test')).not.toBeNull();
  });

  // eslint-disable-next-line sonarjs/no-identical-functions
  it('BeneficiaryTypes / BeneficiaryKnowns have the correct values', () => {
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
    expect(beneficiaryType1).toBeChecked();
    expect(beneficiaryType2).toBeDisabled();

    fireEvent.click(beneficiaryKnown1);
    expect(beneficiaryKnown1.checked).toEqual(true);
    expect(beneficiaryKnown2.checked).toEqual(false);

    fireEvent.click(beneficiaryKnown2);
    expect(beneficiaryKnown2.checked).toEqual(true);
    expect(beneficiaryKnown1.checked).toEqual(false);
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

    function hasInputValueTot(e: TestElement, budgetTot: string) {
      return getByDisplayValue(budgetTot) === e;
    }

    function hasInputValuePerPerson(e: TestElement, budgetPerPerson: string) {
      return getByDisplayValue(budgetPerPerson) === e;
    }

    const budget = getByLabelText(/components.wizard.stepOne.form.budget/);
    const beneficiaryBudget = getByLabelText(/components.wizard.stepOne.form.beneficiaryBudget/);

    /* check if the field are required */

    expect(budget).toBeRequired();
    expect(beneficiaryBudget).toBeRequired();

    /* Validation */

    fireEvent.change(budget, { target: { value: '1000' } });
    expect(hasInputValueTot(budget, '1000')).toBe(true);

    fireEvent.change(beneficiaryBudget, { target: { value: '100' } });
    expect(hasInputValuePerPerson(beneficiaryBudget, '100')).toBe(true);
  });

  it('Date Join / Spend Test', () => {
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
      return isDate(originalValue) ? originalValue : parse(originalValue, 'dd-MM-yyyy', new Date());
    }

    function isValidDate(date: any): date is Date {
      return date instanceof Date && !isNaN(date.getTime());
    }

    const rankingStartDate = getByLabelText(/components.wizard.stepOne.form.startDate/);
    const rankingEndDate = getByLabelText(/components.wizard.stepOne.form.endDate/);
    const startDate = getByLabelText(/components.wizard.stepOne.form.rankingStartDate/);
    const endDate = getByLabelText(/components.wizard.stepOne.form.rankingEndDate/);

    const d = date().transform(parseDateString);
    /* check if the fields are required */

    expect(startDate).toBeRequired();
    expect(endDate).toBeRequired();

    /* Checking if invalid cast return invalid date */

    expect(isValidDate(d.cast(null, { assert: false }))).toBe(false);
    expect(isValidDate(d.cast('', { assert: false }))).toBe(false);

    /* Casting */

    expect(d.cast(new Date())).toBeInstanceOf(Date);

    /* join-from */

    fireEvent.click(rankingStartDate);
    fireEvent.change(rankingStartDate, { target: { value: '19/07/2022' } });
    expect(
      d
        .cast('19-07-2022')
        ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
    ).toBe('19/07/2022');

    /* join-to */

    fireEvent.mouseOver(rankingEndDate);
    fireEvent.change(rankingEndDate, { target: { value: '20/07/2022' } });
    expect(
      d
        .cast('20-07-2022')
        ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
    ).toBe('20/07/2022');

    /* spend-from */

    fireEvent.mouseOver(startDate);
    fireEvent.change(startDate, { target: { value: '21/07/2022' } });
    expect(
      d
        .cast('21-07-2022')
        ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
    ).toBe('21/07/2022');

    /* spend-to */

    fireEvent.mouseOver(endDate);
    fireEvent.change(endDate, { target: { value: '22/07/2022' } });
    expect(
      d
        .cast('22-07-2022')
        ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
    ).toBe('22/07/2022');
  });
});
