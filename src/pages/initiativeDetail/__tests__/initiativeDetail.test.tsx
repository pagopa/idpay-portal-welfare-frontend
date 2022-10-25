import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import React, { Dispatch, SetStateAction } from 'react';
import { InitiativeApi } from '../../../api/InitiativeApiClient';
import { createStore } from '../../../redux/store';
import { getInitativeSummary, getInitiativeDetail } from '../../../services/intitativeService';
import { mockedInitiativeId } from '../../../services/__mocks__/initiativeService';
import InitiativeDetail from '../initiativeDetail';

jest.mock('../../../api/InitiativeApiClient');

beforeEach(() => {
  jest.spyOn(InitiativeApi, 'getInitativeSummary');
  jest.spyOn(InitiativeApi, 'getInitiativeById');
});

jest.mock('react-router-dom', () => Function());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

jest.mock('@pagopa/selfcare-common-frontend', () => ({
  useLoading: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
  withTranslation: jest.fn(),
}));

describe('<InitiativeDetail />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('Should render the Initiative Detail', async () => {
    render(
      <Provider store={store}>
        <InitiativeDetail />
      </Provider>
    );
  });

  test('Testing useState of the component', () => {
    render(
      <Provider store={store}>
        <InitiativeDetail />
      </Provider>
    );

    const setExpanded: Dispatch<SetStateAction<string | boolean>> = jest.fn();
    const useExpandedMock: any = (expanded: SetStateAction<string | boolean>) => [
      expanded,
      setExpanded,
    ];
    jest.spyOn(React, 'useState').mockImplementation(useExpandedMock);
    expect(useExpandedMock).toBeDefined();
  });

  test('test get initiative summary', async () => {
    await getInitativeSummary();
    expect(InitiativeApi.getInitativeSummary).toBeCalled();
  });

  test('test get initiative detail', async () => {
    await getInitiativeDetail(mockedInitiativeId);
    expect(InitiativeApi.getInitiativeById).toBeCalled();
  });
});
