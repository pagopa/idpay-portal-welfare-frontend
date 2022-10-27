import { EmailNotificationApi } from '../../api/emailNotificationApiClient';
// import { mockedBody, mockedEmail } from '../__mocks__/emailNotificationService';
// import { getInstitutionProductUserInfo, sendEmail } from '../emailNotificationService';

jest.mock('../../api/emailNotificationApiClient');

beforeEach(() => {
  jest.spyOn(EmailNotificationApi, 'getInstitutionProductUserInfo');
  jest.spyOn(EmailNotificationApi, 'sendEmail');
});

describe('test email notification service', () => {
  //   test('test get group of beneficiary status and detail', async () => {
  //     await getInstitutionProductUserInfo();
  //     expect(EmailNotificationApi.getInstitutionProductUserInfo).toBeCalledWith(mockedEmail);
  //   });
  test('test get group of beneficiary status and detail', async () => {
    // await sendEmail(mockedBody);
    // expect(EmailNotificationApi.sendEmail).toBeCalledWith(mockedBody);
  });
});
