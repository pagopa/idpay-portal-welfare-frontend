import { setError, setErrorText, mapDataToSend } from '../helpers';
const mockedInputToRecive = (accumulatedAmount: string) => {
  return {
    reimbursmentQuestionGroup: 'true',
    timeParameter: 'string',
    accumulatedAmount: accumulatedAmount,
    additionalInfo: 'string',
    reimbursementThreshold: 'string',
  };
};
const accumulatedAmountOptions: string[] = ['THRESHOLD_REACHED', 'BUDGET_EXHAUSTED', ''];
describe('test helpers step five', () => {
  test('setError setp five', () => {
    expect(setError(false, '')).toBeFalsy();
    expect(setError(true, 'string')).toBeTruthy();
  });
  test('setErrorText step five', () => {
    expect(setErrorText(true, 'string')).toBe('string');
  });
  test('mapDataToSend step five', () => {
    accumulatedAmountOptions.forEach((item) => {
      expect(mapDataToSend(mockedInputToRecive(item))).not.toBeNull();
    });
  });
});
