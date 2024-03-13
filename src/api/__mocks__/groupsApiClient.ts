import {
  mockedBeneficiaryStatusAndDetails,
  mockedUploadGroupOfBeneficiary,
} from '../../services/__mocks__/groupsService';
import { GroupUpdateDTO } from '../generated/groups/GroupUpdateDTO';
import { StatusGroupDTO } from '../generated/groups/StatusGroupDTO';

export const groupsApiMocked = {
  getGroupOfBeneficiaryStatusAndDetails: async (_id: string): Promise<StatusGroupDTO> =>
    new Promise((resolve) => resolve(mockedBeneficiaryStatusAndDetails)),

  uploadGroupOfBeneficiary: async (_id: string, _file: File): Promise<GroupUpdateDTO> =>
    new Promise((resolve) => resolve(mockedUploadGroupOfBeneficiary)),
};
