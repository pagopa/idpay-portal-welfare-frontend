import { mockedInitiativeId } from '../../services/__mocks__/groupService';
import { GroupUpdateDTO } from '../generated/groups/GroupUpdateDTO';
import { StatusGroupDTO } from '../generated/groups/StatusGroupDTO';

export const groupsApi = {
  getGroupOfBeneficiaryStatusAndDetails: async (_id: string): Promise<StatusGroupDTO> =>
    new Promise((resolve) => resolve(mockedInitiativeId)),

  uploadGroupOfBeneficiary: async (_id: string, _file: File): Promise<GroupUpdateDTO> =>
    new Promise((resolve) => resolve(mockedInitiativeId)),
};
