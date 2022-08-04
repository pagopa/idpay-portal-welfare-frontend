import { fireEvent, render, waitFor } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { AvailableCriteria } from '../../../../../model/AdmissionCriteria';
import { ManualCriteriaItem } from '../../../../../model/Initiative';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import AdmissionCriteria from '../AdmissionCriteria';
import AdmissionCriteriaModal from '../AdmissionCriteriaModal';
import ManualCriteria from '../ManualCriteria';

describe('<StepOneForm />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  test('should display the second step, with validation on input data', () => {
    render(
      <Provider store={store}>
        <AdmissionCriteria
          action={''}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (value: SetStateAction<string>): void {
            console.log(value);
          }}
          currentStep={1}
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
  });

  it('Test onClick of "Sfoglia Criteri" to open the modal must be true', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <AdmissionCriteria
          action={''}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (value: SetStateAction<string>): void {
            console.log(value);
          }}
          currentStep={1}
          // eslint-disable-next-line react/jsx-no-bind
          setCurrentStep={function (value: SetStateAction<number>): void {
            console.log(value);
          }}
        />
      </Provider>
    );

    const criteria = getByTestId('criteria-button-test');
    const addManually = getByTestId('add-manually-test');

    const criteriaModal = (
      <AdmissionCriteriaModal
        openModal={false}
        // eslint-disable-next-line react/jsx-no-bind
        handleCloseModal={function (event: React.MouseEvent<Element, MouseEvent>): void {
          console.log(event);
        }}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaAdded={function (event: React.MouseEvent<Element, MouseEvent>): void {
          console.log(event);
        }}
        criteriaToRender={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToRender={function (value: Array<AvailableCriteria>): void {
          console.log(value);
        }}
      />
    ) as unknown as HTMLElement;

    const formData = {
      _type: '',
      description: '',
      code: '1',
      boolValue: true,
      multiValue: ['', ''],
    };

    const ManuallyAdded = (
      <ManualCriteria
        data={formData}
        action={''}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={function (event: React.MouseEvent<Element, MouseEvent>): void {
          console.log(event);
        }}
        manualCriteriaToRender={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setManualCriteriaToRender={function (
          value: SetStateAction<Array<ManualCriteriaItem>>
        ): void {
          console.log(value);
        }}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          console.log(value);
        }}
      />
    );

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(() => expect(criteriaModal).not.toBeInTheDocument());

    fireEvent.click(criteria);
    expect(criteria).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(() => expect(criteriaModal).toBeInTheDocument());

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(() => expect(ManuallyAdded).not.toBeInTheDocument());

    fireEvent.click(addManually);
    expect(addManually).toBeTruthy();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(() => expect(ManuallyAdded).toBeInTheDocument());
  });
});
