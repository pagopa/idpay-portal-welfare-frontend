import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { setInitiativeSummaryList } from '../../../redux/slices/initiativeSummarySlice';
import { store } from '../../../redux/store';
import ROUTES from '../../../routes';
import { renderWithProviders } from '../../../utils/test-utils';
import SideMenu from '../SideMenu';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

const oldWindowLocation = global.window.location;

const mockedLocation = {
  assign: jest.fn(),
  pathname: ROUTES.HOME,
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

describe('<SideMenu />', () => {
  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  const mockedSummary = [
    {
      creationDate: new Date('2022-12-16T11:24:23.96'),
      initiativeId: '639c4757f9904d5a4e5a3c2e',
      initiativeName: 'Test Graduatoria 16/12',
      rankingEnabled: true,
      status: 'PUBLISHED',
      updateDate: new Date('2022-12-16T11:46:26.335'),
    },
    {
      creationDate: new Date('2022-12-16T15:46:05.37'),
      initiativeId: '639c84ad9a8280046cc04a7c',
      initiativeName: 'Skin care',
      rankingEnabled: false,
      status: 'PUBLISHED',
      updateDate: new Date('2022-12-16T15:52:27.644'),
    },
    {
      creationDate: new Date('2022-12-16T16:20:18.877'),
      initiativeId: '639c8cb29a8280046cc04a7d',
      initiativeName: 'Prova123',
      rankingEnabled: false,
      status: 'PUBLISHED',
      updateDate: new Date('2022-12-19T18:07:34.364'),
    },
    {
      creationDate: new Date('2022-12-19T11:19:41.23'),
      initiativeId: '63a03abd70d330297c486a44',
      initiativeName: 'Soap',
      rankingEnabled: true,
      status: 'IN_REVISION',
      updateDate: new Date('2022-12-19T16:19:39.483'),
    },
    {
      creationDate: new Date('2022-12-19T11:19:45.113'),
      initiativeId: '63a03ac170d330297c486a45',
      initiativeName: 'Keyboard',
      rankingEnabled: false,
      status: 'DRAFT',
      updateDate: new Date('2022-12-23T17:12:15.819'),
    },
    {
      creationDate: new Date('2022-12-19T11:22:45.797'),
      initiativeId: '63a03b7570d330297c486a46',
      initiativeName: 'Mouse',
      rankingEnabled: true,
      status: 'DRAFT',
      updateDate: new Date('2022-12-20T10:41:37.537'),
    },
  ];

  test('testing rendering of SideMenu component', async () => {
    renderWithProviders(<SideMenu />);
    // screen.debug();
    const listBtn = screen.getByText(/sideMenu.initiativeList.title/) as HTMLElement;
    fireEvent.click(listBtn);
  });

  test('testing setExpanded', async () => {
    store.dispatch(setInitiativeSummaryList(mockedSummary));
    renderWithProviders(<SideMenu />);
    const accordion = screen.getAllByTestId('accordion-click-test');
    fireEvent.click(accordion[0]);

    const initiative = screen.getAllByText('sideMenu.initiativeOverview.title');
    fireEvent.click(initiative[0]);

    const ranking = screen.getAllByText('sideMenu.initiativeRanking.title');
    fireEvent.click(ranking[0]);

    const user = screen.getAllByText('sideMenu.initiativeUsers.title');
    fireEvent.click(user[0]);

    const refunds = screen.getAllByText('sideMenu.initiativeRefunds.title');
    fireEvent.click(refunds[0]);
  });
});
