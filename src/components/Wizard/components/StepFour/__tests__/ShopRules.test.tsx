/* eslint-disable react/jsx-no-bind */
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import React, { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { mockedInitiative } from '../../../../../model/__tests__/Initiative.test';
import { setInitiative } from '../../../../../redux/slices/initiativeSlice';
import { createStore, store } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithProviders } from '../../../../../utils/test-utils';
import ShopRules from '../ShopRules';


jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

afterEach(cleanup);

describe('<RefundRules />', (injectedStore?: ReturnType<typeof createStore>) => {
  const setAction = jest.fn();
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should render correctly the ShopRules component', async () => {
    await act(async () => {
      renderWithProviders(
        <ShopRules
          action={WIZARD_ACTIONS.DRAFT}
          setAction={setAction}
          currentStep={0}
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //
          }}
          setDisabledNext={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      );
      // expect(setAction.mock.calls.length).toBe(0);
    });
  });

  it('test on handleSubmit', async () => {
    store.dispatch(setInitiative(mockedInitiative));
    // console.log(store.getState().initiative.beneficiaryRule);
    const { debug } = render(
      <Provider store={store}>
        <ShopRules
          action={WIZARD_ACTIONS.SUBMIT}
          setAction={function (_value: SetStateAction<string>): void {
            //
          }}
          currentStep={1}
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //
          }}
          setDisabledNext={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('criteria-button-test')).not.toBeNull());
  });
});
