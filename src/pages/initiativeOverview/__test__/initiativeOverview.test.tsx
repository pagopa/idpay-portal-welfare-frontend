/* eslint-disable react/jsx-no-bind */
import { render, waitFor } from '@testing-library/react';
// import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import InitiativeOverview from '../initiativeOverview';

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

jest.mock(
  'c:/Users/fmaiocch/Desktop/React_Project/idpay-portal-welfare-frontend/src/hooks/useIDPayUser',
  () => ({
    ...jest.requireActual('react-router-dom'),
    useIDPayUser: () => ({
      org_rule: 'ope_base',
    }),
  })
);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

describe('<InitiativeOverview />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the InitiativeOverview component', async () => {
    await waitFor(async () => {
      render(
        <Provider store={store}>
          <InitiativeOverview />
        </Provider>
      );
    });
  });
});
