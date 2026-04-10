import { AccumulatedAmountDtoAccumulatedTypeEnum, InitiativeRefundRuleDTO, TimeParameterDtoTimeTypeEnum } from '../../../../api/generated/initiative/apiClient';
import { RefundRule } from '../../../../model/Initiative';

export const setError = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && Boolean(errorText);

export const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && errorText;

export const mapDataToSend = (values: RefundRule): InitiativeRefundRuleDTO => {
  const accumulatedTypeBudget = values.accumulatedAmount as AccumulatedAmountDtoAccumulatedTypeEnum.BUDGET_EXHAUSTED;
  const accumulatedTypeThreshold =
    values.accumulatedAmount as AccumulatedAmountDtoAccumulatedTypeEnum.THRESHOLD_REACHED;
  const refundThreshold =
    typeof values.reimbursementThreshold === 'string'
      ? parseFloat(values.reimbursementThreshold)
      : undefined;
  const identificationCode = values.additionalInfo;
  const timeType = values.timeParameter as TimeParameterDtoTimeTypeEnum;
  if (
    values.reimbursmentQuestionGroup === 'true' &&
    values.accumulatedAmount === AccumulatedAmountDtoAccumulatedTypeEnum.THRESHOLD_REACHED
  ) {
    return {
      accumulatedAmount: { accumulatedType: accumulatedTypeThreshold, refundThreshold },
      additionalInfo: { identificationCode },
    };
  } else if (
    values.reimbursmentQuestionGroup === 'true' &&
    values.accumulatedAmount === AccumulatedAmountDtoAccumulatedTypeEnum.BUDGET_EXHAUSTED
  ) {
    return {
      accumulatedAmount: { accumulatedType: accumulatedTypeBudget },
      additionalInfo: { identificationCode },
    };
  } else {
    return {
      timeParameter: { timeType },
      additionalInfo: { identificationCode },
    };
  }
};
