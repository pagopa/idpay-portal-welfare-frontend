/* eslint-disable no-prototype-builtins */
/* eslint-disable functional/no-let */
/* eslint-disable complexity */
import { useLocation } from 'react-router-dom';
import { matchPath } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import ROUTES from '../routes';
import { getInitiativeDetail } from '../services/intitativeService';
import { useAppDispatch } from '../redux/hooks';
import {
  resetInitiative,
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
  saveRewardRule,
} from '../redux/slices/initiativeSlice';
import {
  AdditionalInfo,
  AutomatedCriteriaItem,
  DaysOfWeekInterval,
  GeneralInfo,
  ManualCriteriaItem,
  RewardLimit,
} from '../model/Initiative';
import { FrequencyEnum } from '../api/generated/initiative/RewardLimitsDTO';
import { BeneficiaryTypeEnum } from '../utils/constants';
import { DayConfig } from '../api/generated/initiative/DayConfig';

interface MatchParams {
  id: string;
}

export const useInitiative = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();
  const { t } = useTranslation();

  const match = matchPath(location.pathname, {
    path: ROUTES.INITIATIVE,
    exact: true,
    strict: false,
  });
  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    // eslint-disable-next-line no-prototype-builtins
    if (match !== null && match.params.hasOwnProperty('id')) {
      const { id } = match.params as MatchParams;

      getInitiativeDetail(id)
        .then((response) => {
          dispatch(resetInitiative());
          dispatch(setInitiativeId(response.initiativeId));
          dispatch(setOrganizationId(response.organizationId));
          dispatch(setStatus(response.status));
          const generalInfo = parseGeneralInfo(response.general);
          dispatch(setGeneralInfo(generalInfo));
          const additionalInfo = parseAdditionalInfo(response.additionalInfo);
          dispatch(setAdditionalInfo(additionalInfo));
          // eslint-disable-next-line functional/no-let
          let automatedCriteria: Array<AutomatedCriteriaItem> = [];
          // eslint-disable-next-line functional/no-let
          let selfDeclarationCriteria: Array<ManualCriteriaItem> = [];
          if (
            response.beneficiaryRule &&
            response.beneficiaryRule.automatedCriteria &&
            Object.keys(response.beneficiaryRule.automatedCriteria).length !== 0
          ) {
            automatedCriteria = [...response.beneficiaryRule.automatedCriteria];
          }

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
            selfDeclarationCriteria = [...parseManualCriteria(manualCriteriaFetched)];
          }
          dispatch(saveAutomatedCriteria(automatedCriteria));
          dispatch(saveManualCriteria(selfDeclarationCriteria));

          if (
            response.rewardRule &&
            typeof response.rewardRule !== undefined &&
            // eslint-disable-next-line no-underscore-dangle
            response.rewardRule._type === 'rewardValue' &&
            // eslint-disable-next-line no-prototype-builtins
            response.rewardRule.hasOwnProperty('rewardValue')
          ) {
            const rewardRule = { ...response.rewardRule } as any;
            dispatch(saveRewardRule(rewardRule));
          }
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

          if (
            response.trxRule &&
            response.trxRule.mccFilter &&
            typeof response.trxRule.mccFilter !== undefined
          ) {
            dispatch(saveMccFilter(response.trxRule.mccFilter));
          }

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
              dispatch(saveThreshold(trxCount));
            } else if (
              response.trxRule.trxCount.hasOwnProperty('from') &&
              !response.trxRule.trxCount.hasOwnProperty('to')
            ) {
              const trxCount = {
                ...response.trxRule.trxCount,
                to: undefined,
              };
              dispatch(saveThreshold(trxCount));
            }
          }

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

          if (
            response.trxRule &&
            response.trxRule.daysOfWeek &&
            typeof response.trxRule.daysOfWeek !== undefined
          ) {
            const daysOfWeek = [...response.trxRule.daysOfWeek];
            const daysOfWeekIntervals = [...parseDaysOfWeekIntervals(daysOfWeek)];
            dispatch(saveDaysOfWeekIntervals(daysOfWeekIntervals));
          }
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
        });
    }
  }, []);
};

const parseGeneralInfo = (data: any): GeneralInfo => {
  const dataT = {
    beneficiaryType: BeneficiaryTypeEnum.PF,
    beneficiaryKnown: 'false',
    budget: '',
    beneficiaryBudget: '',
    startDate: '',
    endDate: '',
    rankingStartDate: '',
    rankingEndDate: '',
  };
  if (typeof data.beneficiaryType !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.beneficiaryType =
      data.beneficiaryType === 'PF' ? BeneficiaryTypeEnum.PF : BeneficiaryTypeEnum.PG;
  }
  if (typeof data.beneficiaryKnown !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.beneficiaryKnown = data.beneficiaryKnown === true ? 'true' : 'false';
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
  return dataT;
};

const parseAdditionalInfo = (data: any): AdditionalInfo => {
  const dataT = {
    serviceId: '',
    serviceName: '',
    argument: '',
    description: '',
    channels: [{ type: 'web', contact: '' }],
  };

  if (typeof data.serviceId !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.serviceId = data.serviceId;
  }
  if (typeof data.serviceName !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.serviceName = data.serviceName;
  }
  if (typeof data.argument !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.argument = data.argument;
  }
  if (typeof data.description !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.description = data.description;
  }
  if (typeof data.channels !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.channels = [...data.channels];
  }

  return dataT;
};

const parseManualCriteria = (
  manualCriteriaFetched: Array<{
    _type?: string;
    description?: string;
    value?: boolean | Array<string>;
    code?: string;
  }>
): Array<ManualCriteriaItem> => {
  const selfDeclarationCriteria: Array<ManualCriteriaItem> = [];
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
      // eslint-disable-next-line functional/immutable-data
      selfDeclarationCriteria.push({
        // eslint-disable-next-line no-underscore-dangle
        _type: m._type,
        boolValue: true,
        multiValue: [...m.value],
        description: m.description || '',
        code: m.code || '',
      });
    }
  });
  return selfDeclarationCriteria;
};

const parseDaysOfWeekIntervals = (daysOfWeek: Array<DayConfig>): Array<DaysOfWeekInterval> => {
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
  return daysOfWeekIntervals;
};
