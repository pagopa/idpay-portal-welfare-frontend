import { groupsApi } from '../../api/groupsApiClient';
import { mockedFile, mockedInitiativeId } from '../__mocks__/groupService';
import {
  getGroupOfBeneficiaryStatusAndDetail,
  uploadGroupOfBeneficiaryPut,
} from '../groupsService';
import { createStore } from '../../redux/store';
// import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
// import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
// import { groupsApiMocked } from '../../api/__mocks__/groupsApiClient';

// jest.mock('../../api/groupsApiClient.ts');

beforeEach(() => {
  jest.spyOn(groupsApi, 'getGroupOfBeneficiaryStatusAndDetails');
  jest.spyOn(groupsApi, 'uploadGroupOfBeneficiary');
});

describe('Group Service', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  test('test get group of beneficiary status and detail', async () => {
    await getGroupOfBeneficiaryStatusAndDetail(mockedInitiativeId);
    expect(groupsApi.getGroupOfBeneficiaryStatusAndDetails).not.toBeCalledWith(mockedInitiativeId);
  });

  test('test upload group of beneficiary', async () => {
    await uploadGroupOfBeneficiaryPut(mockedInitiativeId, mockedFile);
    expect(groupsApi.uploadGroupOfBeneficiary).not.toBeCalledWith(mockedInitiativeId, mockedFile);
  });

  // test('Test toast error', () => {
  //   const actions = store.dispatch(
  //     appStateActions.addError({
  //       id: '',
  //       error: new Error(),
  //       techDescription: 'token expired or not valid',
  //       toNotify: false,
  //       blocking: false,
  //       displayableTitle: i18n.t('session.expired.title'),
  //       displayableDescription: i18n.t('session.expired.message'),
  //     })
  //   );
  //   const expectedPayload = actions;
  //   expect(actions).toEqual(expectedPayload);
  // });
});
