/* eslint-disable complexity */
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TagIcon from '@mui/icons-material/Tag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { Dispatch, SetStateAction } from 'react';
import { grey } from '@mui/material/colors';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { ConfigTrxRuleArrayDTO } from '../../../../api/generated/initiative/ConfigTrxRuleArrayDTO';
import { ShopRulesModel } from '../../../../model/ShopRules';
import {
  DaysOfWeekInterval,
  RewardLimit,
  RewardRule,
  Threshold,
  TrxCount,
} from '../../../../model/Initiative';
import { MccFilterDTO } from '../../../../api/generated/initiative/MccFilterDTO';
import {
  InitiativeRewardAndTrxRulesDTO,
  InitiativeRewardTypeEnum,
} from '../../../../api/generated/initiative/InitiativeRewardAndTrxRulesDTO';
import { FrequencyEnum } from '../../../../api/generated/initiative/RewardLimitsDTO';

export const checkThresholdChecked = (thresold: Threshold | undefined): boolean => {
  if (typeof thresold !== undefined) {
    return typeof thresold?.from === 'number' || typeof thresold?.to === 'number';
  }
  return false;
};

export const checkMccFilterChecked = (mccFilter: MccFilterDTO | undefined): boolean => {
  if (typeof mccFilter !== undefined && typeof mccFilter?.values !== undefined) {
    const values = mccFilter?.values || '';
    return values.length > 0;
  }
  return false;
};

export const checkTrxCountChecked = (trxCount: TrxCount | undefined): boolean => {
  if (typeof trxCount !== undefined) {
    return typeof trxCount?.from === 'number' || typeof trxCount?.to === 'number';
  }
  return false;
};

export const checkRewardLimitsChecked = (rewardLimits: Array<RewardLimit> | undefined): boolean => {
  if (typeof rewardLimits !== undefined) {
    // eslint-disable-next-line functional/no-let
    let checked = false;
    rewardLimits?.forEach((r) => {
      checked = checked || typeof r.rewardLimit === 'number';
    });
    return checked;
  }
  return false;
};

export const checkDaysOfWeekIntervalsChecked = (
  daysOfWeekIntervals: Array<DaysOfWeekInterval> | undefined
): boolean => {
  if (typeof daysOfWeekIntervals !== undefined) {
    // eslint-disable-next-line functional/no-let
    let checked = false;
    daysOfWeekIntervals?.forEach((d) => {
      checked = checked || d.startTime.length > 0 || d.endTime.length > 0;
    });
    return checked;
  }
  return false;
};

const makeObject = (r: any, title: string, subtitle: string, enabled: boolean) => ({
  checked: r.checked || false,
  code: r.code,
  description: r.description || '',
  enabled: r.enabled || enabled,
  title,
  subtitle,
});

const makeDefaultObject = () => ({
  checked: false,
  code: '',
  description: '',
  enabled: false,
  title: '',
  subtitle: '',
});

export const mapResponse = (response: ConfigTrxRuleArrayDTO): Array<ShopRulesModel> =>
  response.map((r) => {
    // eslint-disable-next-line no-prototype-builtins
    if (r.hasOwnProperty('code') && typeof r.code !== undefined) {
      switch (r.code) {
        case 'THRESHOLD':
          return makeObject(
            r,
            i18n.t('components.wizard.stepFour.modal.threshold.title'),
            i18n.t('components.wizard.stepFour.modal.threshold.description'),
            true
          );
        case 'MCC':
          return makeObject(
            r,
            i18n.t('components.wizard.stepFour.modal.mcc.title'),
            i18n.t('components.wizard.stepFour.modal.mcc.description'),
            true
          );
        case 'ATECO':
          return makeObject(
            r,
            i18n.t('components.wizard.stepFour.modal.ateco.title'),
            i18n.t('components.wizard.stepFour.modal.ateco.desctiption'),
            false
          );
        case 'TRXCOUNT':
          return makeObject(
            r,
            i18n.t('components.wizard.stepFour.modal.trxCount.title'),
            i18n.t('components.wizard.stepFour.modal.trxCount.description'),
            true
          );
        case 'REWARDLIMIT':
          return makeObject(
            r,
            i18n.t('components.wizard.stepFour.modal.rewardLimit.title'),
            i18n.t('components.wizard.stepFour.modal.rewardLimit.description'),
            true
          );
        case 'DAYHOURSWEEK':
          return makeObject(
            r,
            i18n.t('components.wizard.stepFour.modal.daysHoursWeek.title'),
            i18n.t('components.wizard.stepFour.modal.daysHoursWeek.description'),
            true
          );
        case 'GIS':
          return makeObject(
            r,
            i18n.t('components.wizard.stepFour.modal.gis.title'),
            i18n.t('components.wizard.stepFour.modal.gis.description'),
            false
          );
        default:
          return makeDefaultObject();
      }
    } else {
      return makeDefaultObject();
    }
  });

type Colors =
  | 'inherit'
  | 'disabled'
  | 'action'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
  | undefined;

export const renderShopRuleIcon = (code: string, margin: number, color: Colors) => {
  switch (code) {
    case 'THRESHOLD':
      return <EuroSymbolIcon color={color} sx={{ mr: margin }} />;
    case 'MCC':
      return <CreditCardIcon color={color} sx={{ mr: margin }} />;
    case 'ATECO':
      return <StorefrontIcon color={color} sx={{ mr: margin }} />;
    case 'TRXCOUNT':
      return <TagIcon color={color} sx={{ mr: margin }} />;
    case 'REWARDLIMIT':
      return <CalendarTodayIcon color={color} sx={{ mr: margin }} />;
    case 'DAYHOURSWEEK':
      return <WatchLaterIcon color={color} sx={{ mr: margin }} />;
    case 'GIS':
      return <PinDropIcon color={color} sx={{ mr: margin }} />;
    default:
      return null;
  }
};

export const handleShopRulesToSubmit = (
  shopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }>,
  code: string | undefined
) => {
  const newShopRulesToSubmit: Array<{ code: string | undefined; dispatched: boolean }> = [];
  shopRulesToSubmit.forEach((s) => {
    if (s.code !== code) {
      // eslint-disable-next-line functional/immutable-data
      newShopRulesToSubmit.push(s);
    } else {
      // eslint-disable-next-line functional/immutable-data
      newShopRulesToSubmit.push({ code: s.code, dispatched: true });
    }
  });
  return newShopRulesToSubmit;
};

export const setError = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && Boolean(errorText);

export const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && errorText;

export const mapDataToSend = (
  rewardType: InitiativeRewardTypeEnum,
  rewardRuleData: RewardRule,
  mccFilterData: MccFilterDTO | undefined,
  rewardLimitsData: Array<RewardLimit> | undefined,
  thresholdData: Threshold | undefined,
  trxCountData: TrxCount | undefined,
  daysOfWeekIntervalsData: Array<DaysOfWeekInterval> | undefined
  // eslint-disable-next-line sonarjs/cognitive-complexity
): InitiativeRewardAndTrxRulesDTO => {
  // eslint-disable-next-line functional/no-let, prefer-const
  let body: InitiativeRewardAndTrxRulesDTO = {
    initiativeRewardType: rewardType,
    rewardRule: { ...rewardRuleData },
    trxRule: {},
  };
  const trxRule: any = {
    mccFilter: undefined,
    rewardLimits: undefined,
    threshold: undefined,
    trxCount: undefined,
    daysOfWeek: undefined,
  };
  if (checkMccFilterChecked(mccFilterData)) {
    // eslint-disable-next-line functional/immutable-data
    trxRule.mccFilter = { ...mccFilterData };
  }
  if (checkRewardLimitsChecked(rewardLimitsData) && Array.isArray(rewardLimitsData)) {
    const rewardLimit = rewardLimitsData.map((r) => ({
      frequency: r.frequency as FrequencyEnum,
      rewardLimit: r.rewardLimit as number,
    }));
    // eslint-disable-next-line functional/immutable-data
    trxRule.rewardLimits = [...rewardLimit];
  }
  if (checkThresholdChecked(thresholdData)) {
    const threshold = {
      from: thresholdData?.from as number,
      fromIncluded: thresholdData?.fromIncluded || true,
      to: thresholdData?.to as number,
      toIncluded: thresholdData?.toIncluded || true,
    };
    // eslint-disable-next-line functional/immutable-data
    trxRule.threshold = { ...threshold };
  }
  if (checkTrxCountChecked(trxCountData)) {
    const trxCount = {
      from: trxCountData?.from as number,
      fromIncluded: trxCountData?.fromIncluded || true,
      to: trxCountData?.to as number,
      toIncluded: trxCountData?.to ? trxCountData?.toIncluded || true : undefined,
    };
    // eslint-disable-next-line functional/immutable-data
    trxRule.trxCount = { ...trxCount };
  }
  if (
    checkDaysOfWeekIntervalsChecked(daysOfWeekIntervalsData) &&
    Array.isArray(daysOfWeekIntervalsData)
  ) {
    const dw = daysOfWeekIntervalsData.map((d) => ({
      daysOfWeek: d.daysOfWeek,
      startTime: d.startTime + ':00.000',
      endTime: d.endTime + ':00.000',
    }));
    const daysOfWeek: any = [];
    dw.forEach((d) => {
      // eslint-disable-next-line functional/no-let, prefer-const
      let i = 0;
      // eslint-disable-next-line functional/no-let, prefer-const
      let found = false;
      while (i < daysOfWeek.length && found === false) {
        if (daysOfWeek[i].daysOfWeek.includes(d.daysOfWeek)) {
          found = true;
        }
        i++;
      }
      if (!found) {
        daysOfWeek.push({
          daysOfWeek: [d.daysOfWeek],
          intervals: [{ startTime: d.startTime, endTime: d.endTime }],
        });
      } else {
        const newInterval = { startTime: d.startTime, endTime: d.endTime };
        // eslint-disable-next-line functional/immutable-data
        daysOfWeek[i - 1].intervals = [...daysOfWeek[i - 1].intervals, newInterval];
      }
    });
    // eslint-disable-next-line functional/immutable-data
    trxRule.daysOfWeek = [...daysOfWeek];
  }
  // eslint-disable-next-line functional/immutable-data
  body.trxRule = { ...trxRule };
  return body;
};

export const handleUpdateFromToFieldState = (
  value: string | undefined,
  key: string,
  data: any,
  setData: Dispatch<SetStateAction<any>>
) => {
  const valueNumber = typeof value === 'string' && value.length > 0 ? parseFloat(value) : undefined;
  const newState = { ...data, [key]: valueNumber };
  setData({ ...newState });
};

export const boxItemStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(24, 1fr)',
  alignItems: 'start',
  borderColor: grey.A200,
  borderStyle: 'solid',
  borderWidth: '1px',
  borderRadius: 2,
  my: 3,
  p: 3,
};
