/* eslint-disable react/jsx-no-bind */
import { fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import React from 'react';
import ShopRulesModal from '../ShopRulesModal';
import { renderWithProviders } from '../../../../../utils/test-utils';

jest.mock('../../../../../services/intitativeService');

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<ShopRulesModal />', () => {
  const mockedHandleCloseModal = jest.fn();
  const mockedHandleShopListItemAdded = jest.fn();

  test('should render correctly the ShopRulesModal component', async () => {
    await act(async () => {
      const { getByTestId, debug } = renderWithProviders(
        <ShopRulesModal
          openModal={true}
          handleCloseModal={mockedHandleCloseModal}
          availableShopRules={[
            {
              checked: false,
              code: 'string',
              description: 'string',
              enabled: true,
              title: 'string',
              subtitle: 'string',
            },
            {
              checked: true,
              code: 'string',
              description: 'string',
              enabled: false,
              title: 'string',
              subtitle: 'string',
            },
          ]}
          handleShopListItemAdded={mockedHandleShopListItemAdded}
        />
      );
      // expect(mockedHandleShopListItemAdded.mock.calls.length).toBe(1);
    });
  });
});
