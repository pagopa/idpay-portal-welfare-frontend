import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import React from 'react';
import SummaryContentBody from '../Summary/SummaryContentBody';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<SummaryContentBody />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the SummaryContentBody component with his functions', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <SummaryContentBody heading={''} title={''} />
        </Provider>
      );
    });
  });
});
