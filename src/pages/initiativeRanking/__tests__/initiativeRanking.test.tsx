import React from 'react';
import { mockLocationFunction } from '../../initiativeOverview/__tests__/initiativeOverview.test';
import InitiativeRanking from '../initiativeRanking';
import { renderWithProviders } from '../../../utils/test-utils';
import { fireEvent, screen } from '@testing-library/react';

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
