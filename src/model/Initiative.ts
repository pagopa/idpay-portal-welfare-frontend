import { FilterOperator } from '../utils/constants';

export interface GeneralInfo {
  beneficiaryType: string;
  beneficiaryKnown: string;
  budget: string;
  beneficiaryBudget: string;
  startDate: string;
  endDate: string;
  rankingStartDate: string;
  rankingEndDate: string;
}

export interface AdditionalInfo {
  serviceId: string;
  serviceName: string;
  argument: string;
  description: string;
}

export interface SelfDeclarationCriteriaBoolItem {
  _type: string; // option value from the select field "boolean"
  description: string; // value of the input text
  value: boolean;
  code: string; // array index as string
}

export interface SelfDeclarationCriteriaMultiItem {
  _type: string; // option value from the select field "multi"
  description: string; // '' - TODO ask for field to add
  value: Array<string>; // options array
  code: string; // array index as string
}

export interface AutomatedCriteriaItem {
  authority: string;
  code: string;
  field: string;
  operator: FilterOperator;
  value: string;
}

export interface Initiative {
  initiativeId: string;
  status: string;
  generalInfo: GeneralInfo;
  additionalInfo: AdditionalInfo;
  beneficiaryRule: {
    selfDeclarationCriteria: Array<
      SelfDeclarationCriteriaMultiItem | SelfDeclarationCriteriaBoolItem
    >;
    automatedCriteria: Array<AutomatedCriteriaItem>;
  };
}
