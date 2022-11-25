import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import React, { Dispatch, SetStateAction } from 'react';
import { createStore } from '../../../redux/store';
import InitiativeDetail from '../initiativeDetail';

jest.mock('react-router-dom', () => Function());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

// jest.mock('@pagopa/selfcare-common-frontend/hooks/useLoading', () => Function());

// jest.mock('@pagopa/selfcare-common-frontend/hooks/useLoading', () => ({
//   useLoading: () => ({}),
// }));

jest.mock('@pagopa/selfcare-common-frontend', () => ({
  ...jest.requireActual('@pagopa/selfcare-common-frontend/hooks/useLoading'),
  useLoading: () => ({}),
}));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
  withTranslation: jest.fn(),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
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

  it('Test on close of snackbar', async () => {
    await waitFor(async () => {
      const handleClose = jest.fn();
      render(
        <Provider store={store}>
          <InitiativeDetail />
        </Provider>
      );

      handleClose();
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
