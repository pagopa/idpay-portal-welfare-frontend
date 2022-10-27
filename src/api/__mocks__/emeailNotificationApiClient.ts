import { mockedEmail } from '../../services/__mocks__/emailNotificationService';
import { EmailMessageDTO } from '../generated/email-notification/EmailMessageDTO';
import { UserInstitutionInfoDTO } from '../generated/email-notification/UserInstitutionInfoDTO';

export const EmailNotificationApi = {
  getInstitutionProductUserInfo: async (): Promise<UserInstitutionInfoDTO> =>
    new Promise((resolve) => resolve(mockedEmail)),

  sendEmail: async (_data: EmailMessageDTO): Promise<void> => {
    void new Promise<void>((resolve) => resolve());
  },
};
