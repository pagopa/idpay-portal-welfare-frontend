import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { RootState } from '../../redux/store';
import { mockedParties } from '../../services/__mocks__/partyService';

export const verifyMockExecution = (state: RootState) => {
  if (JSON.stringify(state.parties.selected) !== JSON.stringify(mockedParties[0])) {
    throw new Error('withSelectedParty mock verification failed');
  }
};

export default (WrappedComponent: React.ComponentType<any>) => (props: any) => {
const dispatch = useAppDispatch();
useEffect(() => {
dispatch(partiesActions.setPartySelected(mockedParties[0]));
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
return <WrappedComponent {...props} />;
};
