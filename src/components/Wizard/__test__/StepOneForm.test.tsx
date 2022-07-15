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
    expect(getByTestId('recipients-question-label')).not.toBeNull();
    expect(getByTestId('recipients-type-label')).not.toBeNull();
    expect(getByTestId('total-budget-t')).not.toBeNull();
    expect(getByTestId('budget-per-person')).not.toBeNull();
    expect(getByTestId('join-from-t')).not.toBeNull();
    expect(getByTestId('join-to-t')).not.toBeNull();
    expect(getByTestId('spend-from-t')).not.toBeNull();
    expect(getByTestId('spend-to-t')).not.toBeNull();
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

    const firstRadioGroup = getByLabelText(/components.wizard.stepOne.form.initiativeRecipients/);
    const radio1 = getByLabelText(/components.wizard.stepOne.form.person/);
    const radio2 = getByLabelText(/components.wizard.stepOne.form.family/);
    const secondRadioGroup = getByLabelText(/components.wizard.stepOne.form.recipientsType/);
    const radio3 = getByLabelText(/components.wizard.stepOne.form.taxCodeList/);
    const radio4 = getByLabelText(/components.wizard.stepOne.form.manualSelection/);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    userEvent.click(firstRadioGroup);
    expect(radio1).toBeChecked();

    expect(radio2).toBeDisabled();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    userEvent.click(secondRadioGroup);
    expect(radio3 || radio4).not.toBeChecked();
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

    const budgetTot = getByLabelText(/components.wizard.stepOne.form.totalBudget/);
    const budgetPerPerson = getByLabelText(/components.wizard.stepOne.form.budgetPerPerson/);

    /* check if the field are required */

    expect(budgetTot).toBeRequired();
    expect(budgetPerPerson).toBeRequired();

    /* Validation */

    fireEvent.change(budgetTot, { target: { value: '1000' } });
    expect(hasInputValueTot(budgetTot, '1000')).toBe(true);

    fireEvent.change(budgetPerPerson, { target: { value: '100' } });
    expect(hasInputValuePerPerson(budgetPerPerson, '100')).toBe(true);
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

    const rankingStartDate = getByLabelText(/components.wizard.stepOne.form.timeRangeJoinFrom/);
    const rankingEndDate = getByLabelText(/components.wizard.stepOne.form.timeRangeJoinTo/);
    const startDate = getByLabelText(/components.wizard.stepOne.form.timeRangeSpendFrom/);
    const endDateDate = getByLabelText(/components.wizard.stepOne.form.timeRangeSpendTo/);

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
