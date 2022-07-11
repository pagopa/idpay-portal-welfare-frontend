import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  admissionCriteriaActions,
  admissionCriteriaSelectors,
} from '../../redux/slices/admissionCriteriaSlice';
import { RootState } from '../../redux/store';
import { mockedAdmissionCriteria } from '../../services/__mocks__/admissionCriteriaService';

export const verifyMockExecution = (state: RootState) => {
  expect(state.admissionCriteria.list).toMatchObject(mockedAdmissionCriteria);
};

export default (WrappedComponent: React.ComponentType<any>) => (props: any) => {
  const dispatch = useAppDispatch();
  const admissionCriteria = useAppSelector(admissionCriteriaSelectors.selectAdmissionCriteriaList);
  useEffect(() => {
    dispatch(admissionCriteriaActions.setAdmissionCriteriaList(mockedAdmissionCriteria));
  }, []);
  return admissionCriteria ? (
    <WrappedComponent admissionCriteria={admissionCriteria} {...props} />
  ) : (
    <></>
  );
};
