/* eslint-disable react/jsx-no-bind */
import { screen, waitFor, cleanup } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import ShopRules from '../ShopRules';
import React from 'react';
import { fetchTransactionRules } from '../../../../../services/transactionRuleService';
import { InitiativeApi } from '../../../../../api/InitiativeApiClient';
import { renderWithProviders } from '../../../../../utils/test-utils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

afterEach(cleanup);

describe('<RefundRules />', () => {
  const setAction = jest.fn();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should render correctly the ShopRules component', async () => {
    await act(async () => {
      renderWithProviders(
        <ShopRules
          action={WIZARD_ACTIONS.DRAFT}
          setAction={setAction}
          currentStep={0}
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //
          }}
          setDisabledNext={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      );
      // expect(setAction.mock.calls.length).toBe(0);
    });
  });

  it('test on handleSubmit', async () => {
    await act(async () => {
      const { debug } = renderWithProviders(
        <ShopRules
          action={WIZARD_ACTIONS.SUBMIT}
          setAction={function (_value: SetStateAction<string>): void {
            //
          }}
          currentStep={1}
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //
          }}
          setDisabledNext={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      );
      await waitFor(() => expect(screen.getByTestId('criteria-button-test')).not.toBeNull());
    });
  });
});
