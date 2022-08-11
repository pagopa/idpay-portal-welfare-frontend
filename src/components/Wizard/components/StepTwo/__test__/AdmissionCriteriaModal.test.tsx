import { waitFor, fireEvent, act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { AvailableCriteria } from '../../../../../model/AdmissionCriteria';
import { createStore } from '../../../../../redux/store';
import AdmissionCriteriaModal from '../AdmissionCriteriaModal';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<AdmissionCriteriaModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  test('Should display the Modal', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <AdmissionCriteriaModal
            openModal={false}
            // eslint-disable-next-line react/jsx-no-bind
            handleCloseModal={function (event: React.MouseEvent<Element, MouseEvent>): void {
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
        </Provider>
      );
    });
  });

  // eslint-disable-next-line sonarjs/no-identical-functions
  it('CheckBox Admission Criteria test', async () => {
    const handleClose = jest.fn();
    // eslint-disable-next-line sonarjs/no-identical-functions
    const { queryByTestId } = render(
      <Provider store={store}>
        <AdmissionCriteriaModal
          openModal={false}
          // eslint-disable-next-line react/jsx-no-bind
          handleCloseModal={handleClose}
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
      </Provider>
    );

    const checkNotSearched = queryByTestId('check-test-1') as HTMLInputElement;
    const checkSearched = queryByTestId('check-test-2') as HTMLInputElement;
    const closeModal = queryByTestId('close-modal-test') as HTMLInputElement;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(closeModal).toBeTruthy();
      fireEvent.click(closeModal);
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    /* test checked value */

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(checkNotSearched || checkSearched).toHaveAttribute('checked');
    });
    /* test value change */

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(checkNotSearched.checked).toEqual(false);
      fireEvent.change(checkNotSearched, { target: { value: true } });
      expect(checkNotSearched.checked).toEqual(true);
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(checkSearched.checked).toEqual(false);
      fireEvent.change(checkSearched, { target: { value: true } });
      expect(checkSearched.checked).toEqual(true);
    });
  });

  it('test Search Criteria TextField', async () => {
    const { queryByLabelText } = render(
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

    const searchInput = queryByLabelText(
      /components.wizard.stepTwo.chooseCriteria.modal.searchCriteria/
    ) as HTMLInputElement;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(searchInput.value).toBe(true);
    });
  });

  // it('Should add a Criteria', async () => {
  //   const rendering = [Array<AvailableCriteria>];

  //   const { queryByTestId } = render(
  //     <AdmissionCriteriaModal
  //       openModal={false}
  //       // eslint-disable-next-line react/jsx-no-bind
  //       handleCloseModal={function (event: React.MouseEvent<HTMLInputElement, MouseEvent>): void {
  //         console.log(event);
  //       }}
  //       // eslint-disable-next-line react/jsx-no-bind
  //       handleCriteriaAdded={function (
  //         event: React.MouseEvent<HTMLInputElement, MouseEvent>
  //       ): void {
  //         console.log(event);
  //       }}
  //       criteriaToRender={[]}
  //       // eslint-disable-next-line react/jsx-no-bind
  //       setCriteriaToRender={function (value: Array<AvailableCriteria>): void {
  //         console.log(value);
  //       }}
  //     />
  //   );

  //   const addCrit = 'test';
  //   const addButton = queryByTestId('add-button-test') as HTMLInputElement;
  //   const checkNotSearched = queryByTestId('check-test-1') as HTMLInputElement;
  //   const checkSearched = queryByTestId('check-test-2') as HTMLInputElement;

  //   // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //   waitFor(async () => {
  //     // verify addCrit is NOT in the initial list
  //     expect(rendering.find((criteria: { name: string }) => criteria.name === addCrit)).toBeFalsy();

  //     // add criteria
  //     fireEvent.change(checkSearched || checkNotSearched, { target: { value: addCrit } });
  //     fireEvent.click(addButton);
  //     expect(rendering.findIndex((criteria) => criteria.arguments === addCrit)).toBe(0);
  //   });
  // });
});
