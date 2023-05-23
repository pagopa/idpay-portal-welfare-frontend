import React from 'react';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import FamilyUnitSummary from '../components/FamilyUnitSummary';

beforeEach(async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('FamilyUnitSummary', () => {
  test('should render FamilyUnitSummary', () => {
    renderWithHistoryAndStore(<FamilyUnitSummary id={'2222acxzc'} cf={'3333xcxc'} />);
  });

  test('test catch case of getFamilyComposition api call', async () => {
    InitiativeApiMocked.getFamilyComposition = async (): Promise<any> =>
      Promise.reject('mocked error response for tests');

    renderWithHistoryAndStore(<FamilyUnitSummary id={'2222acxzc'} cf={'3333xcxc'} />);
  });
});
