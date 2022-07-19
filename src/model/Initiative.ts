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

export interface SelfeclarationCriteriaMultiItem {
  _type: string;
  description: string;
  value: Array<string>;
  code: string;
}

export interface SelfeclarationCriteriaBoolItem {
  _type: string;
  description: string;
  value: boolean;
  code: string;
}

export interface AutomatedCriteriaItem {
  authority: null;
  code: string;
  field: boolean;
  operator: string;
  value: null;
}

export interface Initiative {
  initiativeId: string;
  status: string;
  generalInfo: GeneralInfo;
  additionalInfo: AdditionalInfo;
  beneficiaryRule: {
    selfDeclarationCriteria: Array<
      SelfeclarationCriteriaMultiItem | SelfeclarationCriteriaBoolItem
    >;
    automatedCriteria: Array<AutomatedCriteriaItem>;
  };
}
