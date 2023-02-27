import React from 'react';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import TitleBoxWithHelpLink from '../TitleBoxWithHelpLink';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('test suite for TitleBoxWithHelpLink', () => {
  test('render TitleBoxWithHelpLink', () => {
    renderWithHistoryAndStore(
      <TitleBoxWithHelpLink
        title="title"
        subtitle="subtitle"
        helpLink="test.com"
        helpLabel="label"
      />
    );
  });
});
