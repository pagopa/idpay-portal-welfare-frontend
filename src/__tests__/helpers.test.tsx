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
  initiativeUsersAndRefundsValidationSchema,
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

  test('test numberWithCommas with formatted string ', () => {
    expect(numberWithCommas('1.234,56')).toEqual('1.234,56');
  });

  test('test numberWithCommas with empty string ', () => {
    expect(numberWithCommas('')).toEqual('0');
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

  test('test formatedCurrency with zero and custom symbol', () => {
    expect(formatedCurrency(0, 'N/A')).toEqual('N/A');
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

  test('test getTimeLineMaskedPan with empty id', () => {
    expect(getTimeLineMaskedPan('', '1234')).toEqual('****');
  });

  test('test formatedTimeLineCurrency with undefined value', () => {
    expect(formatedTimeLineCurrency('1234', undefined)).toEqual('');
  });

  test('test formatedTimeLineCurrency with number value', () => {
    expect(formatedTimeLineCurrency('1234', 12)).toContain('12');
  });

  test('test formatedTimeLineCurrency with empty id', () => {
    expect(formatedTimeLineCurrency('', 12)).toEqual('');
  });

  test('test cleanDate with start mod', () => {
    expect(cleanDate(new Date('2023-01-01'), 'start')).toEqual('2023-01-01T00:00:00Z');
  });

  test('test cleanDate with end mod', () => {
    expect(cleanDate(new Date('2023-01-01'), 'end')).toEqual('2023-01-01T23:59:59Z');
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

  test('test getRefundStatusChip partial branch variants', () => {
    const chipWithPercentage = getRefundStatusChip({
      status: 'PARTIAL',
      percentageResulted: '10',
    }) as any;
    const chipWithoutPercentage = getRefundStatusChip({
      status: 'PARTIAL',
      percentageResulted: undefined,
    }) as any;

    expect(chipWithPercentage.props.color).toEqual('warning');
    expect(chipWithoutPercentage.props.color).toEqual('warning');
    expect(chipWithPercentage.props.label).not.toEqual(chipWithoutPercentage.props.label);
  });

  test('test getRefundStatusChip with status COMPLETE', () => {
    expect(getRefundStatusChip({ status: 'COMPLETE', percentageResulted: undefined }));
  });

  test('test getRefundStatusChip with unexpected status ', () => {
    expect(getRefundStatusChip({ status: 'TEST', percentageResulted: undefined })).toBeNull();
  });

  test('test formatAddress with strings params', () => {
    expect(formatAddress('via test 1', 'milano', 'mi', '20100')).toEqual(
      'via test 1, milano, mi, 20100'
    );
  });

  test('test formatAddress with empty params', () => {
    expect(formatAddress(undefined, undefined, undefined, undefined)).toEqual('-,  -,  -,  -');
  });

  test('test initiativeUsersAndRefundsValidationSchema validates valid date range', async () => {
    await expect(
      initiativeUsersAndRefundsValidationSchema.validate({
        searchFrom: '01/01/2023',
        searchTo: '02/01/2023',
      })
    ).resolves.toBeDefined();
  });

  test('test initiativeUsersAndRefundsValidationSchema fails when searchTo is before searchFrom', async () => {
    await expect(
      initiativeUsersAndRefundsValidationSchema.validate({
        searchFrom: '02/01/2023',
        searchTo: '01/01/2023',
      })
    ).rejects.toBeDefined();
  });

  test('test initiativeUsersAndRefundsValidationSchema fails on invalid searchTo date', async () => {
    await expect(
      initiativeUsersAndRefundsValidationSchema.validate({
        searchFrom: 'not-a-date',
        searchTo: 'still-not-a-date',
      })
    ).rejects.toBeDefined();
  });

  test('test copyTextToClipboard', () => {
    const writeText = jest.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    copyTextToClipboard(undefined);
    copyTextToClipboard('abc');

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith('abc');
  });

  test('test fileFromReader', async () => {
    const read = jest
      .fn()
      .mockResolvedValueOnce({ done: false, value: new Uint8Array([65]) })
      .mockResolvedValueOnce({ done: true, value: undefined });
    const mockReader = { read } as unknown as ReadableStreamDefaultReader<Uint8Array>;
    const originalReadableStream = (globalThis as any).ReadableStream;
    const originalResponse = (globalThis as any).Response;
    const originalCreateObjectURL = URL.createObjectURL;
    const mockedCreateObjectURL = jest.fn().mockReturnValue('blob:mocked-url');
    const mockedBlob = new Blob(['a']);

    class MockReadableStream {
      constructor(source: { start: (controller: any) => void }) {
        const controller = {
          close: jest.fn(),
          enqueue: jest.fn(),
        };
        source.start(controller);
      }
    }

    class MockResponse {
      // eslint-disable-next-line @typescript-eslint/no-useless-constructor
      constructor(_stream: unknown) {}
      blob() {
        return Promise.resolve(mockedBlob);
      }
    }

    Object.defineProperty(globalThis, 'ReadableStream', {
      value: MockReadableStream,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'Response', {
      value: MockResponse,
      configurable: true,
    });
    Object.defineProperty(URL, 'createObjectURL', {
      value: mockedCreateObjectURL,
      configurable: true,
    });

    const result = await fileFromReader(mockReader);

    expect(result).toEqual('blob:mocked-url');
    expect(read).toHaveBeenCalledTimes(2);
    expect(mockedCreateObjectURL).toHaveBeenCalledTimes(1);

    Object.defineProperty(globalThis, 'ReadableStream', {
      value: originalReadableStream,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'Response', {
      value: originalResponse,
      configurable: true,
    });
    Object.defineProperty(URL, 'createObjectURL', {
      value: originalCreateObjectURL,
      configurable: true,
    });
  });

  test('test downloadURI appends clicks and removes link', () => {
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');
    const link = document.createElement('a');
    const clickSpy = jest.spyOn(link, 'click').mockImplementation(() => {});
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link);

    downloadURI('testdomain.com', 'testfilename.csv');

    expect(link.download).toEqual('testfilename.csv');
    expect(link.href).toContain('testdomain.com');
    expect(link.target).toEqual('_blank');
    expect(appendChildSpy).toHaveBeenCalledWith(link);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeChildSpy).toHaveBeenCalledWith(link);

    createElementSpy.mockRestore();
    clickSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});