/* eslint-disable react/jsx-no-bind */
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { MccCodesModel } from '../../../../../model/MccCodes';
import MCCModal from '../MCCModal';
import React from 'react';
import { renderWithProviders } from '../../../../../utils/test-utils';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<MCCModal />', () => {
  const handleCloseModalMcc = jest.fn();
  const setFieldValue = jest.fn();
  const handleMccCodeCheckedUpdate = jest.fn();

  test('should render correctly the MCCModal component', async () => {
    await act(async () => {
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
    });
  });

  test('should render correctly the MCCModal component', async () => {
    await act(async () => {
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
