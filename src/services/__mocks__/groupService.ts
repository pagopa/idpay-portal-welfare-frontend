export const mockedInitiativeId = '62e29002aac2e94cfa3763dd';

export const mockedFile = new File([''], 'filename', { type: 'text/html' });

export const getGroupOfBeneficiaryStatusAndDetails = (_id: string) =>
  new Promise((resolve) => resolve(mockedInitiativeId));

export const uploadGroupOfBeneficiary = (_id: string, _file: File) =>
  new Promise((resolve) => resolve(mockedInitiativeId));
