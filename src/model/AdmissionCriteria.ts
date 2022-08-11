import { FilterOperator } from '../utils/constants';

export interface AdmissionCriteriaModel {
  code: string;
  authority: string;
  field?: string;
  operator: string;
  checked: boolean;
}

export interface AvailableCriteria extends AdmissionCriteriaModel {
  authorityLabel: string;
  fieldLabel: string;
  value: string;
  value2: string;
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
