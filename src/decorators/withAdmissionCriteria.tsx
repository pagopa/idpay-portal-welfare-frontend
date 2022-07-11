import withRetrievedValue from '@pagopa/selfcare-common-frontend/decorators/withRetrievedValue';
import { useAdmissionCriteria } from '../hooks/useAdmissionCriteria';
import { AdmissionCriteria } from '../model/AdmissionCriteria';

export type WithAdmissionCriteriaProps = {
  admissionCriteria: Array<AdmissionCriteria>;
};

export default function withAdmissionCriteria<T extends WithAdmissionCriteriaProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'admissionCriteria' | 'reload'>> {
  return withRetrievedValue('admissionCriteria', useAdmissionCriteria, WrappedComponent);
}
