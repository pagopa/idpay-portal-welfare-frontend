import React from 'react';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import Layout from '../Layout';
import InitiativeList from '../../../pages/initiativeList/InitiativeList';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('test suite for Layout', () => {
  test('test render Layout', () => {
    renderWithHistoryAndStore(<Layout children={<InitiativeList />} />);
  });
});
