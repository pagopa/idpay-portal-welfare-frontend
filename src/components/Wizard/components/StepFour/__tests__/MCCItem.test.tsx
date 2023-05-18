/* eslint-disable react/jsx-no-bind */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { ConfigMccArrayDTO } from '../../../../../api/generated/initiative/ConfigMccArrayDTO';
import { InitiativeApiMocked } from '../../../../../api/__mocks__/InitiativeApiClient';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithHistoryAndStore } from '../../../../../utils/test-utils';
import MCCItem from '../MCCItem';
import { mccFilter, shopRulesToSubmit } from './ShopRules.test';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

window.scrollTo = jest.fn();

describe('<MCCItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  test('test MCCItem with no action', async () => {
    render(
      <Provider store={store}>
        <MCCItem
          title={'title'}
          code={'MCC'}
          handleShopListItemRemoved={jest.fn()}
          action={''}
          shopRulesToSubmit={shopRulesToSubmit}
          setShopRulesToSubmit={jest.fn()}
          data={mccFilter}
          setData={jest.fn()}
        />
      </Provider>
    );
  });

  test('Test MCCItem codes onChange', async () => {
    renderWithHistoryAndStore(
      <MCCItem
        title={'title'}
        code={'MCC'}
        handleShopListItemRemoved={jest.fn()}
        action={WIZARD_ACTIONS.SUBMIT}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={mccFilter}
        setData={jest.fn()}
      />
    );

    const mccCodesTextArea = screen.getByTestId('mccCodesTextArea') as HTMLInputElement;
    fireEvent.change(mccCodesTextArea, { target: { value: '0742 0743 0744' } });

    const selectMerchant = screen.getByTestId('merchantSelect-test') as HTMLSelectElement;
    fireEvent.click(selectMerchant);
    fireEvent.change(selectMerchant, { target: { value: 'true' } });
    fireEvent.blur(selectMerchant);

    fireEvent.click(selectMerchant);
    fireEvent.blur(selectMerchant);
    fireEvent.change(selectMerchant, { target: { value: 'false' } });

    const deletebtn = screen.getByTestId('delete-button-mcc-test');
    fireEvent.click(deletebtn);
  });

  test('Test MCCItem codes with shopRulesToSubmit and data undefined', async () => {
    const shopRulesToSubmitMccTrue = [{ code: undefined, dispatched: false }];
    renderWithHistoryAndStore(
      <MCCItem
        title={'title'}
        code={'MCC'}
        handleShopListItemRemoved={jest.fn()}
        action={WIZARD_ACTIONS.SUBMIT}
        shopRulesToSubmit={shopRulesToSubmitMccTrue}
        setShopRulesToSubmit={jest.fn()}
        data={undefined}
        setData={jest.fn()}
      />
    );
  });

  test('test catch case api getMccConfig', async () => {
    InitiativeApiMocked.getMccConfig = async (): Promise<ConfigMccArrayDTO> =>
      Promise.reject('mocked error response for tests');
    renderWithHistoryAndStore(
      <MCCItem
        title={'title'}
        code={'MCC'}
        handleShopListItemRemoved={jest.fn()}
        action={WIZARD_ACTIONS.DRAFT}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={mccFilter}
        setData={jest.fn()}
      />
    );
  });
});
