/* eslint-disable no-prototype-builtins */
/* eslint-disable functional/no-let */

import { useLocation } from 'react-router-dom';
import { matchPath } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import ROUTES from '../routes';
import { getInitiativeDetail } from '../services/intitativeService';
import { useAppDispatch } from '../redux/hooks';
import {
  resetInitiative,
  saveApiKeyClientId,
  saveApiKeyClientAssertion,
  saveAutomatedCriteria,
  saveManualCriteria,
  setAdditionalInfo,
  setGeneralInfo,
  setInitiativeId,
  setOrganizationId,
  setStatus,
  saveMccFilter,
  saveRewardLimits,
  saveThreshold,
  saveTrxCount,
  saveDaysOfWeekIntervals,
  setInitiativeRewardType,
  saveRewardRule,
  saveRefundRule,
  setInitiativeCreationDate,
  setInitiativeUpdateDate,
  setInitiativeName,
} from '../redux/slices/initiativeSlice';
import {
  AdditionalInfo,
  AutomatedCriteriaItem,
  GeneralInfo,
  ManualCriteriaItem,
  RefundRule,
  RewardLimit,
} from '../model/Initiative';
import { FrequencyEnum } from '../api/generated/initiative/RewardLimitsDTO';
import { InitiativeRefundRuleDTO } from '../api/generated/initiative/InitiativeRefundRuleDTO';
import { InitiativeDTO } from '../api/generated/initiative/InitiativeDTO';
import { AppDispatch } from '../redux/store';
import { BeneficiaryTypeEnum } from '../api/generated/initiative/InitiativeGeneralDTO';

interface MatchParams {
  id: string;
}

export const useInitiative = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();
  const { t } = useTranslation();
  const setLoading = useLoading('GET_INITIATIVE_DETAIL');

  const match = matchPath(location.pathname, {
    path: [
      ROUTES.INITIATIVE,
      ROUTES.INITIATIVE_OVERVIEW,
      ROUTES.INITIATIVE_DETAIL,
      ROUTES.INITIATIVE_RANKING,
      ROUTES.INITIATIVE_USERS,
      ROUTES.INITIATIVE_REFUNDS,
      ROUTES.INITIATIVE_REFUNDS_OUTCOME,
      ROUTES.INITIATIVE_REFUNDS_DETAIL,
      ROUTES.INITIATIVE_USER_DETAILS,
      ROUTES.INITIATIVE_MERCHANT,
      ROUTES.INITIATIVE_MERCHANT_UPLOAD,
    ],
    exact: true,
    strict: false,
  });

  useEffect(() => {
    // eslint-disable-next-line no-prototype-builtins
    if (match !== null && match.params.hasOwnProperty('id')) {
      const { id } = match.params as MatchParams;
      setLoading(true);
      dispatch(resetInitiative());

      getInitiativeDetail(id)
        .then((response) => {
          dispatch(setInitiativeId(response.initiativeId));
          dispatch(setOrganizationId(response.organizationId));
          dispatch(setStatus(response.status));
          dispatch(setInitiativeName(response.initiativeName));
          dispatch(setInitiativeCreationDate(response.creationDate));
          dispatch(setInitiativeUpdateDate(response.updateDate));
          const additionalInfo = parseAdditionalInfo(response.additionalInfo);
          dispatch(setAdditionalInfo(additionalInfo));
          const generalInfo = parseGeneralInfo(response.general);
          dispatch(setGeneralInfo(generalInfo));
          dispatch(saveApiKeyClientId(response.beneficiaryRule?.apiKeyClientId));
          dispatch(saveApiKeyClientAssertion(response.beneficiaryRule?.apiKeyClientAssertion));
          const automatedCriteria = [...parseAutomatedCriteria(response)];
          dispatch(saveAutomatedCriteria(automatedCriteria));
          const selfDeclarationCriteria = [...parseManualCriteria(response)];
          dispatch(saveManualCriteria(selfDeclarationCriteria));
          if (response.initiativeRewardType) {
            dispatch(setInitiativeRewardType(response.initiativeRewardType));
          }
          parseRewardRule(response, dispatch);
          parseThreshold(response, dispatch);
          parseMccFilter(response, dispatch);
          parseTrxCount(response, dispatch);
          parseRewardLimits(response, dispatch);
          parseDaysOfWeekIntervals(response, dispatch);
          const refundRule = parseRefundRule(response.refundRule);
          dispatch(saveRefundRule(refundRule));
        })
        .catch((error) => {
          addError({
            id: 'GET_INITIATIVE_DETAIL_ERROR',
            blocking: false,
            error,
            techDescription: 'An error occurred getting initiative data',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [location.pathname]);
};

export const parseAdditionalInfo = (data: any): AdditionalInfo => {
  const dataT = {
    initiativeOnIO: false,
    serviceId: '',
    serviceName: '',
    serviceArea: '',
    serviceDescription: '',
    logoFileName: '',
    logoURL: '',
    logoUploadDate: '',
    privacyPolicyUrl: '',
    termsAndConditions: '',
    assistanceChannels: [{ type: 'web', contact: '' }],
  };

  if (typeof data.serviceIO !== 'undefined') {
    // eslint-disable-next-line functional/immutable-data
    dataT.initiativeOnIO = data.serviceIO;
  }
  if(typeof data.serviceId !== 'undefined'){
    // eslint-disable-next-line functional/immutable-data
    dataT.serviceId = data.serviceId;
  }
  if (typeof data.serviceName !== 'undefined') {
    // eslint-disable-next-line functional/immutable-data
    dataT.serviceName = data.serviceName;
  }
  if (typeof data.serviceScope !== 'undefined') {
    // eslint-disable-next-line functional/immutable-data
    dataT.serviceArea = data.serviceScope;
  }
  if (typeof data.description !== 'undefined') {
    // eslint-disable-next-line functional/immutable-data
    dataT.serviceDescription = data.description;
  }
  if (typeof data.privacyLink !== 'undefined') {
    // eslint-disable-next-line functional/immutable-data
    dataT.privacyPolicyUrl = data.privacyLink;
  }
  if (typeof data.tcLink !== 'undefined') {
    // eslint-disable-next-line functional/immutable-data
    dataT.termsAndConditions = data.tcLink;
  }
  if (typeof data.channels !== 'undefined') {
    // eslint-disable-next-line functional/immutable-data
    dataT.assistanceChannels = [...data.channels];
  }
  if (typeof data.logoFileName !== 'undefined') {
    // eslint-disable-next-line functional/immutable-data
    dataT.logoFileName = data.logoFileName;
  }
  if (typeof data.logoURL !== 'undefined') {
    // eslint-disable-next-line functional/immutable-data
    dataT.logoURL = data.logoURL;
  }
  if (typeof data.logoUploadDate !== 'undefined') {
    // eslint-disable-next-line functional/immutable-data
    dataT.logoUploadDate = data.logoUploadDate.toLocaleString('fr-BE');
  }

  return dataT;
};

// eslint-disable-next-line sonarjs/cognitive-complexity, complexity
export const parseGeneralInfo = (data: any): GeneralInfo => {
  const dataT: GeneralInfo = {
    beneficiaryType: BeneficiaryTypeEnum.PF,
    familyUnitComposition: undefined,
    beneficiaryKnown: 'false',
    rankingEnabled: 'false',
    budget: '',
    beneficiaryBudget: '',
    startDate: '',
    endDate: '',
    rankingStartDate: '',
    rankingEndDate: '',
    introductionTextIT: '',
    introductionTextEN: '',
    introductionTextFR: '',
    introductionTextDE: '',
    introductionTextSL: '',
  };

  if (data && Object.keys(data).length !== 0) {
    if (typeof data.beneficiaryType !== undefined) {
      // eslint-disable-next-line functional/immutable-data
      dataT.beneficiaryType =
        data.beneficiaryType === 'PF' ? BeneficiaryTypeEnum.PF : BeneficiaryTypeEnum.NF;
    }

    if (typeof data.familyUnitComposition !== undefined) {
      // eslint-disable-next-line functional/immutable-data
      dataT.familyUnitComposition = data.familyUnitComposition;
    }

    if (typeof data.beneficiaryKnown !== undefined) {
      // eslint-disable-next-line functional/immutable-data
      dataT.beneficiaryKnown = data.beneficiaryKnown === true ? 'true' : 'false';
    }
    if (typeof data.rankingEnabled !== undefined) {
      // eslint-disable-next-line functional/immutable-data
      dataT.rankingEnabled = data.rankingEnabled === true ? 'true' : 'false';
    }
    if (typeof data.budget !== undefined) {
      // eslint-disable-next-line functional/immutable-data
      dataT.budget = data.budget.toString();
    }
    if (typeof data.beneficiaryBudget !== undefined) {
      // eslint-disable-next-line functional/immutable-data
      dataT.beneficiaryBudget = data.beneficiaryBudget.toString();
    }
    if (typeof data.startDate !== undefined) {
      // eslint-disable-next-line functional/immutable-data
      dataT.startDate = data.startDate;
    }
    if (typeof data.endDate !== undefined) {
      // eslint-disable-next-line functional/immutable-data
      dataT.endDate = data.endDate;
    }
    if (typeof data.rankingStartDate !== undefined) {
      // eslint-disable-next-line functional/immutable-data
      dataT.rankingStartDate = data.rankingStartDate;
    }
    if (typeof data.rankingEndDate !== undefined) {
      // eslint-disable-next-line functional/immutable-data
      dataT.rankingEndDate = data.rankingEndDate;
    }

    if (data.descriptionMap) {
      if (data.descriptionMap.it && typeof data.descriptionMap.it !== undefined) {
        // eslint-disable-next-line functional/immutable-data
        dataT.introductionTextIT = data.descriptionMap.it;
      }

      if (data.descriptionMap.en && typeof data.descriptionMap.en !== undefined) {
        // eslint-disable-next-line functional/immutable-data
        dataT.introductionTextEN = data.descriptionMap.en;
      }

      if (data.descriptionMap.fr && typeof data.descriptionMap.fr !== undefined) {
        // eslint-disable-next-line functional/immutable-data
        dataT.introductionTextFR = data.descriptionMap.fr;
      }

      if (data.descriptionMap.de && typeof data.descriptionMap.de !== undefined) {
        // eslint-disable-next-line functional/immutable-data
        dataT.introductionTextDE = data.descriptionMap.de;
      }

      if (data.descriptionMap.sl && typeof data.descriptionMap.sl !== undefined) {
        // eslint-disable-next-line functional/immutable-data
        dataT.introductionTextSL = data.descriptionMap.sl;
      }
    }
  }
  return dataT;
};

export const parseAutomatedCriteria = (response: InitiativeDTO): Array<AutomatedCriteriaItem> => {
  // eslint-disable-next-line functional/no-let
  let automatedCriteria: Array<any> = [];
  if (
    response.beneficiaryRule &&
    response.beneficiaryRule.automatedCriteria &&
    Object.keys(response.beneficiaryRule.automatedCriteria).length !== 0
  ) {
    automatedCriteria = [...response.beneficiaryRule.automatedCriteria];
  }
  return automatedCriteria;
};

export const parseManualCriteria = (response: InitiativeDTO): Array<ManualCriteriaItem> => {
  const selfDeclarationCriteria: Array<ManualCriteriaItem> = [];
  if (
    response.beneficiaryRule &&
    response.beneficiaryRule.selfDeclarationCriteria &&
    Object.keys(response.beneficiaryRule.selfDeclarationCriteria).length !== 0
  ) {
    const manualCriteriaFetched: Array<{
      _type?: string;
      description?: string;
      value?: boolean | Array<string>;
      code?: string;
    }> = [...response.beneficiaryRule.selfDeclarationCriteria];
    manualCriteriaFetched.forEach((m) => {
      if (typeof m.value === 'boolean') {
        // eslint-disable-next-line functional/immutable-data
        selfDeclarationCriteria.push({
          // eslint-disable-next-line no-underscore-dangle
          _type: m._type,
          boolValue: m.value,
          multiValue: [],
          description: m.description || '',
          code: m.code || '',
        });
      } else if (Array.isArray(m.value)) {
        const mValue: Array<{ value: string }> = [];
        m.value.forEach((m) => {
          // eslint-disable-next-line functional/immutable-data
          mValue.push({ value: m });
        });

        // eslint-disable-next-line functional/immutable-data
        selfDeclarationCriteria.push({
          // eslint-disable-next-line no-underscore-dangle
          _type: m._type,
          boolValue: true,
          multiValue: [...mValue],
          description: m.description || '',
          code: m.code || '',
        });
      }
    });
  }
  return selfDeclarationCriteria;
};

export const parseRewardRule = (response: InitiativeDTO, dispatch: AppDispatch): void => {
  if (
    response.rewardRule &&
    typeof response.rewardRule !== undefined &&
    // eslint-disable-next-line no-underscore-dangle
    response.rewardRule._type === 'rewardValue' &&
    // eslint-disable-next-line no-prototype-builtins
    response.rewardRule.hasOwnProperty('rewardValue') &&
    // eslint-disable-next-line no-prototype-builtins
    response.rewardRule.hasOwnProperty('rewardValueType')
  ) {
    const rewardRule = { ...response.rewardRule } as any;
    dispatch(saveRewardRule(rewardRule));
  }
  // TEMP REMOVE LATER elseIf
  //  else if (
  //   response.rewardRule &&
  //   typeof response.rewardRule !== undefined &&
  //   // eslint-disable-next-line no-underscore-dangle
  //   response.rewardRule._type === 'rewardValue' &&
  //   // eslint-disable-next-line no-prototype-builtins
  //   response.rewardRule.hasOwnProperty('rewardValue') &&
  //   // eslint-disable-next-line no-prototype-builtins
  //   !response.rewardRule.hasOwnProperty('rewardValueType')
  // ) {
  //   const rewardRule = { ...response.rewardRule, rewardValueType:RewardValueTypeEnum.PERCENTAGE  } as any;
  //   dispatch(saveRewardRule(rewardRule));
  // }
};

export const parseThreshold = (response: InitiativeDTO, dispatch: AppDispatch): void => {
  if (
    response.trxRule &&
    response.trxRule.threshold &&
    typeof response.trxRule.threshold !== undefined
  ) {
    if (
      response.trxRule.threshold.hasOwnProperty('from') &&
      response.trxRule.threshold.hasOwnProperty('to')
    ) {
      dispatch(saveThreshold(response.trxRule.threshold));
    } else if (
      !response.trxRule.threshold.hasOwnProperty('from') &&
      response.trxRule.threshold.hasOwnProperty('to')
    ) {
      const threshold = {
        ...response.trxRule.threshold,
        from: undefined,
      };
      dispatch(saveThreshold(threshold));
    } else if (
      response.trxRule.threshold.hasOwnProperty('from') &&
      !response.trxRule.threshold.hasOwnProperty('to')
    ) {
      const threshold = {
        ...response.trxRule.threshold,
        to: undefined,
      };
      dispatch(saveThreshold(threshold));
    }
  }
};

export const parseMccFilter = (response: InitiativeDTO, dispatch: AppDispatch): void => {
  if (
    response.trxRule &&
    response.trxRule.mccFilter &&
    typeof response.trxRule.mccFilter !== undefined
  ) {
    dispatch(saveMccFilter(response.trxRule.mccFilter));
  }
};

export const parseTrxCount = (response: InitiativeDTO, dispatch: AppDispatch): void => {
  if (
    response.trxRule &&
    response.trxRule.trxCount &&
    typeof response.trxRule.trxCount !== undefined
  ) {
    if (
      response.trxRule.trxCount.hasOwnProperty('from') &&
      response.trxRule.trxCount.hasOwnProperty('to')
    ) {
      dispatch(saveTrxCount(response.trxRule.trxCount));
    } else if (
      !response.trxRule.trxCount.hasOwnProperty('from') &&
      response.trxRule.trxCount.hasOwnProperty('to')
    ) {
      const trxCount = {
        ...response.trxRule.trxCount,
        from: undefined,
      };
      dispatch(saveTrxCount(trxCount));
    } else if (
      response.trxRule.trxCount.hasOwnProperty('from') &&
      !response.trxRule.trxCount.hasOwnProperty('to')
    ) {
      const trxCount = {
        ...response.trxRule.trxCount,
        to: undefined,
      };
      dispatch(saveTrxCount(trxCount));
    }
  }
};

export const parseRewardLimits = (response: InitiativeDTO, dispatch: AppDispatch): void => {
  if (
    response.trxRule &&
    response.trxRule.rewardLimits &&
    typeof response.trxRule.rewardLimits !== undefined
  ) {
    const rewardLimits: Array<RewardLimit> = [];
    if (response.trxRule.rewardLimits.length > 0) {
      response.trxRule.rewardLimits.forEach((p) => {
        // eslint-disable-next-line functional/immutable-data
        rewardLimits.push({ frequency: p.frequency as string, rewardLimit: p.rewardLimit });
      });
    } else {
      // eslint-disable-next-line functional/immutable-data
      rewardLimits.push({ frequency: FrequencyEnum.DAILY, rewardLimit: undefined });
    }

    dispatch(saveRewardLimits(rewardLimits));
  }
};

export const parseDaysOfWeekIntervals = (response: InitiativeDTO, dispatch: AppDispatch): void => {
  if (
    response.trxRule &&
    response.trxRule.daysOfWeek &&
    typeof response.trxRule.daysOfWeek !== undefined
  ) {
    const daysOfWeek = [...response.trxRule.daysOfWeek];
    // const daysOfWeekIntervals = [...parseDaysOfWeekIntervals(daysOfWeek)];
    const daysOfWeekIntervals: Array<{
      daysOfWeek: string;
      startTime: string;
      endTime: string;
    }> = [];
    daysOfWeek.forEach((d) => {
      const days: Array<string> = [];
      const intervals: Array<{
        startTime: string;
        endTime: string;
      }> = [];
      if (
        d.daysOfWeek &&
        typeof d.daysOfWeek !== undefined &&
        d.intervals &&
        typeof d.intervals !== undefined
      ) {
        d.daysOfWeek.forEach((dd) => {
          // eslint-disable-next-line functional/immutable-data
          days.push(dd);
        });
        d.intervals.forEach((i) => {
          const interval = {
            startTime: i.startTime || '',
            endTime: i.endTime || '',
          };
          // eslint-disable-next-line functional/immutable-data
          intervals.push({ ...interval });
        });
      }
      days.forEach((day) => {
        intervals.forEach((intr) => {
          const element = {
            daysOfWeek: day,
            startTime: intr.startTime.substring(0, 5),
            endTime: intr.endTime.substring(0, 5),
          };
          // eslint-disable-next-line functional/immutable-data
          daysOfWeekIntervals.push({ ...element });
        });
      });
    });

    dispatch(saveDaysOfWeekIntervals(daysOfWeekIntervals));
  }
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const parseRefundRule = (refundRule: InitiativeRefundRuleDTO | undefined): RefundRule => {
  const dataT = {
    reimbursmentQuestionGroup: '',
    timeParameter: '',
    accumulatedAmount: '',
    additionalInfo: '',
    reimbursementThreshold: '',
  };

  if (
    typeof refundRule !== undefined &&
    refundRule?.accumulatedAmount &&
    Object.keys(refundRule?.accumulatedAmount).length !== 0
  ) {
    // eslint-disable-next-line functional/immutable-data
    dataT.accumulatedAmount = refundRule.accumulatedAmount.accumulatedType || '';
    // eslint-disable-next-line functional/immutable-data
    dataT.reimbursementThreshold =
      typeof refundRule.accumulatedAmount.refundThreshold === 'number'
        ? refundRule.accumulatedAmount.refundThreshold.toString()
        : '';
  }

  if (
    typeof refundRule !== undefined &&
    refundRule?.timeParameter &&
    Object.keys(refundRule?.timeParameter).length !== 0
  ) {
    // eslint-disable-next-line functional/immutable-data
    dataT.timeParameter =
      typeof refundRule.timeParameter.timeType !== undefined
        ? (refundRule.timeParameter.timeType as string)
        : '';
  }

  if (
    typeof refundRule !== undefined &&
    refundRule?.additionalInfo &&
    Object.keys(refundRule?.additionalInfo).length !== 0
  ) {
    // eslint-disable-next-line functional/immutable-data
    dataT.additionalInfo =
      typeof refundRule.additionalInfo.identificationCode === 'string'
        ? refundRule.additionalInfo.identificationCode
        : '';
  }

  if (dataT.accumulatedAmount.length > 0 && dataT.timeParameter.length === 0) {
    // eslint-disable-next-line functional/immutable-data
    dataT.reimbursmentQuestionGroup = 'true';
  } else if (dataT.accumulatedAmount.length === 0 && dataT.timeParameter.length > 0) {
    // eslint-disable-next-line functional/immutable-data
    dataT.reimbursmentQuestionGroup = 'false';
  }

  return dataT;
};
