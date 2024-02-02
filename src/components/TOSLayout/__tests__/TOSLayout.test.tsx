import React from 'react';
import { renderWithContext } from '../../../utils/test-utils';
import TOSLayout from '../TOSLayout';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('test suite for TOSLayout', () => {
  test('test render TosLayout', () => {
    renderWithContext(<TOSLayout />);
  });
});
