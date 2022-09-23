import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Divider, Typography } from '@mui/material';
import { Initiative, RefundRule } from '../../../../model/Initiative';

type Props = {
  initiativeDetail: Initiative;
};

const RefundRuleContentBody = ({ initiativeDetail }: Props) => {
  const { t } = useTranslation();

  const printRefundParameterAsString = (refundRule: RefundRule): string => {
    // eslint-disable-next-line functional/no-let
    let dataAsString = '';
    if (refundRule.reimbursmentQuestionGroup === 'true') {
      if (refundRule.accumulatedAmount === 'THRESHOLD_REACHED') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.certainThreshold')}`;
      } else if (refundRule.accumulatedAmount === 'BUDGET_EXHAUSTED') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.balanceExhausted')}`;
      }
    } else {
      if (refundRule.timeParameter === 'CLOSED') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.initiativeDone')}`;
      } else if (refundRule.timeParameter === 'DAILY') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.everyDay')}`;
      } else if (refundRule.timeParameter === 'WEEKLY') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.everyWeek')}`;
      } else if (refundRule.timeParameter === 'MONTHLY') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.everyMonth')}`;
      } else if (refundRule.timeParameter === 'QUARTERLY') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.everyThreeMonths')}`;
      }
    }
    return dataAsString;
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
        {t('pages.initiativeDetail.accordion.step5.content.disbursement')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        {initiativeDetail.refundRule.reimbursmentQuestionGroup === 'true'
          ? t('pages.initiativeDetail.accordion.step5.content.accumulatedAmount')
          : t('pages.initiativeDetail.accordion.step5.content.timeParameter')}
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
        {t('pages.initiativeDetail.accordion.step5.content.timeParam')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        {printRefundParameterAsString(initiativeDetail.refundRule)}
      </Typography>

      {initiativeDetail.refundRule.reimbursmentQuestionGroup === 'true' &&
      initiativeDetail.refundRule.accumulatedAmount === 'THRESHOLD_REACHED' ? (
        <Fragment>
          <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
            {t('pages.initiativeDetail.accordion.step5.content.refundThreshold')}
          </Typography>
          <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
            {`${initiativeDetail.refundRule.reimbursementThreshold} €`}
          </Typography>
        </Fragment>
      ) : null}

      {initiativeDetail.refundRule.additionalInfo !== '' && (
        <Fragment>
          <Typography variant="body1" sx={{ gridColumn: 'span 12', fontWeight: 600, mt: 1 }}>
            {t('pages.initiativeDetail.accordion.step5.content.addtitionalInfo')}
          </Typography>
          <Typography variant="body2" sx={{ gridColumn: 'span 3', pr: 3 }}>
            {t('pages.initiativeDetail.accordion.step5.content.idCode')}
          </Typography>
          <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
            {initiativeDetail.refundRule.additionalInfo}
          </Typography>
        </Fragment>
      )}
    </Box>
  );
};

export default RefundRuleContentBody;
