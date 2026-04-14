import useReduxCachedValue from '@pagopa/selfcare-common-frontend/lib/hooks/useReduxCachedValue';
import { Product } from '../model/Product';
import { useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchProducts } from '../services/productService';

/** A custom hook to fetch current party's products and caching them into redux */
export const useSelectedPartyProducts = (): (() => Promise<Array<Product>>) => {
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  return useReduxCachedValue(
    'PARTIES',
    () => {
      if (!selectedParty?.partyId) {
        console.error(new Error('No party selected!'));
        return Promise.resolve([]);
      }
      return fetchProducts(selectedParty.partyId);
    },
    partiesSelectors.selectPartySelectedProducts,
    partiesActions.setPartySelectedProducts
  );
};
