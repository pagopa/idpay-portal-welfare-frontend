import { GroupUpdateDTO } from '../api/generated/groups/GroupUpdateDTO';
import { StatusGroupDTO } from '../api/generated/groups/StatusGroupDTO';
import { groupsApi } from '../api/groupsApiClient';
import { groupsApiMocked } from '../api/__mocks__/groupsApiClient';
import { mockedFile } from './__mocks__/groupService';
import { mockedInitiativeId } from './__mocks__/initiativeService';

export const getGroupOfBeneficiaryStatusAndDetail = (id: string): Promise<StatusGroupDTO> => {
  if (process.env.REACT_APP_API_MOCK_GROUPS === 'true') {
    return groupsApiMocked.getGroupOfBeneficiaryStatusAndDetails(mockedInitiativeId);
  }
  return groupsApi.getGroupOfBeneficiaryStatusAndDetails(id).then((res) => res);
};

export const uploadGroupOfBeneficiaryPut = (id: string, file: File): Promise<GroupUpdateDTO> => {
  if (process.env.REACT_APP_API_MOCK_GROUPS === 'true') {
    return groupsApiMocked.uploadGroupOfBeneficiary(mockedInitiativeId, mockedFile);
  }
  return groupsApi.uploadGroupOfBeneficiary(id, file).then((res) => res);
};
