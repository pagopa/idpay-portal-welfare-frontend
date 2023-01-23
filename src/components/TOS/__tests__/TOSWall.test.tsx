import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import TOSWall from '../TOSWall';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
  Trans: () => {
    return null;
  },
}));

describe('tests for TOSWall', () => {
  test('test render of TOSWall component', async () => {
    const acceptTos = jest.fn();
    renderWithHistoryAndStore(<TOSWall acceptTOS={acceptTos} tosRoute={''} privacyRoute={''} />);
    fireEvent.click(screen.getByText('Accedi'));
    expect(acceptTos).toBeCalled();
  });
});
