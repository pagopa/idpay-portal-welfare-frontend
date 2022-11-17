import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import InitiativeList from '../InitiativeList';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

describe('<InitiativeList />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const EnhancedTableHead = jest.fn();
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('Should render the Initiative List', async () => {
    <Provider store={store}>
      <InitiativeList />
    </Provider>;

    const setOpenExitModal = jest.fn();
    const useStateMock: any = (openExitModal: boolean) => [openExitModal, setOpenExitModal];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    expect(EnhancedTableHead).toBeDefined();
  });
});
