import React from 'react';
import { findByTestId, fireEvent, screen } from '@testing-library/react';
import { AvailableCriteria } from '../../../../../model/AdmissionCriteria';
import AdmissionCriteriaModal from '../AdmissionCriteriaModal';
import { renderWithContext } from '../../../../../utils/test-utils';

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
    renderWithContext(
      <AdmissionCriteriaModal
        openModal={true}
        handleCloseModal={jest.fn()}
        handleCriteriaAdded={jest.fn()}
        criteriaToRender={mockedCriteria}
        setCriteriaToRender={jest.fn()}
        searchCriteria={''}
        setSearchCriteria={jest.fn()}
      />
    );

    const checkBoxCriteria = (await screen.findAllByTestId('check-test-1')) as HTMLInputElement[];
    const firstCheckBox = checkBoxCriteria[0].querySelector('input') as HTMLInputElement;

    expect(firstCheckBox).toBeInTheDocument();
    expect(firstCheckBox.checked).toEqual(false);
    fireEvent.click(firstCheckBox);
    expect(firstCheckBox.checked).toEqual(true);

    const searchCriteriaInput = screen.getByTestId('search-criteria-test') as HTMLInputElement;
    fireEvent.change(searchCriteriaInput, { target: { value: 'search criteria' } });
  });

  test('Should display the Modal', async () => {
    const mockedCriteria: Array<AvailableCriteria> = [
      {
        authorityLabel: 'ISEE',
        fieldLabel: 'ISEE',
        value: 'value2',
        value2: 'value2',
        code: 'code1',
        authority: 'auth1',
        operator: 'ope1',
      },
    ];

    renderWithContext(
      <AdmissionCriteriaModal
        openModal={true}
        handleCloseModal={jest.fn()}
        handleCriteriaAdded={jest.fn()}
        criteriaToRender={mockedCriteria}
        setCriteriaToRender={jest.fn()}
        searchCriteria={'ISEE'}
        setSearchCriteria={jest.fn()}
      />
    );
  });
});
