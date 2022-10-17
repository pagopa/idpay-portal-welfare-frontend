/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import ShopRulesContentBody from '../StepFour/ShopRuleContentBody';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<ShopRulesContentBody />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const initiative = store.getState().initiative;
  const printRewardRuleAsString = jest.fn();
  const printMccFilterAsString = jest.fn();
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the ShopRulesContentBody component with his functions', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ShopRulesContentBody initiativeDetail={initiative} />
        </Provider>
      );
      expect(printRewardRuleAsString).toBeDefined();
      expect(printMccFilterAsString).toBeDefined();
    });
  });
});
