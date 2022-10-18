import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import React from 'react';
import AdditionalInfoContentBody from '../StepOne/AdditionalInfoContentBody';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<AdditionalInfoContentBody />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const initiative = store.getState().initiative;
  const printAssistanceChannelLabel = jest.fn();
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the AdditionalInfoContentBody component with his functions', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <AdditionalInfoContentBody initiativeDetail={initiative} />
        </Provider>
      );

      expect(printAssistanceChannelLabel).toBeDefined();
    });
  });
});
