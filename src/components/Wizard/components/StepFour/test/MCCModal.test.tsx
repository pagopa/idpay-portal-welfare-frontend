/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MccCodesModel } from '../../../../../model/MccCodes';
import { createStore } from '../../../../../redux/store';
import MCCModal from '../MCCModal';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<MCCModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  test('should render correctly the MCCModal component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MCCModal
            openModalMcc={false}
            handleCloseModalMcc={undefined}
            mccCodesList={[]}
            setMccCodesList={function (_value: SetStateAction<Array<MccCodesModel>>): void {
              //
            }}
            setFieldValue={undefined}
            handleMccCodeCheckedUpdate={undefined}
          />
        </Provider>
      );
    });
  });

  //   it('form fields not null', async () => {
  //     await act(async () => {
  //       const { getByTestId, container } = render(
  //         <Provider store={store}>
  //           <ShopRulesModal
  //             openModal={false}
  //             handleCloseModal={function (_event: React.MouseEvent<Element>): void {
  //               //
  //             }}
  //             availableShopRules={[]}
  //             handleShopListItemAdded={undefined}
  //           />
  //         </Provider>
  //       );
  //     });
  //   });
});
