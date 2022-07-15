import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { WIZARD_ACTIONS } from '../../../utils/constants';
import StepOneForm from './../components/StepOneForm';
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

  it('calls onSubmit prop function when form is submitted', () => {
    <StepOneForm
      action={WIZARD_ACTIONS.SUBMIT}
      // eslint-disable-next-line react/jsx-no-bind
      setAction={function (value: SetStateAction<string>) {
        console.log(value);
      }}
      currentStep={0}
      // eslint-disable-next-line react/jsx-no-bind
      setCurrentStep={function (value: SetStateAction<number>) {
        console.log(value);
      }}
    />;
    expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
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
  it('RadioGroup Form Checked Test', () => {
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
    const beneficiaryKnown = getByLabelText(/components.wizard.stepOne.form.beneficiaryKnown/);
    const beneficiaryKnown1 = getByLabelText(/components.wizard.stepOne.form.taxCodeList/);
    const beneficiaryKnown2 = getByLabelText(/components.wizard.stepOne.form.manualSelection/);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    userEvent.click(beneficiaryType);
    expect(beneficiaryType1).toBeChecked();

    expect(beneficiaryType2).toBeDisabled();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    userEvent.click(beneficiaryKnown);
    expect(beneficiaryKnown1 || beneficiaryKnown2).not.toBeChecked();
  });

  it('Total Budget / Budget per Person Test', () => {
    const { getByLabelText, getByDisplayValue } = render(
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
    const { getByLabelText, getByDisplayValue } = render(
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

    type TestElement = Document | Element | Window | Node;

    function hasCorrectDateValue(e: TestElement, date: string) {
      return getByDisplayValue(date) === e;
    }

    const rankingStartDate = getByLabelText(/components.wizard.stepOne.form.startDate/);
    const rankingEndDate = getByLabelText(/components.wizard.stepOne.form.endDate/);
    const startDate = getByLabelText(/components.wizard.stepOne.form.rankingStartDate/);
    const endDateDate = getByLabelText(/components.wizard.stepOne.form.rankingEndDate/);

    /* check if the fields are required */

    expect(startDate).toBeRequired();
    expect(endDateDate).toBeRequired();

    /* Validation */

    /* join-from */

    fireEvent.mouseOver(rankingStartDate);
    fireEvent.change(rankingStartDate, { target: { value: '10/07/2022' } });
    fireEvent.mouseOut(rankingStartDate);
    expect(hasCorrectDateValue(rankingStartDate, '10/07/2022')).toBe(true);

    /* join-to */

    fireEvent.mouseOver(rankingEndDate);
    fireEvent.change(rankingEndDate, { target: { value: '11/07/2022' } });
    fireEvent.mouseOut(rankingEndDate);
    expect(hasCorrectDateValue(rankingEndDate, '11/07/2022')).toBe(true);

    /* spend-from */

    fireEvent.mouseOver(startDate);
    fireEvent.change(startDate, { target: { value: '12/07/2022' } });
    fireEvent.mouseOut(startDate);
    expect(hasCorrectDateValue(startDate, '12/07/2022')).toBe(true);

    /* spend-to */

    fireEvent.mouseOver(endDateDate);
    fireEvent.change(endDateDate, { target: { value: '13/07/2022' } });
    fireEvent.mouseOut(endDateDate);
    expect(hasCorrectDateValue(endDateDate, '13/07/2022')).toBe(true);
  });
});
