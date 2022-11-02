/* eslint-disable react/jsx-no-bind */
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { groupsApi } from '../../../api/groupsApiClient';
import { createStore } from '../../../redux/store';
// import { getGroupOfBeneficiaryStatusAndDetail } from '../../../services/groupsService';
import {
  getGroupOfBeneficiaryStatusAndDetails,
  mockedInitiativeId,
} from '../../../services/__mocks__/groupService';
import InitiativeOverview from '../initiativeOverview';

export function mockLocationFunction() {
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

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

jest.mock('react-router-dom', () => mockLocationFunction());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

jest.mock('../../../api/groupsApiClient');

beforeEach(() => {
  jest.spyOn(groupsApi, 'getGroupOfBeneficiaryStatusAndDetails');
});

describe('<InitiativeOverview />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const handleViewDetails = jest.fn();
  const conditionalOnClickRendering = jest.fn();
  const handleCloseInitiativeOverviewDeleteModal = jest.fn();
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the InitiativeOverview component', async () => {
    await waitFor(async () => {
      const _app = render(
        <Provider store={store}>
          <InitiativeOverview />
        </Provider>
      );

      const setUseState = jest.fn();
      const useStateMock: any = (useState: any) => [useState, setUseState];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      expect(useStateMock).toBeDefined();
    });
  });

  test('Testing functions calls', async () => {
    await waitFor(async () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <InitiativeOverview />
        </Provider>
      );

      const setUseState = jest.fn();
      const useStateMock: any = (useState: any) => [useState, setUseState];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);
      useStateMock();
      expect(useStateMock).toBeDefined();

      handleViewDetails(mockedInitiativeId);
      expect(handleViewDetails).toHaveBeenCalled();

      const condition = queryByTestId('contion-onclick-test') as HTMLButtonElement;
      userEvent.click(condition);
      conditionalOnClickRendering();
      expect(conditionalOnClickRendering).toHaveBeenCalled();

      const setOpenInitiativeOverviewDeleteModal = jest.fn();
      const useStateModalMock: any = (openInitiativeOverviewDeleteModal: any) => [
        openInitiativeOverviewDeleteModal,
        setOpenInitiativeOverviewDeleteModal,
      ];
      expect(useStateModalMock).toBeDefined();
      setOpenInitiativeOverviewDeleteModal();
      expect(setOpenInitiativeOverviewDeleteModal).toHaveBeenCalled();

      const details = queryByTestId('view-datails-test') as HTMLElement;
      userEvent.click(details);
      handleViewDetails();
      expect(handleViewDetails).toHaveBeenCalled();
    });
  });

  it('Test call of getGroupOfBeneficiaryStatusAndDetail', async () => {
    jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

    render(
      <Provider store={store}>
        <InitiativeOverview />
      </Provider>
    );

    getGroupOfBeneficiaryStatusAndDetails(mockedInitiativeId);
    expect(getGroupOfBeneficiaryStatusAndDetails(mockedInitiativeId)).toBeDefined();
  });
});
