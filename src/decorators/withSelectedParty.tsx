import withRetrievedValue from '@pagopa/selfcare-common-frontend/decorators/withRetrievedValue';
import { useSelectedParty } from '../hooks/useSelectedParty';
import { Party } from '../model/Party';

  export type WithSelectedPartyProps = {
    parties: Array<Party>;
  };
  
  export default function withSelectedParty<T extends WithSelectedPartyProps>(
    WrappedComponent: React.ComponentType<T>
  ): React.ComponentType<Omit<T, 'party' | 'reload'>> {
    return withRetrievedValue('party', useSelectedParty, WrappedComponent);
  }
  
