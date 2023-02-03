import React from 'react';
import { screen, act, fireEvent, findByText } from '@testing-library/react';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import ChooseOrganization from '../ChooseOrganization';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('test suite for ChooseOrganization', () => {
  test('render ChooseOrganization without crashing', async () => {
    await act(async () => {
      renderWithHistoryAndStore(<ChooseOrganization />);
    });
    // search organizations
    const searchOrganizationInput = screen.getByLabelText(
      'pages.chooseOrganization.searchInputLabel'
    ) as HTMLInputElement;

    fireEvent.change(searchOrganizationInput, { target: { value: 'Comune di' } });
    expect(searchOrganizationInput.value).toBe('Comune di');

    // select an organization from the filtered list
    const organizationFilteredListElement = (await screen.findByText(
      'Comune di Milano'
    )) as HTMLSpanElement;
    fireEvent.click(organizationFilteredListElement);

    // after selection continue button is no longer disabled
    const countinueBtn = screen.getByText('pages.chooseOrganization.continueBtnLabel');
    fireEvent.click(countinueBtn);
  });
});
