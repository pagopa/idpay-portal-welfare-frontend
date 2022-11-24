import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import { mockLocationFunction } from '../../initiativeOverview/__tests__/initiativeOverview.test';
import InitiativeUsers from '../initiativeUsers';
// import userEvent from '@testing-library/user-event';

jest.mock('react-router-dom', () => mockLocationFunction());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<InitiativeUsers />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  const setup = () => {
    const utils = render(
      <Provider store={store}>
        <InitiativeUsers />
      </Provider>
    );
    const breadcrumbs = utils.getByTestId('breadcrumbs-test') as HTMLDivElement;
    const searchUser = utils.getByTestId('searchUser-test') as HTMLInputElement;
    return {
      breadcrumbs,
      searchUser,
      ...utils,
    };
  };

  const { breadcrumbs, searchUser } = setup();

  it('Test breadcrumbs', async () => {
    expect(breadcrumbs).not.toBeNull();
    expect(breadcrumbs).not.toBeInTheDocument();
  });

  it('Test TextField searchUser', () => {
    expect(searchUser).not.toBeNull();
    expect(searchUser).not.toBeInTheDocument();

    // userEvent.type(searchUser, '');
    // expect(searchUser.value).toBe('');

    // userEvent.type(searchUser, 'searchUser');
    // expect(searchUser.value).toBe('searchUser');
  });
});
