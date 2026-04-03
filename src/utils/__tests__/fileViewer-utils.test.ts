import { downloadCsv, openInvoiceInNewTab } from '../fileViewer-utils';

type MockResponse = {
  ok: boolean;
  status: number;
  headers: { get: jest.Mock };
  blob: jest.Mock;
};

describe('fileViewer utils', () => {
  const fetchMock = jest.fn();
  const createObjectURLMock = jest.fn();
  const revokeObjectURLMock = jest.fn();
  let openMock: jest.SpyInstance;

  const buildResponse = (contentType = 'application/octet-stream'): MockResponse => ({
    ok: true,
    status: 200,
    headers: {
      get: jest.fn(() => contentType),
    },
    blob: jest.fn(async () => new Blob(['file content'], { type: 'application/octet-stream' })),
  });

  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock.mockReset();
    createObjectURLMock.mockReset();
    revokeObjectURLMock.mockClear();
    createObjectURLMock.mockReturnValue('blob:mock-url');
    openMock = jest.spyOn(window, 'open').mockImplementation(() => null);
    if (!URL.createObjectURL) {
      Object.defineProperty(URL, 'createObjectURL', {
        value: jest.fn(),
        writable: true,
        configurable: true,
      });
    }
    if (!URL.revokeObjectURL) {
      Object.defineProperty(URL, 'revokeObjectURL', {
        value: jest.fn(),
        writable: true,
        configurable: true,
      });
    }
    jest.spyOn(URL, 'createObjectURL').mockImplementation(createObjectURLMock);
    jest.spyOn(URL, 'revokeObjectURL').mockImplementation(revokeObjectURLMock);
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('opens pdf invoices and sets the window title', async () => {
    const titleSetter = jest.fn();
    const fakeWindow = {
      document: {},
    } as any;

    Object.defineProperty(fakeWindow.document, 'title', {
      set: titleSetter,
    });

    openMock.mockReturnValue(fakeWindow);
    fetchMock.mockResolvedValue(buildResponse('application/pdf'));

    await openInvoiceInNewTab('https://example.test/invoice', 'invoice.pdf');
    jest.runAllTimers();

    const createdBlob = createObjectURLMock.mock.calls[0][0] as Blob;
    const createdUrl = openMock.mock.calls[0][0];
    expect(fetchMock).toHaveBeenCalledWith('https://example.test/invoice', { method: 'GET' });
    expect(createdBlob.type).toBe('application/pdf');
    expect(titleSetter).toHaveBeenCalledWith('invoice.pdf');
    expect(revokeObjectURLMock).toHaveBeenCalledWith(createdUrl);
  });

  test('uses xml mime type and skips title handling when the window is missing', async () => {
    openMock.mockReturnValue(null);
    fetchMock.mockResolvedValue(buildResponse('text/plain'));

    await openInvoiceInNewTab('https://example.test/invoice', 'invoice.xml');
    jest.runAllTimers();

    const createdBlob = createObjectURLMock.mock.calls[0][0] as Blob;
    const createdUrl = openMock.mock.calls[0][0];
    expect(createdBlob.type).toBe('application/xml');
    expect(openMock).toHaveBeenCalledWith(createdUrl, '_blank');
  });

  test('falls back to the response content type and ignores title assignment errors', async () => {
    const fakeWindow = {
      document: {},
    } as any;

    Object.defineProperty(fakeWindow.document, 'title', {
      set: () => {
        throw new Error('title write failed');
      },
    });

    openMock.mockReturnValue(fakeWindow);
    fetchMock.mockResolvedValue(buildResponse('text/csv'));

    await openInvoiceInNewTab('https://example.test/invoice', 'invoice.csv');
    jest.runAllTimers();

    const createdBlob = createObjectURLMock.mock.calls[0][0] as Blob;
    const createdUrl = openMock.mock.calls[0][0];
    expect(createdBlob.type).toBe('text/csv');
    expect(revokeObjectURLMock).toHaveBeenCalledWith(createdUrl);
  });

  test('uses default octet-stream when file name is missing and response has no content-type', async () => {
    fetchMock.mockResolvedValue(buildResponse(''));

    await openInvoiceInNewTab('https://example.test/invoice');
    jest.runAllTimers();

    const createdBlob = createObjectURLMock.mock.calls[0][0] as Blob;
    const createdUrl = openMock.mock.calls[0][0];
    expect(createdBlob.type).toBe('application/octet-stream');
    expect(openMock).toHaveBeenCalledWith(createdUrl, '_blank');
    expect(revokeObjectURLMock).toHaveBeenCalledWith(createdUrl);
  });

  test('throws when the fetch response is not ok', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      headers: {
        get: jest.fn(),
      },
      blob: jest.fn(),
    });

    await expect(openInvoiceInNewTab('https://example.test/invoice', 'invoice.pdf')).rejects.toThrow(
      'Failed to fetch invoice: 404'
    );
  });

  test('downloads a csv file by creating and clicking an anchor', () => {
    const appendChild = jest.spyOn(document.body, 'appendChild');
    const removeChild = jest.spyOn(document.body, 'removeChild');
    const anchor = document.createElement('a');
    const click = jest.spyOn(anchor, 'click').mockImplementation(() => undefined);
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(anchor);
    const appendChildMock = appendChild.mockImplementation(() => anchor);
    const removeChildMock = removeChild.mockImplementation(() => anchor);

    downloadCsv('https://example.test/export.csv', 'export.csv');

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(anchor.href).toBe('https://example.test/export.csv');
    expect(anchor.download).toBe('export.csv');
    expect(anchor.rel).toBe('noopener');
    expect(anchor.target).toBe('_blank');
    expect(appendChildMock).toHaveBeenCalledWith(anchor);
    expect(click).toHaveBeenCalled();
    expect(removeChildMock).toHaveBeenCalledWith(anchor);
  });
});
