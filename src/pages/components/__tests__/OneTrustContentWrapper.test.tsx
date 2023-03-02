import React from 'react';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import OneTrustContentWrapper from '../OneTrustContentWrapper';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('test suite for OneTrustContentWrapper', () => {
  test('render OneTrustContentWrapper', () => {
    renderWithHistoryAndStore(<OneTrustContentWrapper idSelector={''} />);
  });
});
