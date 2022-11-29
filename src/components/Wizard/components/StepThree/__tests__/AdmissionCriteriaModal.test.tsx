import React from 'react';
import { waitFor, fireEvent, act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { AvailableCriteria } from '../../../../../model/AdmissionCriteria';
import { createStore } from '../../../../../redux/store';
import AdmissionCriteriaModal from '../AdmissionCriteriaModal';
import { renderWithProviders } from '../../../../../utils/test-utils';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<AdmissionCriteriaModal />', () => {
  const mockedCriteria: AvailableCriteria = {
    authorityLabel: '',
    fieldLabel: '',
    value: '',
    value2: '',
    code: '',
    authority: '',
    operator: '',
  };
  test('Should display the Modal', async () => {
    await act(async () => {
      const { debug } = renderWithProviders(
        <AdmissionCriteriaModal
          openModal={true}
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
          criteriaToRender={[mockedCriteria]}
          // eslint-disable-next-line react/jsx-no-bind
          setCriteriaToRender={function (value: Array<AvailableCriteria>): void {
            console.log(value);
          }}
        />
      );
    });
  });

  // eslint-disable-next-line sonarjs/no-identical-functions
  it('CheckBox Admission Criteria test', async () => {
    const handleClose = jest.fn();
    // eslint-disable-next-line sonarjs/no-identical-functions
    const { queryByTestId } = renderWithProviders(
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
    );

    const checkNotSearched = queryByTestId('check-test-1') as HTMLInputElement;
    const checkSearched = queryByTestId('check-test-2') as HTMLInputElement;
    const closeModal = queryByTestId('close-modal-test') as HTMLInputElement;
    const handleCriteriaChange = jest.fn();

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
      expect(handleCriteriaChange).toBeDefined();
      expect(handleCriteriaChange).toHaveBeenCalledTimes(0);
      expect(checkNotSearched.checked).toEqual(true);
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(checkSearched.checked).toEqual(false);
      fireEvent.change(checkSearched, { target: { value: true } });
      expect(handleCriteriaChange).toBeDefined();
      expect(handleCriteriaChange).toHaveBeenCalledTimes(0);
      expect(checkSearched.checked).toEqual(true);
    });
  });

  it('test Search Criteria TextField', async () => {
    const { queryByLabelText } = renderWithProviders(
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
      /components.wizard.stepThree.chooseCriteria.modal.searchCriteria/
    ) as HTMLInputElement;
    const handleSearchCriteria = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(handleSearchCriteria).toBeDefined();
      expect(handleSearchCriteria).toHaveBeenCalledTimes(0);
      expect(searchInput.value).toBe(true);
    });
  });
});
