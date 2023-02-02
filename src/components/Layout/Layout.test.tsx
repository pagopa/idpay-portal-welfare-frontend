import { renderWithHistoryAndStore } from '../../utils/test-utils';
import Layout from '../Layout/Layout';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('test suite for TOSLayout', () => {
  test('test render TosLayout', () => {
    renderWithHistoryAndStore(<Layout />);
  });
});
