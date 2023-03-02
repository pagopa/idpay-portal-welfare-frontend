import React from 'react';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import InitUploadBox from '../InitUploadBox';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('test suite for InitUploadBox', () => {
  test('render InitUploadBox', () => {
    renderWithHistoryAndStore(<InitUploadBox text="text" link="link" />);
  });
});
