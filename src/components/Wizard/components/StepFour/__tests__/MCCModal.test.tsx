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

  test('should render correctly the MCCModal component', async () => {
    renderWithProviders(
      <MCCModal
        openModalMcc={true}
        handleCloseModalMcc={handleCloseModalMcc}
        mccCodesList={[{ code: 'code', description: 'description', checked: true }]}
        setMccCodesList={function (_value: SetStateAction<Array<MccCodesModel>>): void {
          //
        }}
        setFieldValue={setFieldValue}
        handleMccCodeCheckedUpdate={handleMccCodeCheckedUpdate}
      />
    );

    const modal = document.querySelector('[data-testid="mcc-modal"]') as HTMLElement;
    const fade = document.querySelector('[data-testid="mcc-fade"]') as HTMLElement;
    const closeBtn = screen.getByTestId('close-modal-test') as HTMLButtonElement;
    const addBtn = screen.getByTestId('add-button-test') as HTMLButtonElement;
    const serachCode = screen.getByTestId('search-code-description-test') as HTMLInputElement;
    const selectCodes = screen.getByTestId('Select-Deselect-all-button-test') as HTMLButtonElement;

    fireEvent.change(serachCode, { target: { value: '00000' } });
    expect(serachCode.value).toBe('00000');

    await waitFor(async () => {
      expect(modal).toBeInTheDocument();
      expect(fade).toBeInTheDocument();
      fireEvent.click(closeBtn);
      fireEvent.click(addBtn);
      fireEvent.click(selectCodes);
    });
  });

  test('should render correctly the MCCModal component', async () => {
    await waitFor(async () => {
      renderWithProviders(
        <MCCModal
          openModalMcc={false}
          handleCloseModalMcc={handleCloseModalMcc}
          mccCodesList={[
            { code: 'code', description: 'description', checked: false },
            { code: 'code2', description: 'description2', checked: false },
          ]}
          setMccCodesList={function (_value: SetStateAction<Array<MccCodesModel>>): void {
            //
          }}
          setFieldValue={setFieldValue}
          handleMccCodeCheckedUpdate={handleMccCodeCheckedUpdate}
        />
      );
    });
  });
});
