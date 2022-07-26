import { BeneficiaryTypeEnum, FilterOperator } from '../utils/constants';

export interface GeneralInfo {
  beneficiaryType: BeneficiaryTypeEnum;
  beneficiaryKnown: string | undefined;
  budget: string;
  beneficiaryBudget: string;
  startDate: Date | string | undefined;
  endDate: Date | string | undefined;
  rankingStartDate: Date | string | undefined;
  rankingEndDate: Date | string | undefined;
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
  authority: string | undefined;
  code: string | undefined;
  field: any; // ??? perché nel dto è boolean
  operator: FilterOperator | string | undefined;
  value: string | undefined;
}

export interface Initiative {
  initiativeId: string | undefined;
  organizationId: string | undefined;
  status: string | undefined;
  generalInfo: GeneralInfo;
  additionalInfo: AdditionalInfo;
  beneficiaryRule: {
    selfDeclarationCriteria: Array<
      SelfDeclarationCriteriaMultiItem | SelfDeclarationCriteriaBoolItem
    >;
    automatedCriteria: Array<AutomatedCriteriaItem>;
  };
}
