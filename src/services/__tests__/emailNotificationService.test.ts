import { mockedBody } from '../__mocks__/emailNotificationService';
// import { getInstitutionProductUserInfo, sendEmail } from '../__mocks__/emailNotificationService';
import { getInstitutionProductUserInfo, sendEmail } from '../emailNotificationService';
// import { EmailNotificationApiMocked } from '../../api/__mocks__/emeailNotificationApiClient';
import { EmailNotificationApi } from '../../api/emailNotificationApiClient';

jest.mock('../../api/emailNotificationApiClient.ts');

beforeEach(() => {
  jest.spyOn(EmailNotificationApi, 'getInstitutionProductUserInfo');
  jest.spyOn(EmailNotificationApi, 'sendEmail');
});

test('test get Institution Product User Info', async () => {
  await getInstitutionProductUserInfo();
  expect(EmailNotificationApi.getInstitutionProductUserInfo).not.toHaveBeenCalled();
});

test('test send email', async () => {
  await sendEmail(mockedBody);
  expect(EmailNotificationApi.sendEmail).not.toHaveBeenCalledWith(mockedBody);
});
