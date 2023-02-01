import React from 'react';
import { renderWithHistoryAndStore } from '../../utils/test-utils';
import Layout from '../Layout/Layout';

describe('test suite for TOSLayout', () => {
  test('test render TosLayout', () => {
    renderWithHistoryAndStore(<Layout />);
  });
});
