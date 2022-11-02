import { EmailMessageDTO } from '../../api/generated/email-notification/EmailMessageDTO';
import { UserInstitutionInfoDTO } from '../../api/generated/email-notification/UserInstitutionInfoDTO';

export const mockedBody: EmailMessageDTO = {
  subject: '',
  content: '',
  senderEmail: '',
  recipientEmail: '',
};

export const mockedInstitutionInfo: UserInstitutionInfoDTO = {
  email: 'test@test.it',
};

export const getInstitutionProductUserInfo = () =>
  new Promise<UserInstitutionInfoDTO>((resolve) => resolve(mockedInstitutionInfo));
export const sendEmail = (_data: EmailMessageDTO) => new Promise<void>((resolve) => resolve());
