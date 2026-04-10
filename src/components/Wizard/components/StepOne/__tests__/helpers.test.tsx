import { ChannelDtoTypeEnum as TypeEnum, InitiativeAdditionalDtoServiceScopeEnum as ServiceScopeEnum } from '../../../../../api/generated/initiative/apiClient';
import { mockedServiceInfoData } from '../../../../../services/__mocks__/intitativeService';
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
  channels: [{ type: TypeEnum.Web, contact: 'http://test.it' }],
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
