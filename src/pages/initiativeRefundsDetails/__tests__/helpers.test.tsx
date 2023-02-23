import { getRefundStatus } from '../helpers';

describe('test suite for refund details helpers', () => {
  test('test call getRefundStatus with deiffrenet parameters', () => {
    const refundStatusOptionsArr = ['COMPLETED_OK', 'COMPLETED_KO', 'EXPORTED', ''];
    refundStatusOptionsArr.forEach((item) => {
      expect(getRefundStatus(item)).toBeDefined();
    });
  });
});
