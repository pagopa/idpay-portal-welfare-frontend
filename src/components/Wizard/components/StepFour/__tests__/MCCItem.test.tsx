/* eslint-disable react/jsx-no-bind */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import MCCItem from '../MCCItem';
import React from 'react';
import userEvent from '@testing-library/user-event';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<MCCItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const mockedFn = jest.fn();

  const setup = () => {
    const utils = render(
      <Provider store={store}>
        <MCCItem
          title={'title'}
          code={'code'}
          handleShopListItemRemoved={mockedFn}
          action={'action'}
          shopRulesToSubmit={[{ code: 'code', dispatched: true }]}
          setShopRulesToSubmit={function (
            _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
          ): void {
            //
          }}
          data={{ allowedList: true, values: ['string', '2string'] }}
          setData={function (_value: any): void {
            //
          }}
        />
      </Provider>
    );
    const mccCodesTextArea = utils.getByTestId('mccCodesTextArea') as HTMLInputElement;
    return {
      mccCodesTextArea,
      ...utils,
    };
  };

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should render correctly the MCCItem component', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <MCCItem
            title={'title'}
            code={'code'}
            handleShopListItemRemoved={mockedFn}
            action={'action'}
            shopRulesToSubmit={[{ code: 'code', dispatched: true }]}
            setShopRulesToSubmit={function (
              _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
            ): void {
              //
            }}
            data={{ allowedList: true, values: ['string', '2string'] }}
            setData={function (_value: any): void {
              //
            }}
          />
        </Provider>
      );

      const deletebtn = getByTestId('delete-button-test');

      fireEvent.click(deletebtn);
      expect(mockedFn.mock.calls.length).toEqual(1);
    });
  });

  test('mc Codes to be defined', async () => {
    const { mccCodesTextArea } = setup();

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/components.wizard.stepFour.form.mccCodes/i), 'CODES');
    // fireEvent.change(mccCodesTextArea, { target: { value: '3' } });
    expect(mccCodesTextArea).toBeDefined();
  });
});
