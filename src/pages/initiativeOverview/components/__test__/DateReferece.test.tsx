/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import DateReference from '../DateReference';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<ExitModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const initiative = store.getState().initiative;
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the DateReference component with his functions', async () => {
    await act(async () => {
      // jest.mock(
      //   'c:/Users/fmaiocch/Desktop/React_Project/idpay-portal-welfare-frontend/src/pages/initiativeOverview/components/DateReference',
      //   () => ({
      //     formatDate: jest.fn(),
      //     timeRemainingToJoin: jest.fn(),
      //     chooseDateToFormat: jest.fn(),
      //     dateMessageStatusApproved: jest.fn(),
      //   })
      // );
      render(
        <Provider store={store}>
          <DateReference initiative={initiative} handleViewDetails={undefined} />
        </Provider>
      );
    });
  });
});
