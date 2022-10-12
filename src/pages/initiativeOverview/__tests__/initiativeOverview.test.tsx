/* eslint-disable react/jsx-no-bind */
import { render, waitFor } from '@testing-library/react';
import React from 'react';
// import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { groupsApi } from '../../../api/groupsApiClient';
import { createStore } from '../../../redux/store';
// import { getGroupOfBeneficiaryStatusAndDetail } from '../../../services/groupsService';
import {
  getGroupOfBeneficiaryStatusAndDetails,
  mockedInitiativeId,
} from '../../../services/__mocks__/groupService';
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

  beforeEach(() => {
    jest.spyOn(groupsApi, 'getGroupOfBeneficiaryStatusAndDetails');
  });

  jest.mock('../../../api/groupsApiClient');

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
