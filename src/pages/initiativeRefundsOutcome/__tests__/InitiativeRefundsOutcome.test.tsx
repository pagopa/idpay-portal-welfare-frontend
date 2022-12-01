import React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import { mockLocationFunction } from '../../initiativeOverview/__tests__/initiativeOverview.test';
import InitiativeRefundsOutcome from '../initiativeRefundsOutcome';

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

describe('<InitiativeRefundsOutcome />', () => {
  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  it('Test InitiativeRefundsOutcome to be Rendered with state', async () => {
    renderWithProviders(<InitiativeRefundsOutcome />);
  });
});
