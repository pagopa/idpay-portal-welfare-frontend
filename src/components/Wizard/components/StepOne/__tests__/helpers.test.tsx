import { TypeEnum } from '../../../../../api/generated/initiative/ChannelDTO';
import { ServiceScopeEnum } from '../../../../../api/generated/initiative/InitiativeAdditionalDTO';
import { mockedServiceInfoData } from '../../../../../services/__mocks__/initiativeService';
import { parseDataToSend } from '../helpers';
const mockedDataToSendChannelsUndefined = {
  channels: [
    {
      contact: undefined,
      type: undefined,
      description: undefined,
      privacyLink: undefined,
      tcLink: undefined,
    },
  ],
  assistanceChannels: [{ type: 'web', contact: 'string' }],
};
const mockedDataToSendAssistanceEmpty = {
  channels: [
    {
      contact: undefined,
      type: undefined,
      description: undefined,
      privacyLink: undefined,
      tcLink: undefined,
    },
  ],
  assistanceChannels: [
    { type: '', contact: '' },
    { type: '', contact: '' },
  ],
};

const mockedServiceInfoDataUndefined = {
  initiativeOnIO: undefined,
  serviceName: 'newStepOneTest',
  serviceScope: ServiceScopeEnum.NATIONAL,
  serviceDescription: undefined,
  privacyPolicyUrl: undefined,
  termsAndConditions: undefined,
  channels: [{ type: TypeEnum.web, contact: 'http://test.it' }],
  assistanceChannels: [
    { type: '', contact: '' },
    { type: '', contact: '' },
  ],
};
describe('helpers of step one', () => {
  test('parseDataToSend with channels data undefined', () =>
    expect(parseDataToSend(mockedDataToSendChannelsUndefined)).not.toBeNull());
  test('parseDataToSend with assistanceChannels empty', () =>
    expect(parseDataToSend(mockedDataToSendAssistanceEmpty)).not.toBeNull());
  test('parseDataToSend complete', () =>
    expect(parseDataToSend(mockedServiceInfoData)).not.toBeNull());
  test('parseDataToSend with some fields undefined', () =>
    expect(parseDataToSend(mockedServiceInfoDataUndefined)).not.toBeNull());
});
