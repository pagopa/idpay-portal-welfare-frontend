import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import React from 'react';
import SideMenu from '../SideMenu';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    listen: jest.fn(),
    location: 'localhost:3000/portale-enti',
    replace: jest.fn(),
  }),
}));

describe('<SideMenu />', () => {
  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  test('testing rendering of SideMenu component', async () => {
    renderWithProviders(<SideMenu />);
    // screen.debug();
    const listBtn = screen.getByText(/sideMenu.initiativeList.title/) as HTMLElement;
    fireEvent.click(listBtn);
  });
});
