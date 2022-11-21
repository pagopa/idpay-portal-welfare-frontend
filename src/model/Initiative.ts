import { ServiceScopeEnum } from '../api/generated/initiative/InitiativeAdditionalDTO';
import { MccFilterDTO } from '../api/generated/initiative/MccFilterDTO';
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
  introductionTextIT: string | undefined;
  introductionTextEN: string | undefined;
  introductionTextFR: string | undefined;
  introductionTextDE: string | undefined;
  introductionTextSL: string | undefined;
}

export interface AdditionalInfo {
  initiativeOnIO: boolean | undefined;
  serviceName: string | undefined;
  serviceArea: ServiceScopeEnum | string | undefined;
  logoFileName: string;
  logoURL: string;
  logoUploadDate: string;
  serviceDescription: string | undefined;
  privacyPolicyUrl: string | undefined;
  termsAndConditions: string | undefined;
  assistanceChannels: Array<{ type: string; contact: string }>;
}

export interface SelfDeclarationCriteriaBoolItem {
  _type?: string; // option value from the select field "boolean"
  description?: string; // value of the input text
  value?: boolean;
  code?: string | number; // array index as string
}

export interface SelfDeclarationCriteriaMultiItem {
  _type?: string; // option value from the select field "multi"
  description?: string; // '' - TODO ask for field to add
  value?: Array<string>; // options array
  code?: string | number; // array index as string
}

export interface ManualCriteriaItem {
  _type?: string;
  description: string;
  boolValue?: boolean;
  multiValue?: Array<{ value: string }>;
  code: string;
}

export interface AutomatedCriteriaItem {
  authority?: string | undefined;
  code?: string | undefined;
  field?: string | undefined;
  operator?: FilterOperator | string | undefined;
  value?: string | undefined;
  value2?: string | undefined;
}

export interface MCCFilter {
  allowedList?: boolean | undefined;
  values?: Array<string> | undefined;
}

export interface RewardLimit {
  frequency: string;
  rewardLimit: number | undefined;
}

export interface Threshold {
  from?: number | undefined;
  fromIncluded?: boolean;
  to?: number | undefined;
  toIncluded?: boolean;
}

export interface TrxCount {
  from?: number | undefined;
  fromIncluded?: boolean;
  to?: number | undefined;
  toIncluded?: boolean;
}

export interface DaysOfWeekInterval {
  daysOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface RewardRule {
  _type: string;
  rewardValue: number | undefined;
}

export interface RefundRule {
  reimbursmentQuestionGroup: string;
  timeParameter: string;
  accumulatedAmount: string | undefined;
  additionalInfo: string;
  reimbursementThreshold: string;
}

export interface Initiative {
  initiativeId: string | undefined;
  organizationId: string | undefined;
  status: string | undefined;
  initiativeName: string | undefined;
  creationDate: Date | undefined;
  updateDate: Date | undefined;
  generalInfo: GeneralInfo;
  additionalInfo: AdditionalInfo;
  beneficiaryRule: {
    selfDeclarationCriteria: Array<ManualCriteriaItem>;
    automatedCriteria: Array<AutomatedCriteriaItem>;
  };
  rewardRule: RewardRule;
  trxRule: {
    mccFilter?: MccFilterDTO;
    rewardLimits?: Array<RewardLimit>;
    threshold?: Threshold | undefined;
    trxCount?: TrxCount | undefined;
    daysOfWeekIntervals: Array<DaysOfWeekInterval>;
  };
  refundRule: RefundRule;
}

export const initiativeGeneral2GeneralInfo = (resources: GeneralInfo) => ({
  beneficiaryType: resources.beneficiaryType,
  beneficiaryKnown: resources.beneficiaryKnown,
  budget: resources.budget,
  beneficiaryBudget: resources.beneficiaryBudget,
  startDate: resources.startDate,
  endDate: resources.endDate,
  rankingStartDate: resources.rankingStartDate,
  rankingEndDate: resources.rankingEndDate,
});

export const InitiativeAdditional2AdditionalInfo = (resources: AdditionalInfo) => ({
  initiativeOnIO: resources.initiativeOnIO,
  serviceName: resources.serviceName,
  serviceArea: resources.serviceArea,
  serviceDescription: resources.serviceDescription,
  privacyPolicyUrl: resources.privacyPolicyUrl,
  termsAndConditions: resources.termsAndConditions,
  assistanceChannels: resources.assistanceChannels?.map((r) => ({
    type: r.type,
    contact: r.contact,
  })),
});

export const automatedCriteria2AutomatedCriteriaItem = (resources: AutomatedCriteriaItem) => ({
  authority: resources.authority,
  code: resources.code,
  field: resources.field,
  operator: resources.operator,
  value: resources.value,
  value2: resources.value2,
});

export const Initiative2Initiative = (resources: Initiative) => ({
  initiativeId: resources.initiativeId,
  organizationId: resources.organizationId,
  status: resources.status,
  initiativeName: resources.initiativeName,
  creationDate: resources.creationDate,
  updateDate: resources.updateDate,
  generalInfo: resources.generalInfo,
  additionalInfo: resources.additionalInfo,
  beneficiaryRule: resources.beneficiaryRule,
  rewardRule: resources.rewardRule,
  trxRule: resources.trxRule,
  refundRule: resources.refundRule,
});
