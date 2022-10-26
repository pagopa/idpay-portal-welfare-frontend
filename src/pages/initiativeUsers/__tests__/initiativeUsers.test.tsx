import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import { mockLocationFunction } from '../../initiativeOverview/__tests__/initiativeOverview.test';
import InitiativeUsers from '../initiativeUsers';

jest.mock('react-router-dom', () => mockLocationFunction());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),

  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

describe('<InitiativeUsers />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data

    window.scrollTo = jest.fn();
  });

  it('Test InitiativeUsers to be Rendered with state', async () => {
    render(
      <Provider store={store}>
        <InitiativeUsers />
      </Provider>
    );
  });
});
