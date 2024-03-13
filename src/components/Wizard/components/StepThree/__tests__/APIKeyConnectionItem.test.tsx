import React from 'react';
import APIKeyConnectionItem from '../APIKeyConnectionItem';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithContext } from '../../../../../utils/test-utils';
import { store } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

window.scrollTo = jest.fn();

describe('<APIKeyConnectionItem />', () => {
  it('Should display the APIKeyConnectionItem action submit', async () => {
    const handleApyKeyClientIdChanged = jest.fn();
    const handleApyKeyClientAssertionChanged = jest.fn();
    const handleApiKeyClientDispathed = jest.fn();

    renderWithContext(
      <APIKeyConnectionItem
        action={WIZARD_ACTIONS.SUBMIT}
        apiKeyClientId={store.getState().initiative.beneficiaryRule.apiKeyClientId}
        handleApyKeyClientIdChanged={handleApyKeyClientIdChanged}
        apiKeyClientAssertion={store.getState().initiative.beneficiaryRule.apiKeyClientAssertion}
        handleApyKeyClientAssertionChanged={handleApyKeyClientAssertionChanged}
        handleApiKeyClientDispathed={handleApiKeyClientDispathed}
      />
    );

    const clientId = screen.getAllByTestId('client-id-test') as HTMLInputElement[];
    fireEvent.focus(clientId[0]);
    fireEvent.blur(clientId[0]);
    fireEvent.change(clientId[0], { target: { value: 'clientId' } });
    expect(clientId[0].value).toBe('clientId');

    const clientAssertion = screen.getAllByTestId('client-assertion-test') as HTMLInputElement[];
    fireEvent.focus(clientAssertion[0]);
    fireEvent.blur(clientAssertion[0]);
    fireEvent.change(clientAssertion[0], { target: { value: 'clientAssertion' } });
    expect(clientAssertion[0].value).toBe('clientAssertion');
  });

  it('Should display the APIKeyConnectionItem action draft', async () => {
    renderWithContext(
      <APIKeyConnectionItem
        action={WIZARD_ACTIONS.DRAFT}
        apiKeyClientId={store.getState().initiative.beneficiaryRule.apiKeyClientId}
        handleApyKeyClientIdChanged={jest.fn()}
        apiKeyClientAssertion={store.getState().initiative.beneficiaryRule.apiKeyClientAssertion}
        handleApyKeyClientAssertionChanged={jest.fn()}
        handleApiKeyClientDispathed={jest.fn()}
      />
    );
  });
});
