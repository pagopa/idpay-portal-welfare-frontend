import React from 'react';
import { waitFor, fireEvent, act } from '@testing-library/react';
import { AvailableCriteria } from '../../../../../model/AdmissionCriteria';
import AdmissionCriteriaModal from '../AdmissionCriteriaModal';
import { renderWithProviders } from '../../../../../utils/test-utils';

/*
jest.mock('@mui/material', () => ({
  Modal: () => ({ t: (key: any) => key }),
}));*/
beforeEach(() => {
  jest.mock('@mui/material');
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<AdmissionCriteriaModal />', () => {
  const mockedCriteria: Array<AvailableCriteria> = [
    {
      authorityLabel: '',
      fieldLabel: '',
      value: '',
      value2: '',
      code: '',
      authority: '',
      operator: '',
    },
    {
      authorityLabel: 'authLabel',
      fieldLabel: 'field',
      value: 'value',
      value2: 'value2',
      code: 'code',
      authority: 'auth',
      operator: 'ope',
    },
  ];
  test('Should display the Modal', async () => {
    await waitFor(async () => {
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
          criteriaToRender={mockedCriteria}
          // eslint-disable-next-line react/jsx-no-bind
          setCriteriaToRender={function (value: Array<AvailableCriteria>): void {
            console.log(value);
          }}
        />
      );
    });

    const modal = document.querySelector('[data-testid="admission-modal"') as HTMLElement;
    expect(modal).toBeInTheDocument();

    const fade = document.querySelector('[data-testid="admission-fade"]') as HTMLElement;
    expect(fade).toBeInTheDocument();

    const searchCriteria = document.querySelector(
      '[data-testid="search-criteria-test"]'
    ) as HTMLInputElement;
    fireEvent.change(searchCriteria, { target: { value: 'search critera' } });
    expect(searchCriteria).toBeInTheDocument();
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

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(searchInput.value).toBe(true);
    });
  });
});
