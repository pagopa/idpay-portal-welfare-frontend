import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { InitiativeApiMocked } from '../../../api/__mocks__/InitiativeApiClient';
import { renderWithContext } from '../../../utils/test-utils';
import ChooseOrganization from '../ChooseOrganization';

jest.mock('../../../services/intitativeService');

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => cleanup);

describe('test suite for ChooseOrganization', () => {
  test('render ChooseOrganization without crashing', async () => {
    await act(async () => {
      renderWithContext(<ChooseOrganization />);
    });
    // search organizations
    const searchOrganizationInput = screen.getByLabelText(
      'pages.chooseOrganization.searchInputLabel'
    ) as HTMLInputElement;

    fireEvent.change(searchOrganizationInput, { target: { value: 'Comune di' } });
    expect(searchOrganizationInput.value).toBe('Comune di');

    // select an organization from the filtered list
    const organizationFilteredListElement = (await screen.findByText(
      'Comune di Test1'
    )) as HTMLSpanElement;
    fireEvent.click(organizationFilteredListElement);

    // after selection continue button is no longer disabled
    const countinueBtn = screen.getByText('pages.chooseOrganization.continueBtnLabel');
    fireEvent.click(countinueBtn);
  });

  test('test reset organization list on click endAdornment X icon', async () => {
    await act(async () => {
      renderWithContext(<ChooseOrganization />);
    });
    // search organizations
    const searchOrganizationInput = screen.getByLabelText(
      'pages.chooseOrganization.searchInputLabel'
    ) as HTMLInputElement;

    fireEvent.change(searchOrganizationInput, { target: { value: 'Comune di' } });
    expect(searchOrganizationInput.value).toBe('Comune di');

    // find the x icon inside the input to remove the value of input
    const organizationFilteredListElement = await screen.findByTestId('endAdornment-reset');
    fireEvent.click(organizationFilteredListElement);
  });

  test('test reset organization after one organization has been selected', async () => {
    await act(async () => {
      renderWithContext(<ChooseOrganization />);
    });
    // search organizations
    const searchOrganizationInput = screen.getByLabelText(
      'pages.chooseOrganization.searchInputLabel'
    ) as HTMLInputElement;

    fireEvent.change(searchOrganizationInput, { target: { value: 'Comune di' } });
    expect(searchOrganizationInput.value).toBe('Comune di');

    // select an organization from the filtered list
    const organizationFilteredListElement = (await screen.findByText(
      'Comune di Test1'
    )) as HTMLSpanElement;
    fireEvent.click(organizationFilteredListElement);

    const clearIconBtn = screen.getByTestId('removeSelectionIcon') as HTMLButtonElement;
    fireEvent.click(clearIconBtn);
  });

  test('test case api getOrganizationsList response length is less than 1', async () => {
    (InitiativeApiMocked.getOrganizationsList = async (): Promise<any> =>
      new Promise((resolve) => resolve([]))),
      renderWithContext(<ChooseOrganization />);
  });

  test('test catch case api getOrganizationsList', async () => {
    (InitiativeApiMocked.getOrganizationsList = async (): Promise<any> =>
      Promise.reject('mocked error message for tests')),
      renderWithContext(<ChooseOrganization />);
  });
});
