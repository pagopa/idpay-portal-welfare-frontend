import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import Assistance from '../assistance';
import { createStore } from '../../../redux/store';

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
}));

describe('<InitiativeDetail />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('Should render the Assistance component', async () => {
    const { queryByTestId } = render(
      <Provider store={store}>
        <Assistance />
      </Provider>
    );
  });

  it('Test of form fields', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Assistance />
      </Provider>
    );

    const assSubject = getByTestId('assistanceSubject-test');
    expect(assSubject).not.toBeNull();
  });
});
