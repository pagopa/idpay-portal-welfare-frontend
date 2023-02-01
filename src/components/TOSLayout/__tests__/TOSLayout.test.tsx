import React from 'react';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import TOSLayout from '../TOSLayout';

describe('test suite for TOSLayout', () => {
  test('test render TosLayout', () => {
    renderWithHistoryAndStore(<TOSLayout />);
  });
});
