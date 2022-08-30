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
}

export interface AdditionalInfo {
  serviceId: string | undefined;
  serviceName: string | undefined;
  argument: string | undefined;
  description: string | undefined;
  channels: Array<{ type: string; contact: string }>;
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
  multiValue?: Array<string>;
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
  from: number | undefined;
  fromIncluded: boolean;
  to: number | undefined;
  toIncluded: boolean;
}

export interface TrxCount {
  from: number | undefined;
  fromIncluded: boolean;
  to: number | undefined;
  toIncluded: boolean;
}

export interface DaysOfWeekInterval {
  daysOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Initiative {
  initiativeId: string | undefined;
  organizationId: string | undefined;
  status: string | undefined;
  generalInfo: GeneralInfo;
  additionalInfo: AdditionalInfo;
  beneficiaryRule: {
    selfDeclarationCriteria: Array<ManualCriteriaItem>;
    automatedCriteria: Array<AutomatedCriteriaItem>;
  };
  rewardRule: {
    _type: string;
    rewardValue: number | undefined;
  };
  trxRule: {
    mccFilter?: MccFilterDTO;
    rewardLimits?: Array<RewardLimit>;
    threshold?: Threshold | undefined;
    trxCount?: TrxCount | undefined;
    daysOfWeekIntervals: Array<DaysOfWeekInterval>;
  };
}
