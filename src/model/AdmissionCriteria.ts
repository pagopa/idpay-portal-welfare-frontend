import { IseeTypologyEnum } from '../components/Wizard/components/StepThree/helpers';
import { FilterOperator } from '../utils/constants';

export interface AdmissionCriteriaModel {
  code: string;
  authority: string;
  field?: string;
  operator: string;
  checked?: boolean;
}

export interface AvailableCriteria extends AdmissionCriteriaModel {
  authorityLabel: string;
  fieldLabel: string;
  value: string;
  value2: string;
  orderDirection?: string;
  iseeTypes?: Array<{ value: IseeTypologyEnum; label: string }>;
}

export interface DateOfBirthModel {
  dateOfBirthSelect: number;
  dateOfBirthRelationSelect: FilterOperator;
  dateOfBirthStartValue: string;
  dateOfBirthEndValue: string;
}

export interface ResidencyModel {
  residencySelect: number;
  residencyRelationSelect: FilterOperator;
  residencyValue: string;
}

export interface IseeModel {
  iseeRelationSelect: FilterOperator;
  iseeStartValue: string;
  iseeEndValue: string;
}

export const admissionCriteria2AdmissionCriteriaModel = (resources: AdmissionCriteriaModel) => ({
  code: resources.code,
  authority: resources.authority,
  field: resources.field,
  operator: resources.operator,
  checked: resources.checked,
});

export const availableCriteria2AvailableCriteriaModel = (resources: AvailableCriteria) => ({
  authorityLabel: resources.authorityLabel,
  fieldLabel: resources.fieldLabel,
  value: resources.value,
  value2: resources.value2,
  code: resources.code,
  authority: resources.authority,
  operator: resources.operator,
});

export const dateOfBirth2DateOfBirthModel = (resources: DateOfBirthModel) => ({
  dateOfBirthSelect: resources.dateOfBirthSelect,
  dateOfBirthRelationSelect: resources.dateOfBirthRelationSelect,
  dateOfBirthStartValue: resources.dateOfBirthStartValue,
  dateOfBirthEndValue: resources.dateOfBirthEndValue,
});

export const residency2ResidencyModel = (resources: ResidencyModel) => ({
  residencySelect: resources.residencySelect,
  residencyRelationSelect: resources.residencyRelationSelect,
  residencyValue: resources.residencyValue,
});

export const isee2IseeModel = (resources: IseeModel) => ({
  iseeRelationSelect: resources.iseeRelationSelect,
  iseeStartValue: resources.iseeStartValue,
  iseeEndValue: resources.iseeEndValue,
});
