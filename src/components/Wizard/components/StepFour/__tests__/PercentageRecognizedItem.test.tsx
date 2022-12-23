/* eslint-disable react/jsx-no-bind */
import { fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import PercentageRecognizedItem from '../PercentageRecognizedItem';
import React from 'react';
import { renderWithProviders } from '../../../../../utils/test-utils';
import { perRec, shopRulesToSubmit } from './ShopRules.test';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));
window.scrollTo = jest.fn();

describe('<PercentageRecognizedItem />', () => {
  const mockedSetData = jest.fn();
  test('should render correctly the PercentageRecognizedItem component', async () => {
    await act(async () => {
      renderWithProviders(
        <PercentageRecognizedItem
          code={'PRCREC'}
          action={WIZARD_ACTIONS.DRAFT}
          shopRulesToSubmit={shopRulesToSubmit}
          setShopRulesToSubmit={jest.fn()}
          data={perRec}
          setData={mockedSetData}
        />
      );
    });
  });

  it('test PercentageRecognizedItem with data', async () => {
    await act(async () => {
      const { getByTestId } = renderWithProviders(
        <PercentageRecognizedItem
          code={'PRCREC'}
          action={WIZARD_ACTIONS.SUBMIT}
          shopRulesToSubmit={shopRulesToSubmit}
          setShopRulesToSubmit={jest.fn()}
          data={perRec}
          setData={mockedSetData}
        />
      );
      const percetageRecognized = getByTestId('percetage-recognized-value') as HTMLInputElement;

      fireEvent.change(percetageRecognized, {
        target: { value: '1' },
      });

      expect(mockedSetData.mock.calls.length).toEqual(1);
      expect(percetageRecognized).toBeInTheDocument();
    });
  });
});
