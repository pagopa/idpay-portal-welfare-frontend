import { groupsApiMocked } from '../../api/__mocks__/groupsApiClient';

export const mockedInitiativeId = '62e29002aac2e94cfa3763dd';

export const mockedFile = new File([''], 'filename', { type: 'text/html' });

export const getGroupOfBeneficiaryStatusAndDetails = (_id: string) =>
  groupsApiMocked.getGroupOfBeneficiaryStatusAndDetails(mockedInitiativeId);

export const uploadGroupOfBeneficiary = (_id: string, _file: File) =>
  groupsApiMocked.uploadGroupOfBeneficiary(mockedInitiativeId, mockedFile);
