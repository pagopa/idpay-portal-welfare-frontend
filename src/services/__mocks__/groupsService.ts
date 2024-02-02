import { groupsApiMocked } from '../../api/__mocks__/groupsApiClient';

export const mockedInitiativeId = '62e29002aac2e94cfa3763dd';

export const mockedFile = new File([''], 'filename', { type: 'text/html' });

export const mockedBeneficiaryStatusAndDetails = {
  beneficiariesReached: 0,
  errorMessage: 'errorMessage',
  fileName: 'fileName',
  fileUploadingDateTime: new Date('2018-10-13T00:00:00.000Z'),
  status: 'APPROVED',
};

export const mockedUploadGroupOfBeneficiary = {
  elabTimeStamp: new Date('2018-10-13T00:00:00.000Z'),
  errorKey: 'errorKey',
  errorRow: 0,
  status: 'APPROVED',
};

export const getGroupOfBeneficiaryStatusAndDetail = (_id: string) =>
  groupsApiMocked.getGroupOfBeneficiaryStatusAndDetails(mockedInitiativeId);

export const uploadGroupOfBeneficiaryPut = (_id: string, _file: File) =>
  groupsApiMocked.uploadGroupOfBeneficiary(mockedInitiativeId, mockedFile);
