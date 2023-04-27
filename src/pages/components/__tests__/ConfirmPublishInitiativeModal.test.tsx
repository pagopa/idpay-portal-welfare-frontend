import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { AccumulatedTypeEnum } from '../../../api/generated/initiative/AccumulatedAmountDTO';
import { ServiceScopeEnum } from '../../../api/generated/initiative/InitiativeAdditionalDTO';
import { createStore } from '../../../redux/store';
import ConfirmPublishInitiativeModal from '../ConfirmPublishInitiativeModal';
import { BeneficiaryTypeEnum } from '../../../api/generated/initiative/InitiativeGeneralDTO';
import { InitiativeRewardTypeEnum } from '../../../api/generated/initiative/InitiativeDTO';
import { RewardValueTypeEnum } from '../../../api/generated/initiative/InitiativeRewardRuleDTO';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

window.scrollTo = jest.fn();

describe('<ConfirmPublishInitiativeModal />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const handlePusblishInitiative = jest.fn();
  const setPublishModalOpen = jest.fn();
  const initiative = store.getState().initiative;

  const mockedInitiativeBeneficiaryKnown = {
    initiativeId: '62e29002aac2e94cfa3763dd',
    initiativeName: 'prova313',
    organizationId: '2f63a151-da4e-4e1e-acf9-adecc0c4d727',
    status: 'DRAFT',
    creationDate: new Date('2022-07-28T13:32:50.002'),
    updateDate: new Date('2022-08-09T08:35:36.516'),
    generalInfo: {
      beneficiaryType: BeneficiaryTypeEnum.PF,
      beneficiaryKnown: 'true',
      budget: '8515',
      beneficiaryBudget: '801',
      rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
      rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
      startDate: new Date('2022-10-01T00:00:00.000Z'),
      endDate: new Date('2023-01-31T00:00:00.000Z'),
      introductionTextIT: 'string',
      introductionTextEN: 'string',
      introductionTextFR: 'string',
      introductionTextDE: 'string',
      introductionTextSL: 'string',
      rankingEnabled: 'false',
    },
    additionalInfo: {
      initiativeOnIO: true,
      serviceName: 'prova313',
      serviceArea: ServiceScopeEnum.NATIONAL,
      serviceDescription: 'newStepOneTest',
      privacyPolicyUrl: 'http://test.it',
      termsAndConditions: 'http://test.it',
      assistanceChannels: [],
      logoFileName: 'logo file name',
      logoUploadDate: 'logo date',
      logoURL: 'logo url',
    },
    beneficiaryRule: {
      apiKeyClientId: 'string',
      apiKeyClientAssertion: 'string',
      selfDeclarationCriteria: [],
      automatedCriteria: [],
    },
    initiativeRewardType: InitiativeRewardTypeEnum.REFUND,
    rewardRule: {
      _type: 'rewardValue',
      rewardValue: 1,
      rewardValueType: RewardValueTypeEnum.PERCENTAGE,
    },
    trxRule: {
      mccFilter: { allowedList: true, values: ['string', ''] },
      rewardLimits: [{ frequency: 'string', rewardLimit: 2 }],
      threshold: undefined,
      trxCount: { from: 2, to: 3 },
      daysOfWeekIntervals: [],
    },
    refundRule: {
      reimbursementThreshold: AccumulatedTypeEnum.THRESHOLD_REACHED,
      reimbursmentQuestionGroup: 'true',
      additionalInfo: 'aaaaaa',
      timeParameter: '',
      accumulatedAmount: '',
    },
  };

  it('Modal to be in the document with initiativeWithoutGroupsSubtitle', async () => {
    render(
      <Provider store={store}>
        <ConfirmPublishInitiativeModal
          publishModalOpen={true}
          setPublishModalOpen={setPublishModalOpen}
          initiative={initiative}
          beneficiaryReached={25}
          handlePusblishInitiative={handlePusblishInitiative}
          userCanPublishInitiative={false}
        />
      </Provider>
    );

    const modal = document.querySelector('[data-testid="confirm-modal-publish"') as HTMLElement;
    expect(modal).toBeInTheDocument();

    const fade = document.querySelector('[data-testid="fade-test"]') as HTMLElement;
    expect(fade).toBeInTheDocument();

    const cancelBtn = screen.getByTestId('cancel-button-test') as HTMLButtonElement;
    fireEvent.click(cancelBtn);
    expect(setPublishModalOpen).toHaveBeenCalledTimes(1);

    const publishlBtn = screen.getByTestId('publish-button-test') as HTMLButtonElement;
    fireEvent.click(publishlBtn);

    fireEvent.keyDown(modal, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });

    const initiativeWithoutGroupsSubtitle = screen.getByText(
      'pages.initiativeOverview.next.modalPublish.initiativeWithoutGroupsSubtitle'
    );
    expect(initiativeWithoutGroupsSubtitle).toBeInTheDocument();
  });

  it('Modal to be in the document with initiativeWithGroupsSubtitle', async () => {
    render(
      <Provider store={store}>
        <ConfirmPublishInitiativeModal
          publishModalOpen={true}
          setPublishModalOpen={setPublishModalOpen}
          initiative={mockedInitiativeBeneficiaryKnown}
          beneficiaryReached={25}
          handlePusblishInitiative={handlePusblishInitiative}
          userCanPublishInitiative={false}
        />
      </Provider>
    );

    const initiativeWithGroupsSubtitle = screen.getByText(
      'pages.initiativeOverview.next.modalPublish.initiativeWithGroupsSubtitle'
    );
    expect(initiativeWithGroupsSubtitle).toBeInTheDocument();
  });
});
