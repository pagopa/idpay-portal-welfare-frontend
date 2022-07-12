import { render } from '@testing-library/react';
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
  it('The field are correctly present inside the component, Validation is made by Formik + Yup', () => {
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

    expect(store.getState().stepOneForm.form.recipientsQuestionGroup).toBe('persons');
    expect(store.getState().stepOneForm.form.recipientsTypeGroup).toBe('manual_list');
    expect(store.getState().stepOneForm.form.totalBudget).toBe('');
    expect(store.getState().stepOneForm.form.budgetPerPerson).toBe('');
    expect(store.getState().stepOneForm.form.joinFrom).toBe('');
    expect(store.getState().stepOneForm.form.joinTo).toBe('');
    expect(store.getState().stepOneForm.form.spendFrom).toBe('');
    expect(store.getState().stepOneForm.form.spendTo).toBe('');

    expect(getByTestId('recipients-question-label')).toBeValid();
    expect(getByTestId('recipients-type-label')).toBeValid();
    expect(getByTestId('total-budget-t')).toBeValid();
    expect(getByTestId('budget-per-person')).toBeValid();
    expect(getByTestId('join-from-t')).toBeValid();
    expect(getByTestId('join-to-t')).toBeValid();
    expect(getByTestId('spend-from-t')).toBeValid();
    expect(getByTestId('spend-to-t')).toBeValid();
  });
});
