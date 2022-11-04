/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import ShopRulesModal from '../ShopRulesModal';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<ShopRulesModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  test('should render correctly the ShopRulesModal component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ShopRulesModal
            openModal={false}
            handleCloseModal={function (_event: React.MouseEvent<Element>): void {
              //
            }}
            availableShopRules={[]}
            handleShopListItemAdded={undefined}
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
