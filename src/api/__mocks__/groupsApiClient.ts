import { mockedInitiativeId } from '../../services/__mocks__/groupService';
import { StatusGroupDTO } from '../generated/groups/StatusGroupDTO';

export const groupsApi = {
  getGroupOfBeneficiaryStatusAndDetails: async (_id: string): Promise<StatusGroupDTO> =>
    new Promise((resolve) => resolve(mockedInitiativeId)),
};
