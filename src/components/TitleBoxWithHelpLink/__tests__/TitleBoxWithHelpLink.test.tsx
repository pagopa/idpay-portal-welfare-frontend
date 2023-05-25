import React from 'react';
import { renderWithContext } from '../../../utils/test-utils';
import TitleBoxWithHelpLink from '../TitleBoxWithHelpLink';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('test suite for TitleBoxWithHelpLink', () => {
  test('render TitleBoxWithHelpLink', () => {
    renderWithContext(
      <TitleBoxWithHelpLink
        title="title"
        subtitle="subtitle"
        helpLink="test.com"
        helpLabel="label"
      />
    );
  });
});
