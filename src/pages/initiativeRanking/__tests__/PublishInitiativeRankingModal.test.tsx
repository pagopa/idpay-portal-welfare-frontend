import React from 'react';
import PublishInitiativeRankingModal from '../PublishInitiativeRankingModal';
import { renderWithProviders } from '../../../utils/test-utils';
import { waitFor, screen, fireEvent } from '@testing-library/react';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<PublishInitiativeRankingModal />', () => {
  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  it('Test PublishInitiativeRankingModal to be Rendered with state', async () => {
    const downloadInitiativeRanking = jest.fn();
    const publishInitiativeRanking = jest.fn();

    renderWithProviders(
      <PublishInitiativeRankingModal
        openPublishInitiativeRankingModal={true}
        handleClosePublishInitiativeRankingModal={function (
          _event: React.MouseEvent<Element, MouseEvent>
        ): void {
          //
        }}
        initiativeId={undefined}
        fileName={undefined}
        publishInitiativeRanking={publishInitiativeRanking}
        downloadInitiativeRanking={downloadInitiativeRanking}
      />
    );

    const modal = document.querySelector(
      '[data-testid="publish-initiative-ranking-modal-test"]'
    ) as HTMLDivElement;
    const fade = document.querySelector('[data-testid="fade-test"]') as HTMLDivElement;

    expect(modal).toBeInTheDocument();
    expect(fade).toBeInTheDocument();

    const alert = screen.getByTestId('alert-btn-test') as HTMLButtonElement;
    fireEvent.click(alert);

    const cancelBtn = screen.getByTestId('cancel-button-test') as HTMLButtonElement;
    fireEvent.click(cancelBtn);

    const exitBtn = screen.getByTestId('exit-button-test') as HTMLButtonElement;
    fireEvent.click(exitBtn);
  });
});
