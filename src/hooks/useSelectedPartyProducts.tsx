import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { Product } from '../model/Product';
import { useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchProducts } from '../services/productService';

export const useSelectedPartyProducts = (): (() => Promise<Array<Product>>) => {
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  if (!selectedParty) {
    throw new Error('No party selected!');
  }
  return useReduxCachedValue(
    'PARTIES',
    () => fetchProducts(selectedParty?.partyId),
    partiesSelectors.selectPartySelectedProducts,
    partiesActions.setPartySelectedProducts
  );
};
