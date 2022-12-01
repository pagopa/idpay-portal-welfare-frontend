import React from 'react';
import { mockLocationFunction } from '../../initiativeOverview/__tests__/initiativeOverview.test';
import PublishInitiativeRankingModal from '../PublishInitiativeRankingModal';
import { renderWithProviders } from '../../../utils/test-utils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<PublishInitiativeRankingModal />', () => {
  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  it('Test PublishInitiativeRankingModal to be Rendered with state', async () => {
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
        publishInitiativeRanking={undefined}
        downloadInitiativeRanking={undefined}
      />
    );
  });
});
