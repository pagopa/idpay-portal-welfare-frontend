import { NotificationManagerApi } from "../../api/NotificationManagerApiClient";
import { InitiativeRequest } from "../../pages/Initiative/Initiative";
import { CreateMessageDto } from '../../api/generated/notification-manager/CreateMessageDto';

export const saveInitiative = async (value: InitiativeRequest): Promise<void> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_ASSISTANCE === 'true') {
    return new Promise<void>((resolve) => resolve());
  } else {
      return NotificationManagerApi.save(initiativeRequest2CreateMessageDto(value));
  }
};

export const initiativeRequest2CreateMessageDto = (e: InitiativeRequest):CreateMessageDto => ({
  content:e.name,
  subject:e.name,
  senderEmail:e.name
});