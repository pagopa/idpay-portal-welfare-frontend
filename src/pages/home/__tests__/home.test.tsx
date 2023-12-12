import { render } from '@testing-library/react';
import React from 'react';
import Home from '../Home';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

describe('<ConfirmPublishInitiativeModal />', () => {
  test('Test home', () => {
    render(<Home />);
  });
});
