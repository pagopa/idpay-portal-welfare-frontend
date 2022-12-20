import React from 'react';
import { mockLocationFunction } from '../../initiativeOverview/__tests__/initiativeOverview.test';
import InitiativeRanking from '../initiativeRanking';
import { renderWithProviders } from '../../../utils/test-utils';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import ROUTES from '../../../routes';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

jest.mock('react-router-dom', () => mockLocationFunction());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

beforeEach(() => {
  //@ts-expect-error
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    ancestorOrigins: ['string'] as unknown as DOMStringList,
    hash: 'hash',
    host: 'localhost',
    port: '3000',
    protocol: 'http:',
    hostname: 'localhost:3000/portale-enti',
    href: 'http://localhost:3000/portale-enti/graduatoria-iniziativa/2333333',
    origin: 'http://localhost:3000/portale-enti',
    pathname: ROUTES.INITIATIVE_RANKING,
    search: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
});

afterEach(cleanup);

describe('<InitiativeRefunds />', () => {
  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  it('Test InitiativeRanking to be Rendered with state', async () => {
    renderWithProviders(<InitiativeRanking />);
    // screen.debug();

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);
  });
});
