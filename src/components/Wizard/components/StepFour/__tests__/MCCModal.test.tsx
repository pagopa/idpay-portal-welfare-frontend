/* eslint-disable react/jsx-no-bind */
import { SetStateAction } from 'react';
import { MccCodesModel } from '../../../../../model/MccCodes';
import MCCModal from '../MCCModal';
import React from 'react';
import { renderWithProviders } from '../../../../../utils/test-utils';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import Search from '@mui/icons-material/Search';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<MCCModal />', () => {
  const handleCloseModalMcc = jest.fn();
  const setFieldValue = jest.fn();
  const handleMccCodeCheckedUpdate = jest.fn();
  const setMccCodesList = jest.fn();

  test('should render correctly the MCCModal component', async () => {
    renderWithProviders(
      <MCCModal
        openModalMcc={true}
        handleCloseModalMcc={handleCloseModalMcc}
        mccCodesList={[{ code: 'code', description: 'description', checked: true }]}
        setMccCodesList={setMccCodesList}
        setFieldValue={setFieldValue}
        handleMccCodeCheckedUpdate={handleMccCodeCheckedUpdate}
      />
    );

    const modal = document.querySelector('[data-testid="mcc-modal"]') as HTMLElement;
    expect(modal).toBeInTheDocument();

    const fade = document.querySelector('[data-testid="mcc-fade"]') as HTMLElement;
    expect(fade).toBeInTheDocument();

    const closeBtn = screen.getByTestId('close-modal-test') as HTMLButtonElement;
    fireEvent.click(closeBtn);

    const addBtn = screen.getByTestId('add-button-test') as HTMLButtonElement;
    fireEvent.click(addBtn);

    const selectCodes = screen.getByTestId('Select-Deselect-all-button-test') as HTMLButtonElement;
    fireEvent.click(selectCodes);

    const serachCode = screen.getByTestId('search-code-description-test') as HTMLInputElement;
    fireEvent.change(serachCode, { target: { value: '00000' } });
    expect(serachCode.value).toBe('00000');
  });

  test('should render correctly the MCCModal component', async () => {
    renderWithProviders(
      <MCCModal
        openModalMcc={true}
        handleCloseModalMcc={handleCloseModalMcc}
        mccCodesList={[
          { code: 'code', description: 'description', checked: false },
          { code: 'code2', description: 'description2', checked: false },
        ]}
        setMccCodesList={setMccCodesList}
        setFieldValue={setFieldValue}
        handleMccCodeCheckedUpdate={handleMccCodeCheckedUpdate}
      />
    );

    const checkBoxMccCodes = screen.getAllByTestId('check-test-1') as HTMLInputElement[];
    const firstCheckBox = checkBoxMccCodes[0].querySelector('input') as HTMLInputElement;

    expect(firstCheckBox).toBeInTheDocument();
    expect(firstCheckBox.checked).toEqual(false);
    fireEvent.click(firstCheckBox);
  });

  test('should render correctly the MCCModal component', async () => {
    renderWithProviders(
      <MCCModal
        openModalMcc={false}
        handleCloseModalMcc={handleCloseModalMcc}
        mccCodesList={[
          { code: 'code', description: 'description', checked: false },
          { code: 'code2', description: 'description2', checked: false },
        ]}
        setMccCodesList={setMccCodesList}
        setFieldValue={setFieldValue}
        handleMccCodeCheckedUpdate={handleMccCodeCheckedUpdate}
      />
    );
  });
});
