describe('redux store middleware configuration', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('includes redux-logger middleware when LOG_REDUX_ACTIONS is true', () => {
    jest.isolateModules(() => {
      const configureStoreMock = jest.fn((_options?: unknown) => ({
        getState: jest.fn(() => ({})),
        dispatch: jest.fn(),
      }));
      const loggerMock = jest.fn();

      jest.doMock('@reduxjs/toolkit', () => {
        const actualToolkit = jest.requireActual('@reduxjs/toolkit');
        return {
          ...actualToolkit,
          configureStore: configureStoreMock,
        };
      });
      jest.doMock('redux-logger', () => loggerMock);
      jest.doMock('../../utils/constants', () => ({
        LOG_REDUX_ACTIONS: true,
      }));

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { createStore } = require('../store');
      createStore();

      type StoreOptionsWithMiddleware = {
        middleware: (getDefaultMiddleware: (options: { serializableCheck: boolean }) => Array<any>) => Array<any>;
      };
      const createStoreArgs = configureStoreMock.mock.calls[0]?.[0] as
        | StoreOptionsWithMiddleware
        | undefined;
      expect(createStoreArgs).toBeDefined();
      if (!createStoreArgs) {
        throw new Error('configureStore was not called with options');
      }
      const getDefaultMiddleware = jest.fn(() => []);
      const middlewareChain = createStoreArgs.middleware(getDefaultMiddleware);

      expect(getDefaultMiddleware).toHaveBeenCalledWith({ serializableCheck: false });
      expect(middlewareChain).toContain(loggerMock);
    });
  });
});