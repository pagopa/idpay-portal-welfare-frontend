/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { RewardLimit } from '../../../../../model/Initiative';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import TimeLimitItem from '../TimeLimitItem';


// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<TimeLimitItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should render correctly the TimeLimitItem component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <TimeLimitItem
            key={0}
            title={''}
            code={''}
            handleShopListItemRemoved={undefined}
            action={WIZARD_ACTIONS.DRAFT}
            shopRulesToSubmit={[{ code: undefined, dispatched: false }]}
            setShopRulesToSubmit={function (
              _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
            ): void {
              //
            }}
            data={undefined}
            setData={function (_value: SetStateAction<Array<RewardLimit> | undefined>): void {
              //
            }}
          />
        </Provider>
      );
    });
  });

  it('test on handleSubmit', async () => {
    await act(async () => {
      const mockedHandleShopListItemRemoved = jest.fn();
      const { getByText, getByTestId, getAllByTestId, getByPlaceholderText } = render(
        <Provider store={store}>
          <TimeLimitItem
            key={1}
            title={'tittle'}
            code={'code'}
            handleShopListItemRemoved={mockedHandleShopListItemRemoved}
            action={WIZARD_ACTIONS.SUBMIT}
            shopRulesToSubmit={[
              { code: 'code', dispatched: true },
              { code: 'code', dispatched: true },
            ]}
            setShopRulesToSubmit={function (
              _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
            ): void {
              //
            }}
            data={[{ frequency: 'MONTHLY', rewardLimit: 2 }]}
            setData={function (_value: SetStateAction<Array<RewardLimit> | undefined>): void {
              //
            }}
          />
        </Provider>
      );

      const deleteBtn = getByTestId('delete-button-test') as HTMLButtonElement;
      const addTimeLimitBtn = getByText(
        'components.wizard.stepFour.form.addTimeLimitItem'
      ) as HTMLButtonElement;
      const selectFrequeny = getByTestId('select frequency') as HTMLSelectElement;
      const rewardLimit = getByPlaceholderText(
        /components.wizard.stepFour.form.maxReward/i
      ) as HTMLInputElement;
      // const removeCircleIcon = getAllByTestId('removeCircleIconLimit') as HTMLElement[];

      fireEvent.click(deleteBtn);
      expect(mockedHandleShopListItemRemoved).toHaveBeenCalledTimes(1);

      fireEvent.click(addTimeLimitBtn);
      expect(addTimeLimitBtn).toBeInTheDocument();

      fireEvent.change(selectFrequeny, { target: { value: 'DAILY' } });
      expect(selectFrequeny).toBeInTheDocument();
      fireEvent.change(rewardLimit, { target: { value: 'temp text' } });
      expect(rewardLimit).toBeInTheDocument();
    });
  });
});
