import { GroupUpdateDTO } from '../api/generated/groups/GroupUpdateDTO';
import { StatusGroupDTO } from '../api/generated/groups/StatusGroupDTO';
import { groupsApi } from '../api/groupsApiClient';

export const getGroupOfBeneficiaryStatusAndDetail = (id: string): Promise<StatusGroupDTO> => groupsApi.getGroupOfBeneficiaryStatusAndDetails(id).then((res) => res);

export const uploadGroupOfBeneficiaryPut = (id: string, file: File): Promise<GroupUpdateDTO> => groupsApi.uploadGroupOfBeneficiary(id, file).then((res) => res);
