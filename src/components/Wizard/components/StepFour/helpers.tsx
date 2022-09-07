import { AccomulatedTypeEnum } from '../../../../api/generated/initiative/AccumulatedAmountDTO';
import { RefundRuleDTO } from '../../../../api/generated/initiative/RefundRuleDTO';
import { TimeTypeEnum } from '../../../../api/generated/initiative/TimeParameterDTO';
import { RefundRule } from '../../../../model/Initiative';

export const setError = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && Boolean(errorText);

export const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && errorText;

export const mapDataToSend = (values: RefundRule): RefundRuleDTO => {
  const accumulatedTypeBudget = values.accumulatedAmount as AccomulatedTypeEnum.BUDGET_EXHAUSTED;
  const accumulatedTypeThreshold =
    values.accumulatedAmount as AccomulatedTypeEnum.THRESHOLD_REACHED;
  const refundThreshold =
    typeof values.reimbursementThreshold === 'string'
      ? parseFloat(values.reimbursementThreshold)
      : undefined;
  const identificationCode = values.additionalInfo;
  const timeType = values.timeParameter as TimeTypeEnum;
  if (
    values.reimbursmentQuestionGroup === 'true' &&
    values.accumulatedAmount === AccomulatedTypeEnum.THRESHOLD_REACHED
  ) {
    return {
      accumulatedAmount: { accomulatedType: accumulatedTypeThreshold, refundThreshold },
      additionalInfo: { identificationCode },
    };
  } else if (
    values.reimbursmentQuestionGroup === 'true' &&
    values.accumulatedAmount === AccomulatedTypeEnum.BUDGET_EXHAUSTED
  ) {
    return {
      accumulatedAmount: { accomulatedType: accumulatedTypeBudget },
      additionalInfo: { identificationCode },
    };
  } else {
    return {
      timeParameter: { timeType },
      additionalInfo: { identificationCode },
    };
  }
};
