import { FilterOperator } from '../utils/constants';

export type AdmissionCriteriaModel = {
  code: string | undefined;
  authority: string | undefined;
  field: string | undefined;
  checked: boolean;
};

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
