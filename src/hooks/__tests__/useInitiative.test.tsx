import { render } from '@testing-library/react';
import React from 'react';
import { InitiativeApi } from '../../api/InitiativeApiClient';
import { getInitiativeDetail } from '../../services/intitativeService';
import { mockedInitiativeId } from '../../services/__mocks__/initiativeService';
import { Provider } from 'react-redux';
import { createStore } from '../../redux/store';
import { useInitiative } from '../useInitiative';

jest.mock('../../api/InitiativeApiClient');

beforeEach(() => {
  jest.spyOn(InitiativeApi, 'getInitiativeById');
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useInitiative: jest.fn(),
}));

describe('<useInitiaitive />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  test('test get initiative detail', async () => {
    jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

    await getInitiativeDetail(mockedInitiativeId);
    expect(InitiativeApi.getInitiativeById).toBeCalledWith(mockedInitiativeId);
  });
});
