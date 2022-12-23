/* eslint-disable react/jsx-no-bind */
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../../../utils/test-utils';
import MCCModal from '../MCCModal';

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
        mccCodesList={[
          { code: '0742', description: 'description', checked: true },
          { code: '0743', description: 'description2', checked: true },
          { code: '0744', description: 'description2', checked: false },
        ]}
        setMccCodesList={setMccCodesList}
        setFieldValue={setFieldValue}
        handleMccCodeCheckedUpdate={handleMccCodeCheckedUpdate}
      />
    );

    const modal = document.querySelector('[data-testid="mcc-modal"]') as HTMLElement;
    expect(modal).toBeInTheDocument();

    const fade = document.querySelector('[data-testid="mcc-fade"]') as HTMLElement;
    expect(fade).toBeInTheDocument();

    const addBtn = screen.getByTestId('add-button-test') as HTMLButtonElement;
    fireEvent.click(addBtn);

    const selectCodes = screen.getByTestId('Select-Deselect-all-button-test') as HTMLButtonElement;
    fireEvent.click(selectCodes);

    const serachCode = screen.getByTestId('search-code-description-test') as HTMLInputElement;
    fireEvent.change(serachCode, { target: { value: '0744' } });
    expect(serachCode.value).toBe('0744');

    const closeBtn = screen.getByTestId('close-modal-test') as HTMLButtonElement;
    fireEvent.click(closeBtn);
  });

  test('should render correctly the MCCModal component', async () => {
    renderWithProviders(
      <MCCModal
        openModalMcc={true}
        handleCloseModalMcc={handleCloseModalMcc}
        mccCodesList={[
          { code: '0742', description: 'description', checked: true },
          { code: '0743', description: 'description2', checked: true },
          { code: '0744', description: 'description2', checked: false },
        ]}
        setMccCodesList={setMccCodesList}
        setFieldValue={setFieldValue}
        handleMccCodeCheckedUpdate={handleMccCodeCheckedUpdate}
      />
    );

    const checkBoxMccCodes = screen.getAllByTestId('check-test-1') as HTMLInputElement[];
    const firstCheckBox = checkBoxMccCodes[0].querySelector('input') as HTMLInputElement;

    expect(firstCheckBox).toBeInTheDocument();
    expect(firstCheckBox.checked).toEqual(true);
    fireEvent.click(firstCheckBox);
  });

  test('should render correctly the MCCModal component', async () => {
    renderWithProviders(
      <MCCModal
        openModalMcc={false}
        handleCloseModalMcc={handleCloseModalMcc}
        mccCodesList={[
          { code: '0742', description: 'description', checked: true },
          { code: '0743', description: 'description2', checked: true },
          { code: '0744', description: 'description2', checked: false },
        ]}
        setMccCodesList={setMccCodesList}
        setFieldValue={setFieldValue}
        handleMccCodeCheckedUpdate={handleMccCodeCheckedUpdate}
      />
    );
  });
});
