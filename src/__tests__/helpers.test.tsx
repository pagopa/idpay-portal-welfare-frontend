import {
  cleanDate,
  copyTextToClipboard,
  downloadURI,
  fileFromReader,
  formatedCurrency,
  formatedDate,
  formatedTimeLineCurrency,
  formatFileName,
  formatIban,
  formatStringToDate,
  getMaskedPan,
  getTimeLineMaskedPan,
  mappedChannel,
  numberWithCommas,
  peopleReached,
  renderInitiativeStatus,
  getRefundStatusChip,
  formatAddress,
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

  test('test peopleReached ', () => {
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

  test('test formatedCurrency with a number as param and cents param as true', () => {
    expect(formatedCurrency(10, '-', true)).toContain('10');
  });

  test('test formatedCurrency with a number as param', () => {
    expect(formatedCurrency(10)).toContain('10');
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

  test('test downloadURI ', () => {
    expect(downloadURI('testdomain.com', 'testfilename.csv'));
  });

  test('test mappedChannel with APP_IO input', () => {
    expect(mappedChannel('APP_IO'));
  });
  test('test mappedChannel with ISSUER input', () => {
    expect(mappedChannel('ISSUER'));
  });
  test('test mappedChannel with unexpected input', () => {
    expect(mappedChannel('test')).toEqual('-');
  });

  test('test getTimeLineMaskedPan with undefined value', () => {
    expect(getTimeLineMaskedPan('1234', undefined)).toEqual('****');
  });
  test('test getTimeLineMaskedPan with string numeric value', () => {
    expect(getTimeLineMaskedPan('1234', '5678')).toEqual('**** 5678');
  });

  test('test getTimeLineMaskedPan with string char value', () => {
    expect(getTimeLineMaskedPan('1234', 'abcd')).toEqual('abcd');
  });

  test('test formatedTimeLineCurrency with undefined value', () => {
    expect(formatedTimeLineCurrency('1234', undefined)).toEqual('');
  });

  test('test formatedTimeLineCurrency with number value', () => {
    expect(formatedTimeLineCurrency('1234', 12)).toContain('12');
  });

  test('test cleanDate with start mod', () => {
    expect(cleanDate(new Date('2023-01-01'), 'start')).toEqual('2023-01-01T00:00:00Z');
  });

  test('test getRefundStatusChip with status EXPORTED', () => {
    expect(getRefundStatusChip({ status: 'EXPORTED', percentageResulted: undefined }));
  });

  test('test getRefundStatusChip with status PARTIAL', () => {
    expect(getRefundStatusChip({ status: 'PARTIAL', percentageResulted: '10' }));
  });

  test('test getRefundStatusChip with status PARTIAL and percentageResulted undefined', () => {
    expect(getRefundStatusChip({ status: 'PARTIAL', percentageResulted: undefined }));
  });

  test('test getRefundStatusChip with status COMPLETE', () => {
    expect(getRefundStatusChip({ status: 'COMPLETE', percentageResulted: undefined }));
  });

  test('test getRefundStatusChip with unexpected status ', () => {
    expect(getRefundStatusChip({ status: 'TEST', percentageResulted: undefined }));
  });

  test('test formatAddress with strings params', () => {
    expect(formatAddress('via test 1', 'milano', 'mi', '20100')).toEqual(
      'via test 1, milano, mi, 20100'
    );
  });
});
