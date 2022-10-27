import { EmailNotificationApi } from '../../api/emailNotificationApiClient';
import { mockedBody } from '../__mocks__/emailNotificationService';
import { getInstitutionProductUserInfo, sendEmail } from '../emailNotificationService';

jest.mock('../../api/emailNotificationApiClient');

beforeEach(() => {
  jest.spyOn(EmailNotificationApi, 'getInstitutionProductUserInfo');
  jest.spyOn(EmailNotificationApi, 'sendEmail');
});

test('test get Institution Product User Info', async () => {
  await getInstitutionProductUserInfo();
  expect(EmailNotificationApi.getInstitutionProductUserInfo).toBeCalled();
});

test('test send email', async () => {
  await sendEmail(mockedBody);
  expect(EmailNotificationApi.sendEmail).toBeCalled();
});
