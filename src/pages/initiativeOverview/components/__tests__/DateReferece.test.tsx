/* eslint-disable react/jsx-no-bind */
import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import DateReference from '../DateReference';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<DataReference />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const initiative = store.getState().initiative;
  const handleViewDetails = jest.fn();
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the DateReference component with his functions', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <DateReference initiative={initiative} handleViewDetails={undefined} />
        </Provider>
      );
    });
  });

  it('test handleViewDetails', async () => {
    await act(async () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <DateReference initiative={initiative} handleViewDetails={handleViewDetails} />
        </Provider>
      );

      await waitFor(async () => {
        const details = queryByTestId('view-datails-test') as HTMLButtonElement;
        fireEvent.click(details);
        handleViewDetails(initiative.initiativeId);
        expect(handleViewDetails).toHaveBeenCalled();
      });
    });
  });
});
