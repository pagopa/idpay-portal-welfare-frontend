import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import React from 'react';
import SideMenu from '../SideMenu';
import { act } from 'react-dom/test-utils';
import { SvgIcon } from '@mui/material';
import SidenavItem from '../SidenavItem';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    listen: jest.fn(),
    location: 'localhost:3000/portale-enti',
  }),
}));

describe('<SideMenu />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const handleClick = jest.fn();

  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  test('testing rendering of SideMenu component', async () => {
    render(
      <Provider store={store}>
        <SideMenu />
      </Provider>
    );
  });
});
