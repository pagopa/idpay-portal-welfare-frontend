// import { Provider } from 'react-redux';
// import { render } from 'react-dom';
import { InitiativeApi } from '../../../api/InitiativeApiClient';
// import { createStore } from '../../../redux/store';
import { getInitativeSummary, getInitiativeDetail } from '../../../services/intitativeService';
import { mockedInitiativeId } from '../../../services/__mocks__/initiativeService';
// import InitiativeDetail from '../initiativeDetail';

jest.mock('../../../api/InitiativeApiClient');

beforeEach(() => {
  jest.spyOn(InitiativeApi, 'getInitativeSummary');
  jest.spyOn(InitiativeApi, 'getInitiativeById');
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<InitiativeDetail />', (/* injectedStore?: ReturnType<typeof createStore> */) => {
  //   const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  //   test('Should render the Initiative Detail', async () => {
  //     render(<InitiativeDetail />);
  //   });

  test('test get initiative summary', async () => {
    await getInitativeSummary();
    expect(InitiativeApi.getInitativeSummary).toBeCalled();
  });

  test('test get initiative detail', async () => {
    await getInitiativeDetail(mockedInitiativeId);
    expect(InitiativeApi.getInitiativeById).toBeCalled();
  });
});
