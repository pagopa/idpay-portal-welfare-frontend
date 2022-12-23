/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import TimeLimitItem from '../TimeLimitItem';
import { rewardLimits, shopRulesToSubmit } from './ShopRules.test';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

window.scrollTo = jest.fn();

describe('<TimeLimitItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const data = [{ frequency: 'DAILY', rewardLimit: 2 }];

  test('should render correctly the TimeLimitItem component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <TimeLimitItem
            key={0}
            title={''}
            code={'REWARDLIMIT'}
            handleShopListItemRemoved={undefined}
            action={WIZARD_ACTIONS.DRAFT}
            shopRulesToSubmit={shopRulesToSubmit}
            setShopRulesToSubmit={jest.fn()}
            data={rewardLimits}
            setData={jest.fn()}
          />
        </Provider>
      );
    });
  });

  it('test on handleSubmit', async () => {
    await act(async () => {
      const mockedHandleShopListItemRemoved = jest.fn();
      const { getByText, getByTestId, getByPlaceholderText } = render(
        <Provider store={store}>
          <TimeLimitItem
            key={1}
            title={'title'}
            code={'REWARDLIMIT'}
            handleShopListItemRemoved={mockedHandleShopListItemRemoved}
            action={WIZARD_ACTIONS.SUBMIT}
            shopRulesToSubmit={shopRulesToSubmit}
            setShopRulesToSubmit={jest.fn()}
            data={data}
            setData={jest.fn()}
          />
        </Provider>
      );

      const deleteBtn = getByTestId('delete-button-test') as HTMLButtonElement;
      const addTimeLimitBtn = getByText(
        'components.wizard.stepFour.form.addTimeLimitItem'
      ) as HTMLButtonElement;

      const rewardLimit = getByPlaceholderText(
        /components.wizard.stepFour.form.maxReward/i
      ) as HTMLInputElement;

      fireEvent.click(deleteBtn);
      expect(mockedHandleShopListItemRemoved).toHaveBeenCalledTimes(1);

      fireEvent.click(addTimeLimitBtn);
      expect(addTimeLimitBtn).toBeInTheDocument();

      const selectFrequeny = getByTestId('select-frequency-test') as HTMLSelectElement;
      fireEvent.click(selectFrequeny);
      fireEvent.change(selectFrequeny, { target: { value: 'DAILY' } });
      expect(selectFrequeny).toBeInTheDocument();

      fireEvent.change(rewardLimit, { target: { value: 'temp text' } });
      expect(rewardLimit).toBeInTheDocument();
    });
  });
});
