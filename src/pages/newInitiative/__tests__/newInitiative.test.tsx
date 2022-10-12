import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import React from 'react';
import NewInitiative from '../newInitiative';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

jest.mock('react-i18next', () => Function());

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
  withTranslation: () => jest.fn(),
}));

function mockFunction() {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useLocation: jest.fn().mockReturnValue({
      pathname: '/localhost:3000/portale-enti',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }),
  };
}

jest.mock('react-router-dom', () => mockFunction());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useInitiative: jest.fn(),
  length: '',
}));

describe('<NewInitiative />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('Should render the New Initiative component', async () => {
    const handleCloseExitModal = jest.fn();
    const handleOpenExitModal = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <NewInitiative />
      </Provider>
    );

    const setOpenExitModal = jest.fn();
    const useStateMock: any = (openExitModal: boolean) => [openExitModal, setOpenExitModal];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    expect(setOpenExitModal).toBeDefined();
    expect(handleCloseExitModal).toBeDefined();
    expect(handleOpenExitModal).toBeDefined();
  });

  it('modal should be open', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <NewInitiative />
        </Provider>
      );
      const button = getByTestId('exit-button-test');
      fireEvent.click(button);
    });
  });
});
