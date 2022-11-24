import { fireEvent, render, waitFor } from '@testing-library/react';
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

  test('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  test('Test of breadcrumbs/searchUser and onChange of searchUser', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <InitiativeUsers />
      </Provider>
    );
    const breadcrumbs = getByTestId('breadcrumbs-test') as HTMLDivElement;
    const searchUser = getByTestId('searchUser-test').querySelector('input') as HTMLInputElement;

    expect(breadcrumbs).not.toBeNull();
    expect(breadcrumbs).toBeInTheDocument();

    expect(searchUser).not.toBeNull();
    expect(searchUser).toBeInTheDocument();

    fireEvent.change(searchUser, { target: { value: '' } });
    expect(searchUser.value).toBe('');

    fireEvent.change(searchUser, { target: { value: 'searchUser' } });
    expect(searchUser.value).toBe('searchUser');
  });
});
