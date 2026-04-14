import { initializeOneTrustLinkFix } from '../onetrust-utils';

describe('initializeOneTrustLinkFix', () => {
  const originalOneTrust = window.OneTrust;
  const mutationObserverObserve = jest.fn();
  const mutationObserverDisconnect = jest.fn();
  let setTimeoutSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    setTimeoutSpy.mockClear();
    mutationObserverObserve.mockClear();
    mutationObserverDisconnect.mockClear();
    document.body.innerHTML = '';
    Object.defineProperty(window, 'OneTrust', {
      value: undefined,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, 'MutationObserver', {
      value: jest.fn().mockImplementation(() => ({
        observe: mutationObserverObserve,
        disconnect: mutationObserverDisconnect,
      })),
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    Object.defineProperty(window, 'OneTrust', {
      value: originalOneTrust,
      writable: true,
      configurable: true,
    });
    jest.restoreAllMocks();
  });

  test('schedules a retry when OneTrust is not yet available', () => {
    initializeOneTrustLinkFix();

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);
  });

  test('fixes cookie policy links once OneTrust is initialized', async () => {
    const validLink = document.createElement('a');
    validLink.className = 'ot-cookie-policy-link';
    validLink.setAttribute('href', 'https://example.test/portale-esercenti/privacy');
    validLink.setAttribute('target', '_blank');
    validLink.setAttribute('rel', 'noopener');

    const untouchedLink = document.createElement('a');
    untouchedLink.className = 'privacy-notice-link';
    untouchedLink.setAttribute('href', 'https://example.test/other/privacy');
    untouchedLink.setAttribute('target', '_blank');
    untouchedLink.setAttribute('rel', 'noopener');

    const invalidLink = document.createElement('a');
    invalidLink.className = 'ot-cookie-policy-link';
    invalidLink.setAttribute('href', 'not-a-valid-url');

    const emptyHrefLink = document.createElement('a');
    emptyHrefLink.className = 'privacy-notice-link';
    emptyHrefLink.setAttribute('href', '');

    const banner = document.createElement('div');
    banner.id = 'onetrust-consent-sdk';

    document.body.appendChild(validLink);
    document.body.appendChild(untouchedLink);
    document.body.appendChild(invalidLink);
    document.body.appendChild(emptyHrefLink);
    document.body.appendChild(banner);

    Object.defineProperty(window, 'OneTrust', {
      value: {
        NoticeApi: {
          Initialized: Promise.resolve(),
          LoadNotices: jest.fn(),
        },
      },
      writable: true,
      configurable: true,
    });

    initializeOneTrustLinkFix('/portale-enti');
    await Promise.resolve();

    jest.advanceTimersByTime(500);
    expect(validLink.getAttribute('href')).toBe('/portale-enti/privacy');
    expect(validLink.getAttribute('target')).toBeNull();
    expect(validLink.getAttribute('rel')).toBeNull();
    expect(untouchedLink.getAttribute('href')).toBe('https://example.test/other/privacy');
    expect(invalidLink.getAttribute('href')).toBe('not-a-valid-url');
    expect(emptyHrefLink.getAttribute('href')).toBe('');

    jest.advanceTimersByTime(500);
    expect(mutationObserverObserve).toHaveBeenCalledWith(banner, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href'],
    });
  });

  test('skips mutation observation when the consent banner is missing', async () => {
    const validLink = document.createElement('a');
    validLink.className = 'ot-cookie-policy-link';
    validLink.setAttribute('href', 'https://example.test/portale-esercenti/privacy');
    document.body.appendChild(validLink);

    Object.defineProperty(window, 'OneTrust', {
      value: {
        NoticeApi: {
          Initialized: Promise.resolve(),
          LoadNotices: jest.fn(),
        },
      },
      writable: true,
      configurable: true,
    });

    initializeOneTrustLinkFix('/portale-enti');
    await Promise.resolve();

    jest.advanceTimersByTime(1000);

    expect(validLink.getAttribute('href')).toBe('/portale-enti/privacy');
    expect(mutationObserverObserve).not.toHaveBeenCalled();
  });

  test('uses the default url prefix when no prefix is provided', async () => {
    const validLink = document.createElement('a');
    validLink.className = 'ot-cookie-policy-link';
    validLink.setAttribute('href', 'https://example.test/portale-esercenti/privacy');
    document.body.appendChild(validLink);

    Object.defineProperty(window, 'OneTrust', {
      value: {
        NoticeApi: {
          Initialized: Promise.resolve(),
          LoadNotices: jest.fn(),
        },
      },
      writable: true,
      configurable: true,
    });

    initializeOneTrustLinkFix();
    await Promise.resolve();
    jest.advanceTimersByTime(500);

    expect(validLink.getAttribute('href')).toBe('/portale-enti/privacy');
  });
});
