import withRetrievedValue from '@pagopa/selfcare-common-frontend/decorators/withRetrievedValue';
import { useSelectedPartyProducts } from '../hooks/useSelectedPartyProducts';
import { Party } from '../model/Party';
import { Product } from '../model/Product';
import withSelectedParty from './withSelectedParty';

export type WithSelectedPartyProps = {
  party: Party;
  products: Array<Product>;
};

export default function withSelectedPartyProducts<T extends WithSelectedPartyProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<Omit<T, 'products' | 'reload'>, 'party' | 'reload'>> {
  return withSelectedParty(
    withRetrievedValue('products', useSelectedPartyProducts, WrappedComponent)
  );
}
