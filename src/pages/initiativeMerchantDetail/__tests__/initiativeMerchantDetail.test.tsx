import React from 'react';
import ROUTES from '../../../routes';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithContext } from '../../../utils/test-utils';
import InitiativeMerchantDetail from '../initiativeMerchantDetail';

window.scrollTo = jest.fn();

const oldWindowLocation = global.window.location;

const mockedLocation = {
  assign: jest.fn(),
  pathname: ROUTES.INITIATIVE_MERCHANT_DETAIL,
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});

afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(cleanup);

describe('test suite for InitativeMerchantDetail ', () => {
  test('render of compoment InitativeMerchantDetail', async () => {
    renderWithContext(<InitiativeMerchantDetail />);
  });

  test('on change of merchant transactions tabs', async () => {
    renderWithContext(<InitiativeMerchantDetail />);

    const currentDiscounts = screen.getByTestId('merchant-transactions-1');
    fireEvent.click(currentDiscounts);

    const processedDiscounts = screen.getByTestId('merchant-transactions-2');
    fireEvent.click(processedDiscounts);
  });
});
