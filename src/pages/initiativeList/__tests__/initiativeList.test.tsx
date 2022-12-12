import { fireEvent, screen, waitFor } from '@testing-library/react';
import InitiativeList from '../InitiativeList';
import { renderWithContext } from '../../../utils/test-utils';
import React from 'react';
// import userEvent from '@testing-library/user-event';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/index', () => ({
  TitleBox: () => <div>Test</div>,
}));

describe('<InitiativeList />', () => {
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('Should render the Initiative List', async () => {
    renderWithContext(<InitiativeList />);

    // screen.debug();
    const searchInitiative = screen.getByTestId('search-initiative') as HTMLInputElement;

    fireEvent.change(searchInitiative, { target: { value: 'value' } });
    await waitFor(() => expect(searchInitiative.value).toBe('value'));

    // const initiativeBtn = document.querySelector('initiative-btn-test') as HTMLButtonElement;
    // userEvent.click(initiativeBtn);
  });
});
