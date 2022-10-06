/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import RefundRuleContentBody from '../StepFive/RefundRuleContentBody';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<RefundRuleContentBody />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const initiative = store.getState().initiative;
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the RefundRuleContentBody component with his functions', async () => {
    await act(async () => {
      // jest.mock('src/pages/initiativeDetail/components/StepFive/RefundRuleContentBody.tsx', () => ({
      //   printRefundParameterAsString: jest.fn(),
      // }));
      render(
        <Provider store={store}>
          <RefundRuleContentBody initiativeDetail={initiative} />
        </Provider>
      );
    });
  });
});
