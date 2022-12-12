import { Provider } from 'react-redux';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React, { Dispatch, SetStateAction } from 'react';
import { createStore } from '../../../redux/store';
import InitiativeDetail from '../initiativeDetail';
import { renderWithProviders } from '../../../utils/test-utils';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { setInitiative } from '../../../redux/slices/initiativeSlice';
import { mockedInitiative } from '../../../model/__tests__/Initiative.test';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
  withTranslation: jest.fn(),
}));

// jest.mock('@pagopa/selfcare-common-frontend', () => ({
//   // ...jest.requireActual('@pagopa/selfcare-common-frontend/components'),
//   TitleBox: () => <div>Test</div>,
// }));

// jest.mock('@pagopa/selfcare-common-frontend', () => ({
//   // ...jest.requireActual('@pagopa/selfcare-common-frontend/hooks/useLoading'),
//   useLoading: () => ({}),
//  }));

describe('<InitiativeDetail />', (injectedStore?: ReturnType<
  typeof createStore
>, injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const store = injectedStore ? injectedStore : createStore();
  store.dispatch(setInitiative(mockedInitiative))

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('Testing useState of the component', async () => {
    const history = injectedHistory ? injectedHistory : createMemoryHistory();
    // store.dispatch(setInitiative(mockedInitiative));
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeDetail />
        </Router>
      </Provider>
    );

    const backBtnDetail = screen.getByTestId('backButtonDetail') as HTMLButtonElement;
    const secondBackButton = screen.getByText(/pages.initiativeDetail.accordion.buttons.back/i);

    const oldLocPathname = history.location.pathname;

    fireEvent.click(backBtnDetail);

    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());

    fireEvent.click(secondBackButton);
    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());
  });

  it('Test on close of snackbar', async () => {
    renderWithProviders(<InitiativeDetail />);
  });
});
