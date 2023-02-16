/* eslint-disable react/jsx-no-bind */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { InitiativeApiMocked } from '../../../../../api/__mocks__/InitiativeApiClient';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithHistoryAndStore, renderWithProviders } from '../../../../../utils/test-utils';
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
  const mockedFn = jest.fn();
  const setData = jest.fn();

  const setup = () => {
    const utils = render(
      <Provider store={store}>
        <MCCItem
          title={'title'}
          code={'MCC'}
          handleShopListItemRemoved={mockedFn}
          action={WIZARD_ACTIONS.SUBMIT}
          shopRulesToSubmit={shopRulesToSubmit}
          setShopRulesToSubmit={jest.fn()}
          data={mccFilter}
          setData={setData}
        />
      </Provider>
    );
    const mccCodesTextArea = utils.getByTestId('mccCodesTextArea') as HTMLInputElement;
    const selectMerchant = utils.getByTestId('merchantSelect-test') as HTMLSelectElement;
    return {
      mccCodesTextArea,
      selectMerchant,
      ...utils,
    };
  };

  test('should render correctly the MCCItem component with action DRAFT', async () => {
    render(
      <Provider store={store}>
        <MCCItem
          title={'title'}
          code={'MCC'}
          handleShopListItemRemoved={mockedFn}
          action={WIZARD_ACTIONS.DRAFT}
          shopRulesToSubmit={shopRulesToSubmit}
          setShopRulesToSubmit={jest.fn()}
          data={mccFilter}
          setData={setData}
        />
      </Provider>
    );
  });

  test('MCCItems subimt action', async () => {
    renderWithProviders(
      <MCCItem
        title={'title'}
        code={'MCC'}
        handleShopListItemRemoved={mockedFn}
        action={WIZARD_ACTIONS.SUBMIT}
        shopRulesToSubmit={shopRulesToSubmit}
        setShopRulesToSubmit={jest.fn()}
        data={mccFilter}
        setData={setData}
      />
    );

    const deletebtn = screen.getByTestId('delete-button-mcc-test');

    fireEvent.click(deletebtn);
    expect(mockedFn.mock.calls.length).toEqual(1);
  });

  test('mcc Codes to be defined', async () => {
    const { mccCodesTextArea, selectMerchant } = setup();

    fireEvent.change(mccCodesTextArea, { target: { value: '0744' } });
    expect(mccCodesTextArea.value).toBe('0744');

    fireEvent.focus(selectMerchant);
    fireEvent.blur(selectMerchant);
    fireEvent.change(selectMerchant, { target: { value: 'true' } });
    expect(selectMerchant.value).toBe('true');

    fireEvent.focus(selectMerchant);
    fireEvent.blur(selectMerchant);
    fireEvent.change(selectMerchant, { target: { value: 'false' } });
    expect(selectMerchant.value).toBe('false');

    expect(setData).toHaveBeenCalled();
    expect(selectMerchant).toBeDefined();
  });

  test('test catch case api getMccConfig', async () => {
    (InitiativeApiMocked.getMccConfig = async (): Promise<any> =>
      Promise.reject('mocked error response for tests')),
      renderWithHistoryAndStore(
        <MCCItem
          title={'title'}
          code={'MCC'}
          handleShopListItemRemoved={mockedFn}
          action={WIZARD_ACTIONS.SUBMIT}
          shopRulesToSubmit={shopRulesToSubmit}
          setShopRulesToSubmit={jest.fn()}
          data={mccFilter}
          setData={setData}
        />
      );
  });
});
