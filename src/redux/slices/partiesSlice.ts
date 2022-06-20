import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { ProductRolesLists, ProductsRolesMap } from '../../model/ProductRole';

interface PartiesState {
  list?: Array<Party>;
  selected?: Party;
  selectedPartyLogoUrl?: string;
  selectedProducts?: Array<Product>;
  selectedProductsRolesMap?: ProductsRolesMap;
}

const initialState: PartiesState = {};

/* eslint-disable functional/immutable-data */
export const partiesSlice = createSlice({
  name: 'parties',
  initialState,
  reducers: {
    setPartiesList: (state, action: PayloadAction<Array<Party>>) => {
      state.list = action.payload;
    },
    setPartySelected: (state, action: PayloadAction<Party | undefined>) => {
      state.selected = action.payload;
      state.selectedPartyLogoUrl = action.payload?.urlLogo;
    },
    setPartySelectedPartyLogo: (state, action: PayloadAction<string | undefined>) => {
      state.selectedPartyLogoUrl = `${action.payload}?${new Date()}`;
      if (state.list) {
        state.list
          .filter((p) => p.partyId === state.selected?.partyId)
          .forEach((p) => (p.urlLogo = state.selectedPartyLogoUrl));
      }
    },
    setPartySelectedProducts: (state, action: PayloadAction<Array<Product> | undefined>) => {
      state.selectedProducts = action.payload;
    },
    setPartySelectedProductsRolesMap: (state, action: PayloadAction<ProductsRolesMap>) => {
      state.selectedProductsRolesMap = action.payload;
    },
    addPartySelectedProductRoles: (state, action: PayloadAction<ProductsRolesMap>) => {
      if (!state.selectedProductsRolesMap) {
        state.selectedProductsRolesMap = {};
      }
      Object.assign(state.selectedProductsRolesMap, action.payload);
    },
  },
});

export const partiesActions = partiesSlice.actions;
export const partiesReducer = partiesSlice.reducer;

export const partiesSelectors = {
  selectPartiesList: (state: RootState): Array<Party> | undefined => state.parties.list,
  selectPartySelected: (state: RootState): Party | undefined => state.parties.selected,
  selectPartySelectedLogo: (state: RootState): string | undefined =>
    state.parties.selectedPartyLogoUrl,
  selectPartySelectedProducts: (state: RootState): Array<Product> | undefined =>
    state.parties.selectedProducts,
  selectPartySelectedProductsRolesMap: (state: RootState): ProductsRolesMap =>
    state.parties.selectedProductsRolesMap ?? {},
  selectPartySelectedProductRoles: (
    state: RootState,
    productId: string
  ): ProductRolesLists | undefined =>
    state.parties.selectedProductsRolesMap
      ? state.parties.selectedProductsRolesMap[productId]
      : undefined,
};
