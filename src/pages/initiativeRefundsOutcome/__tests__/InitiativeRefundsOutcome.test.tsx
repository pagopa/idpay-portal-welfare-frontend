import React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import { mockLocationFunction } from '../../initiativeOverview/__tests__/initiativeOverview.test';
import InitiativeRefundsOutcome from '../initiativeRefundsOutcome';
import { screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

jest.mock('@pagopa/selfcare-common-frontend', () => ({
  ...jest.requireActual('@pagopa/selfcare-common-frontend/hooks/useLoading'),
  useLoading: () => ({}),
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

  it('Test InitiativeRefundsOutcome', async () => {
    const { container } = renderWithProviders(<InitiativeRefundsOutcome />);

    const backBtn = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    window.URL.createObjectURL = jest.fn().mockImplementation(() => 'url');
    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'application/zip', {
      type: 'application/zip',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
    waitFor(() => expect(screen.getByText('application/zip')).toBeInTheDocument());
  });
});
