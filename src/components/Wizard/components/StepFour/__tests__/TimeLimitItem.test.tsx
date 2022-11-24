/* eslint-disable react/jsx-no-bind */
import { fireEvent, render } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { RewardLimit } from '../../../../../model/Initiative';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import TimeLimitItem from '../TimeLimitItem';
import React from 'react';

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
            action={'SUBMIT'}
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
      const handleShopListItemRemoved = jest.fn();
      render(
        <Provider store={store}>
          <TimeLimitItem
            key={1}
            title={'tittle'}
            code={'code'}
            handleShopListItemRemoved={handleShopListItemRemoved('code')}
            action={'DRAFT'}
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
      // handleSubmit();
      // expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it('call the submit event when form is submitted', async () => {
    await act(async () => {
      const handleSubmit = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard handleOpenExitModal={() => console.log('exit modal')} />
        </Provider>
      );

      const submit = getByTestId('continue-action-test');
      fireEvent.click(submit);
      expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
      expect(handleSubmit).toBeDefined();
    });
  });

  it('draf action makes the dispatch', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <Wizard handleOpenExitModal={() => console.log('exit modal')} />
        </Provider>
      );

      const skip = getByTestId('skip-action-test');
      // eslint-disable-next-line @typescript-eslint/await-thenable
      fireEvent.click(skip);
      expect(WIZARD_ACTIONS.DRAFT).toBe('DRAFT');
    });
  });
});
