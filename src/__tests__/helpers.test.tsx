import {
  formatedCurrency,
  formatedDate,
  formatFileName,
  formatIban,
  formatStringToDate,
  getMaskedPan,
  numberWithCommas,
  peopleReached,
  renderInitiativeStatus
} from '../helpers';

describe('switch initiative status', () => {
  const arrOptions = [
    'DRAFT',
    'IN_REVISION',
    'TO_CHECK',
    'APPROVED',
    'PUBLISHED',
    'CLOSED',
    'SUSPENDED',
  ];

  const date = new Date('2022-10-01T00:00:00.000Z');

  test('switch case test renderInitiativeStatus', () => {
    expect(renderInitiativeStatus('')).toBeNull();
    arrOptions.forEach((option) => {
      expect(renderInitiativeStatus(option)).not.toBeNull();
    });
  });

  test('test numberWithCommas with undefined ', () => {
    expect(numberWithCommas(undefined)).toEqual('0');
  });

  test('test numberWithCommas with number type ', () => {
    expect(numberWithCommas(2)).toEqual('2');
  });

  test('test numberWithCommas string type ', () => {
    expect(numberWithCommas('2')).toEqual('2');
  });

  test('test numberWithCommas string type ', () => {
    expect(peopleReached('20', '2')).toBeDefined();
  });

  test('test formatFileName with more than 15 length of string param', () => {
    expect(formatFileName('fakeFileName1234.csv')).toEqual('fakeFileNa... .csv');
  });

  test('test formatFileName with less than 15 length of string param', () => {
    expect(formatFileName('fakeFile.csv')).toEqual('fakeFile.csv');
  });

  test('test formatFileName with the wrong param type', () => {
    // @ts-expect-error
    expect(formatFileName(123)).toEqual('');
  });

  test('test formatFileName with not a string of IBan as param', () => {
    expect(formatIban('IT03M0300203280794663157929')).toEqual('IT 03 M 03002 03280 794663157929');
  });

  test('test formatFileName with undefined as param', () => {
    expect(formatIban(undefined)).toEqual('');
  });
 
  test('test formatedCurrency with undefined as param', () => {
    expect(formatedCurrency(undefined)).toEqual('-');
  });

  test('test formatedDate with Date object as param', () => {
    expect(formatedDate(date)).toEqual('01/10/2022');
  });

  test('test formatedDate with undefined as param', () => {
    expect(formatedDate(undefined)).toEqual('-');
  });

  test('test formatStringToDate with Date object as param', () => {
    expect(formatStringToDate('2023-02-05T10:22:28.012Z')).toEqual('05/02/2023, 11:22');
  });

  test('test formatStringToDate with undefined as param', () => {
    expect(formatStringToDate(undefined)).toEqual('');
  });

  test('test getMaskedPan with string of numbers pan as param', () => {
    expect(getMaskedPan('5555666677778888')).toEqual('**** 5555666677778888');
  });

  test('test getMaskedPan with string of characters pan as param', () => {
    expect(getMaskedPan('aaabbbccc')).toEqual('aaabbbccc');
  });

  test('test getMaskedPan with undefined pan as param', () => {
    expect(getMaskedPan(undefined)).toEqual('****');
  });
});
