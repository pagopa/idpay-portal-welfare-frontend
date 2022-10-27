import { EmailMessageDTO } from '../../api/generated/email-notification/EmailMessageDTO';
import { UserInstitutionInfoDTO } from '../../api/generated/email-notification/UserInstitutionInfoDTO';

export const mockedBody: EmailMessageDTO = {
  subject: '',
  content: '',
  senderEmail: '',
  recipientEmail: '',
};

export const mockedEmail: UserInstitutionInfoDTO = {
  email: '',
};

export const getInstitutionProductUserInfo = () => new Promise((resolve) => resolve);

export const sendEmail = (_data: EmailMessageDTO) => new Promise((resolve) => resolve(mockedBody));
