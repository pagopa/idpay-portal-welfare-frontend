import React from 'react';
import { renderWithContext } from '../../../utils/test-utils';
import Layout from '../Layout';
import InitiativeList from '../../../pages/initiativeList/InitiativeList';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

jest.mock('../../../services/intitativeService');

describe('test suite for Layout', () => {
  test('test render Layout', () => {
    renderWithContext(<Layout children={<InitiativeList />} />);
  });
});
