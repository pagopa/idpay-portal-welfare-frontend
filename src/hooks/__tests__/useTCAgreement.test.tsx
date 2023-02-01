import React from 'react';
import { renderWithHistoryAndStore } from '../../utils/test-utils';
import useTCAgreement from '../useTCAgreement';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

const returnVal = {};
const HookWrapper = () => {
  Object.assign(returnVal, useTCAgreement());
  // result = useTCAgreement();
  return null;
};

describe('test suite for usTCAgreement hook', () => {
  test('test call of useTCAgreement hook', () => {
    renderWithHistoryAndStore(<HookWrapper />);
  });
});
