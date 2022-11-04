import { parseDataToSend } from '../helpers';
const mockedDataToSend = {
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
describe('helpers of step one', () => {
  test('parseDataToSend', () => expect(parseDataToSend(mockedDataToSend)).not.toBeNull());
});
