import React from 'react';
import { renderWithContext } from '../../../utils/test-utils';
import InitUploadBox from '../InitUploadBox';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});
// hey
describe('test suite for InitUploadBox', () => {
  test('render InitUploadBox', () => {
    renderWithContext(<InitUploadBox text="text" link="link" />);
  });
});
