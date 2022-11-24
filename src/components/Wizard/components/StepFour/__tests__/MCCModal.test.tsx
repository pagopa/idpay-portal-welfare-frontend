/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MccCodesModel } from '../../../../../model/MccCodes';
import { createStore } from '../../../../../redux/store';
import MCCModal from '../MCCModal';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<MCCModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const handleCloseModalMcc = jest.fn();
  const setFieldValue = jest.fn();
  const handleMccCodeCheckedUpdate = jest.fn();

  test('should render correctly the MCCModal component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
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
        </Provider>
      );
    });
  });

  test('should render correctly the MCCModal component', async () => {
    await act(async () => {
      const { debug, container } = render(
        <Provider store={store}>
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
        </Provider>
      );
    });
  });

});
