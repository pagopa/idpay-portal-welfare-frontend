import React from 'react';
import PublishInitiativeRankingModal from '../PublishInitiativeRankingModal';
import { screen, fireEvent, render } from '@testing-library/react';
import { mockedInitiativeId } from '../../../services/__mocks__/groupService';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<PublishInitiativeRankingModal />', () => {
  window.scrollTo = jest.fn();

  it('Test PublishInitiativeRankingModal download button', async () => {
    render(
      <Provider store={store}>
        <PublishInitiativeRankingModal
          openPublishInitiativeRankingModal={true}
          handleClosePublishInitiativeRankingModal={jest.fn()}
          initiativeId={mockedInitiativeId}
          fileName={'fileName'}
          publishInitiativeRanking={jest.fn()}
          downloadInitiativeRanking={jest.fn()}
        />
      </Provider>
    );

    const downloadBtn = screen.getByTestId('download-btn-test') as HTMLButtonElement;
    fireEvent.click(downloadBtn);
  });

  it('Test PublishInitiativeRankingModal publish button', async () => {
    render(
      <Provider store={store}>
        <PublishInitiativeRankingModal
          openPublishInitiativeRankingModal={true}
          handleClosePublishInitiativeRankingModal={jest.fn()}
          initiativeId={mockedInitiativeId}
          fileName={'fileName'}
          publishInitiativeRanking={jest.fn()}
          downloadInitiativeRanking={jest.fn()}
        />
      </Provider>
    );

    const publishBtn = screen.getByTestId('publish-button-test') as HTMLButtonElement;
    fireEvent.click(publishBtn);
  });
});
