import { EmailNotificationApi } from '../api/emailNotificationApiClient';
import { EmailMessageDTO, UserInstitutionInfoDTO } from '../api/generated/email-notification/apiClient';

export const getInstitutionProductUserInfo = (): Promise<UserInstitutionInfoDTO> => EmailNotificationApi.getInstitutionProductUserInfo().then((res) => res);

export const sendEmail = (data: EmailMessageDTO): Promise<void> => EmailNotificationApi.sendEmail(data).then((res) => res);
