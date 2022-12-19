import { mockedInitiativeGeneralBody } from '../../../../../services/__mocks__/initiativeService';
import {
  getMinDate,
  parseDate,
  setError,
  setErrorText,
  getYesterday,
  parseValuesFormToInitiativeGeneralDTO,
} from '../helpers';
describe('helpers of step two ', () => {
  test('getMinDate', () => {
    expect(getMinDate('2/2/22')).toBeDefined();
    expect(getMinDate(new Date())).toBeDefined();
  });
  test('parseDate', () => {
    expect(parseDate('2/2/22')).toBeDefined();
  });
  test('setError setp five', () => {
    expect(setError(false, '')).toBeFalsy();
    expect(setError(true, 'string')).toBeTruthy();
  });
  test('setErrorText step five', () => {
    expect(setErrorText(true, 'string')).toBe('string');
  });
  test('setErrorText step five', () => {
    expect(getYesterday(false)).not.toBeNull();
  });
  test('test parseValuesFormToInitiativeGeneralDTO', () => {
    expect(parseValuesFormToInitiativeGeneralDTO(mockedInitiativeGeneralBody)).not.toBeNull();
  });
});
