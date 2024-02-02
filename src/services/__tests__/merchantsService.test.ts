import {
    getMerchantDetail,
    getMerchantInitiativeStatistics,
} from '../merchantsService';
import {
    mockedInitiativeId,
    mockedMerchantId,
    mockedMerchantDetail,
    mockedMerchantStatistics
} from '../../services/__mocks__/merchantsService';
import {merchantsApiMocked} from '../../api/__mocks__/merchantsApiClient'

jest.mock('../merchantsService');

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