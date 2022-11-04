import { Box, Divider, Typography } from '@mui/material';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { MccFilterDTO } from '../../../../api/generated/initiative/MccFilterDTO';
import {
  DaysOfWeekInterval,
  Initiative,
  RewardLimit,
  RewardRule,
} from '../../../../model/Initiative';

type Props = {
  initiativeDetail: Initiative;
};

const ShopRuleContentBody = ({ initiativeDetail }: Props) => {
  const { t } = useTranslation();

  const printRewardRuleAsString = (rewardRule: RewardRule): string =>
    `${t('pages.initiativeDetail.accordion.step4.content.rewardRuleFixed')} ${
      rewardRule.rewardValue
    }%`;

  const printMccFilterAsString = (mccFilter: MccFilterDTO): string => {
    // eslint-disable-next-line functional/no-let
    let dataAsString = '';
    if (mccFilter.allowedList) {
      dataAsString = `${t('pages.initiativeDetail.accordion.step4.content.everybodyExceptItem')}`;
    } else {
      dataAsString = `${t('pages.initiativeDetail.accordion.step4.content.nobodyExceptItem')}`;
    }
    const mccList = Array.isArray(mccFilter.values) ? mccFilter.values.join(', ') : '';
    return `${dataAsString} ${mccList}`;
  };

  const printTimeLimitAsString = (rewardLimit: RewardLimit): string => {
    const freqLower = rewardLimit.frequency.toLowerCase();
    const freqPlaceholder = `pages.initiativeDetail.accordion.step4.content.${freqLower}`;
    return `${t(freqPlaceholder)} ${rewardLimit.rewardLimit} €`;
  };

  const printTransactionTimeAsString = (daysOfWeekInterval: DaysOfWeekInterval): string => {
    const dayLower = daysOfWeekInterval.daysOfWeek.toLowerCase();
    const dayPlaceholder = `pages.initiativeDetail.accordion.step4.content.${dayLower}`;
    return `${t(dayPlaceholder)} ${t(
      'pages.initiativeDetail.accordion.step4.content.timeInterval',
      { minTime: daysOfWeekInterval.startTime, maxTime: daysOfWeekInterval.endTime }
    )}`;
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        rowGap: 2,
        pb: 2,
        px: 2,
      }}
    >
      <Divider sx={{ gridColumn: 'span 12', mb: 1 }} />
      <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
        {t('pages.initiativeDetail.accordion.step4.content.percentageRecognized')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        {printRewardRuleAsString(initiativeDetail.rewardRule)}
      </Typography>

      {typeof initiativeDetail.trxRule.threshold?.from === 'number' &&
        typeof initiativeDetail.trxRule.threshold?.to === 'number' && (
          <Fragment>
            <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
              {t('pages.initiativeDetail.accordion.step4.content.spentLimit')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {t('pages.initiativeDetail.accordion.step4.content.threshold', {
                minValue: initiativeDetail.trxRule.threshold.from,
                maxValue: initiativeDetail.trxRule.threshold.to,
              })}
            </Typography>
          </Fragment>
        )}

      {initiativeDetail.trxRule.mccFilter &&
        typeof initiativeDetail.trxRule.mccFilter !== undefined &&
        Array.isArray(initiativeDetail.trxRule.mccFilter.values) &&
        initiativeDetail.trxRule.mccFilter.values.length > 0 && (
          <Fragment>
            <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
              {t('pages.initiativeDetail.accordion.step4.content.mcc')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {printMccFilterAsString(initiativeDetail.trxRule.mccFilter)}
            </Typography>
          </Fragment>
        )}

      {typeof initiativeDetail.trxRule.trxCount?.from === 'number' &&
        typeof initiativeDetail.trxRule.trxCount?.to === 'number' && (
          <Fragment>
            <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
              {t('pages.initiativeDetail.accordion.step4.content.transactionNumber')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {t('pages.initiativeDetail.accordion.step4.content.transactionNumberInterval', {
                minValue: initiativeDetail.trxRule.trxCount.from,
                maxValue: initiativeDetail.trxRule.trxCount.to,
              })}
            </Typography>
          </Fragment>
        )}

      {initiativeDetail.trxRule.rewardLimits?.map((rl, index) =>
        typeof rl.rewardLimit === 'number' ? (
          <Fragment key={index}>
            {index === 0 ? (
              <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                {t('pages.initiativeDetail.accordion.step4.content.timeLimit')}
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ gridColumn: 'span 3' }}></Typography>
            )}
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {printTimeLimitAsString(rl)}
            </Typography>
          </Fragment>
        ) : null
      )}

      {initiativeDetail.trxRule.daysOfWeekIntervals.map((dw, index) =>
        dw.startTime !== '' && dw.endTime !== '' ? (
          <Fragment key={index}>
            {index === 0 ? (
              <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                {t('pages.initiativeDetail.accordion.step4.content.transactionTime')}
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ gridColumn: 'span 3' }}></Typography>
            )}
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {printTransactionTimeAsString(dw)}
            </Typography>
          </Fragment>
        ) : null
      )}
    </Box>
  );
};

export default ShopRuleContentBody;
