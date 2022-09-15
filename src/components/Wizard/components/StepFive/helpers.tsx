import { AccumulatedTypeEnum } from '../../../../api/generated/initiative/AccumulatedAmountDTO';
import { InitiativeRefundRuleDTO } from '../../../../api/generated/initiative/InitiativeRefundRuleDTO';
import { TimeTypeEnum } from '../../../../api/generated/initiative/TimeParameterDTO';
import { RefundRule } from '../../../../model/Initiative';

export const setError = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && Boolean(errorText);

export const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && errorText;

export const mapDataToSend = (values: RefundRule): InitiativeRefundRuleDTO => {
  const accumulatedTypeBudget = values.accumulatedAmount as AccumulatedTypeEnum.BUDGET_EXHAUSTED;
  const accumulatedTypeThreshold =
    values.accumulatedAmount as AccumulatedTypeEnum.THRESHOLD_REACHED;
  const refundThreshold =
    typeof values.reimbursementThreshold === 'string'
      ? parseFloat(values.reimbursementThreshold)
      : undefined;
  const identificationCode = values.additionalInfo;
  const timeType = values.timeParameter as TimeTypeEnum;
  if (
    values.reimbursmentQuestionGroup === 'true' &&
    values.accumulatedAmount === AccumulatedTypeEnum.THRESHOLD_REACHED
  ) {
    return {
      accumulatedAmount: { accumulatedType: accumulatedTypeThreshold, refundThreshold },
      additionalInfo: { identificationCode },
    };
  } else if (
    values.reimbursmentQuestionGroup === 'true' &&
    values.accumulatedAmount === AccumulatedTypeEnum.BUDGET_EXHAUSTED
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
