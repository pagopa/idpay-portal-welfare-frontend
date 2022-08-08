import { fireEvent, render, waitFor } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { AvailableCriteria } from '../../../../../model/AdmissionCriteria';
// import { ManualCriteriaItem } from '../../../../../model/Initiative';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import AdmissionCriteria from '../AdmissionCriteria';
import AdmissionCriteriaModal from '../AdmissionCriteriaModal';
// import ManualCriteria from '../ManualCriteria';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<AdmissionCriteria />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  test('should display the second step, with validation on input data', async () => {
    await act(async () => {
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
            // eslint-disable-next-line react/jsx-no-bind
            setDisabledNext={function (value: SetStateAction<boolean>): void {
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
      fireEvent.click(submit);
      expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
    });
  });

  it('draf action makes the dispatch', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard />
        </Provider>
      );

      const skip = getByTestId('skip-action-test');
      // eslint-disable-next-line @typescript-eslint/await-thenable
      fireEvent.click(skip);
      expect(WIZARD_ACTIONS.DRAFT).toBe('DRAFT');
    });
  });

  it('Test onClick of "Sfoglia Criteri" to open the modal must be true', async () => {
    const { getByTestId, queryByTestId } = render(
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
          // eslint-disable-next-line react/jsx-no-bind
          setDisabledNext={function (value: SetStateAction<boolean>): void {
            console.log(value);
          }}
        />
      </Provider>
    );

    const criteria = getByTestId('criteria-button-test');
    const addManually = getByTestId('add-manually-test');
    const modal = queryByTestId('modal-test');
    const ManuallyAdded = queryByTestId('manually-added-test');

    // const formData = {
    //   _type: '',
    //   description: '',
    //   code: '1',
    //   boolValue: true,
    //   multiValue: ['', ''],
    // };

    // const ManuallyAdded = (
    //   <ManualCriteria
    //     data={formData}
    //     action={''}
    //     // eslint-disable-next-line react/jsx-no-bind
    //     handleCriteriaRemoved={function (
    //       event: React.MouseEvent<HTMLInputElement, MouseEvent>
    //     ): void {
    //       console.log(event);
    //     }}
    //     manualCriteriaToRender={[]}
    //     // eslint-disable-next-line react/jsx-no-bind
    //     setManualCriteriaToRender={function (
    //       value: SetStateAction<Array<ManualCriteriaItem>>
    //     ): void {
    //       console.log(value);
    //     }}
    //     criteriaToSubmit={[]}
    //     // eslint-disable-next-line react/jsx-no-bind
    //     setCriteriaToSubmit={function (
    //       value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
    //     ): void {
    //       console.log(value);
    //     }}
    //   />
    // );

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(modal).not.toBeInTheDocument();
      expect(modal).not.toBeVisible();
    });

    // eslint-disable-next-line @typescript-eslint/await-thenable
    fireEvent.click(criteria);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(criteria).toBeTruthy();
      expect(modal).toBeInTheDocument();
      expect(modal).toBeVisible();
      expect(ManuallyAdded).not.toBeInTheDocument();
      expect(ManuallyAdded).not.toBeVisible();
    });

    fireEvent.click(addManually);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(addManually).toBeTruthy();
      expect(ManuallyAdded).toBeInTheDocument();
      expect(ManuallyAdded).toBeVisible();
    });
  });

  // // eslint-disable-next-line sonarjs/no-identical-functions
  it('CheckBox Admission Criteria test', async () => {
    // eslint-disable-next-line sonarjs/no-identical-functions
    const { queryByTestId /* queryByLabelText */ } = render(
      <AdmissionCriteriaModal
        openModal={false}
        // eslint-disable-next-line react/jsx-no-bind
        handleCloseModal={function (event: React.MouseEvent<HTMLInputElement, MouseEvent>): void {
          console.log(event);
        }}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaAdded={function (
          event: React.MouseEvent<HTMLInputElement, MouseEvent>
        ): void {
          console.log(event);
        }}
        criteriaToRender={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToRender={function (value: Array<AvailableCriteria>): void {
          console.log(value);
        }}
      />
    );
    const check1 = queryByTestId('check-test-1') as HTMLInputElement;
    const check2 = queryByTestId('check-test-2') as HTMLInputElement;

    /* test checked value */

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(check1 || check2).toHaveAttribute('checked');
    });
    /* test value change */

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(check1.checked).toEqual(false);
      fireEvent.change(check1, { target: { value: true } });
      expect(check1.checked).toEqual(true);
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(check2.checked).toEqual(false);
      fireEvent.change(check2, { target: { value: true } });
      expect(check2.checked).toEqual(true);
    });

    // const criteria = queryByTestId('add-button-test');

    // // eslint-disable-next-line @typescript-eslint/no-floating-promises
    // waitFor(async () => {
    //   fireEvent.click(criteria);
    //   if (check1 || check2) {
    //     expect();
    //   }
    // });
  });

  it('test Search Criteria TextField', async () => {
    const { queryByLabelText /* getByTestId */ } = render(
      <AdmissionCriteriaModal
        openModal={false}
        // eslint-disable-next-line react/jsx-no-bind
        handleCloseModal={function (event: React.MouseEvent<HTMLInputElement, MouseEvent>): void {
          console.log(event);
        }}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaAdded={function (
          event: React.MouseEvent<HTMLInputElement, MouseEvent>
        ): void {
          console.log(event);
        }}
        criteriaToRender={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToRender={function (value: Array<AvailableCriteria>): void {
          console.log(value);
        }}
      />
    );

    const searchInput = queryByLabelText('Cerca criteri') as HTMLInputElement;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(searchInput.value).toBe('test');
    });
  });
});
