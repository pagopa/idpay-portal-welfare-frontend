import { merchantsApiMocked } from '../../api/__mocks__/merchantsApiClient';
import { merchantsApi } from '../../api/merchantsApiClient';
import { createStore } from '../../redux/store';
import {
    mockedInitiativeId,
    mockedMerchantDetail,
    mockedMerchantId,
    mockedMerchantStatistics
} from '../../services/__mocks__/merchantsService';
import {
    getMerchantDetail,
    getMerchantInitiativeStatistics,
} from '../merchantsService';

jest.mock('../merchantsService');

beforeEach(() => {
  jest.spyOn(merchantsApi, 'getMerchantDetail');
  jest.spyOn(merchantsApi, 'getMerchantInitiativeStatistics');
});

describe('merchant Service', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  test('test getMerchantDetail', async () => {
    await getMerchantDetail(mockedInitiativeId,mockedMerchantId);
    expect(merchantsApi.getMerchantDetail).not.toBeCalledWith(mockedInitiativeId,mockedMerchantId);
  });

  test('test getMerchantInitiativeStatistics', async () => {
    await getMerchantInitiativeStatistics(mockedInitiativeId,mockedMerchantId);
    expect(merchantsApi.getMerchantInitiativeStatistics).not.toBeCalledWith(mockedInitiativeId, mockedMerchantId);
  });

});


describe('getMerchantDetail', () => {
    it('should call merchantsApiMocked.getMerchantDetail with correct parameters', async () => {
      const spyGetMerchantDetail = jest.spyOn(merchantsApiMocked, 'getMerchantDetail');
      spyGetMerchantDetail.mockResolvedValue(mockedMerchantDetail);
   
      await getMerchantDetail(mockedInitiativeId, mockedMerchantId);
   
      expect(spyGetMerchantDetail).toHaveBeenCalledWith(
        mockedInitiativeId,
        mockedMerchantId
      );
   
      spyGetMerchantDetail.mockRestore();
    });
   
    it('should return the correct result from merchantsApiMocked.getMerchantDetail', async () => {
      
      jest.spyOn(merchantsApiMocked, 'getMerchantDetail').mockResolvedValue(mockedMerchantDetail);
   
      const result = await getMerchantDetail(mockedInitiativeId, mockedMerchantId);
   
      expect(result).toEqual(mockedMerchantDetail);
    });
});
   
describe('getMerchantInitiativeStatistics', () => {
it('should call merchantsApiMocked.getMerchantInitiativeStatistics with correct parameters', async () => {
    const spyGetMerchantInitiativeStatistics = jest.spyOn(merchantsApiMocked, 'getMerchantInitiativeStatistics');
    spyGetMerchantInitiativeStatistics.mockResolvedValue(mockedMerchantStatistics);

    await getMerchantInitiativeStatistics(mockedInitiativeId, mockedMerchantId);

    expect(spyGetMerchantInitiativeStatistics).toHaveBeenCalledWith(
    mockedInitiativeId,
    mockedMerchantId
    );

    spyGetMerchantInitiativeStatistics.mockRestore();
});

it('should return the correct result from merchantsApiMocked.getMerchantInitiativeStatistics', async () => {

    jest.spyOn(merchantsApiMocked, 'getMerchantInitiativeStatistics').mockResolvedValue(mockedMerchantStatistics);

    const result = await getMerchantInitiativeStatistics(
    mockedInitiativeId,
    mockedMerchantId
    );

    expect(result).toEqual(mockedMerchantStatistics);
});
});