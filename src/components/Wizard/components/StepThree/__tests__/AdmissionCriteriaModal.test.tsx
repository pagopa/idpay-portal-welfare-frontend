import React from 'react';
import { waitFor, fireEvent, screen } from '@testing-library/react';
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
      authorityLabel: 'auth label',
      fieldLabel: 'field label',
      value: 'value2',
      value2: 'value2',
      code: 'code1',
      authority: 'auth1',
      operator: 'ope1',
    },
    {
      authorityLabel: 'authLabel',
      fieldLabel: 'field',
      value: 'valueobj2',
      value2: 'value2obj2',
      code: 'code2',
      authority: 'auth2',
      operator: 'ope2',
    },
  ];
  test('Should display the Modal', async () => {
    await waitFor(() => {
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
          setCriteriaToRender={jest.fn()}
        />
      );
    });
    /*
    await waitFor(() => {
      screen.debug();
    });
    */
    const modal = document.querySelector('[data-testid="admission-modal"') as HTMLElement;
    expect(modal).toBeInTheDocument();
    const fade = document.querySelector('[data-testid="admission-fade"]') as HTMLElement;
    const searchCriteriaInput = screen.getByTestId('search-criteria-test') as HTMLInputElement;
    const checkBoxCriteria = screen.getAllByTestId('check-test-1') as HTMLInputElement[];
    const firstCheckBox = checkBoxCriteria[0].querySelector('input') as HTMLInputElement;

    expect(fade).toBeInTheDocument();

    await waitFor(() => expect(firstCheckBox).toBeInTheDocument());
    await waitFor(() => expect(firstCheckBox.checked).toEqual(false));
    fireEvent.click(firstCheckBox);
    await waitFor(() => expect(firstCheckBox.checked).toEqual(true));

    const searchCriteria = document.querySelector(
      '[data-testid="search-criteria-test"]'
    ) as HTMLInputElement;
    fireEvent.change(searchCriteria, { target: { value: 'search critera' } });
    expect(searchCriteria).toBeInTheDocument();

    fireEvent.change(searchCriteriaInput, { target: { value: 'search criteria' } });

    await waitFor(() => expect(searchCriteria.value).toBe('search criteria'));
  });
});
