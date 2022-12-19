/* eslint-disable react/jsx-no-bind */
import { fireEvent } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import PercentageRecognizedItem from '../PercentageRecognizedItem';
import React from 'react';
import { renderWithProviders } from '../../../../../utils/test-utils';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<PercentageRecognizedItem />', () => {
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should render correctly the PercentageRecognizedItem component', async () => {
    await act(async () => {
      renderWithProviders(
        <PercentageRecognizedItem
          code={'code undefined'}
          action={WIZARD_ACTIONS.DRAFT}
          shopRulesToSubmit={[]}
          setShopRulesToSubmit={function (
            _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
          ): void {
            //
          }}
          data={undefined}
          setData={function (_value: any): void {
            //
          }}
        />
      );
    });
  });

  it('test PercentageRecognizedItem with data', async () => {
    const data = { _type: 'string', rewardValue: 11 };
    await act(async () => {
      const mockedSetData = jest.fn();
      const { getByTestId } = renderWithProviders(
        <PercentageRecognizedItem
          code={'code'}
          action={WIZARD_ACTIONS.SUBMIT}
          shopRulesToSubmit={[
            { code: 'code', dispatched: true },
            { code: 'code', dispatched: true },
          ]}
          setShopRulesToSubmit={function (
            _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
          ): void {
            //
          }}
          data={data}
          setData={mockedSetData}
        />
      );
      const percetageRecognized = getByTestId('percetage-recognized-value') as HTMLInputElement;

      fireEvent.change(percetageRecognized, {
        target: { value: 'percetageRecognized' },
      });

      expect(mockedSetData.mock.calls.length).toEqual(1);
      expect(percetageRecognized).toBeInTheDocument();
    });
  });
});
