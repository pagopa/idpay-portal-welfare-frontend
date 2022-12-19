import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import Wizard from '../Wizard';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<Wizard />', () => {
  const handleOpenExitModal = jest.fn();

  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  test('should display the Wizard component with his functions', async () => {
    renderWithProviders(<Wizard handleOpenExitModal={handleOpenExitModal} />);

    const backBtn = screen.getByTestId('back-action-test') as HTMLButtonElement;
    fireEvent.click(backBtn);

    const draftBtn = screen.getByTestId('skip-action-test') as HTMLButtonElement;
    fireEvent.click(draftBtn);

    const nextBtn = screen.getByTestId('continue-action-test') as HTMLButtonElement;
    fireEvent.click(nextBtn);
  });
});
