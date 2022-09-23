import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Divider, Typography } from '@mui/material';
// import StatusChip from '../../../../components/StatusChip/StatusChip';
import { Initiative } from '../../../../model/Initiative';
import { getGroupOfBeneficiaryStatusAndDetail } from '../../../../services/groupsService';

type Props = {
  initiativeDetail: Initiative;
};

const BeneficiaryListContentBody = ({ initiativeDetail }: Props) => {
  const { t } = useTranslation();
  const [fileProcessingOutcomeStatus, setFileProcessingOutcomeStatus] = useState<
    string | undefined
  >(undefined);

  const printBeneficiaryNumberAsString = (totalBudget: string, budgetPerPerson: string): string => {
    const totalBudgetInt = parseInt(totalBudget, 10);
    const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
    return Math.floor(totalBudgetInt / budgetPerPersonInt).toString();
  };

  useEffect(() => {
    if (
      initiativeDetail.generalInfo.beneficiaryKnown === 'true' &&
      typeof initiativeDetail.initiativeId === 'string'
    ) {
      getGroupOfBeneficiaryStatusAndDetail(initiativeDetail.initiativeId)
        .then((res) => {
          setFileProcessingOutcomeStatus(res.status);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [initiativeDetail.generalInfo.beneficiaryKnown, initiativeDetail.initiativeId]);

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
      <Typography variant="body1" sx={{ gridColumn: 'span 12', fontWeight: 600 }}>
        {t('pages.initiativeDetail.accordion.step3.content.beneficiaryList')}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridColumn: 'span 12',
          rowGap: 3,
          columnGap: 2,
          alignItems: 'start',
        }}
      >
        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
          {t('pages.initiativeDetail.accordion.step3.content.beneficiaryNumber')}
        </Typography>
        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
          {printBeneficiaryNumberAsString(
            initiativeDetail.generalInfo.budget,
            initiativeDetail.generalInfo.beneficiaryBudget
          )}
        </Typography>

        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
          {t('pages.initiativeDetail.accordion.step3.content.fileUploadedStatus')}
        </Typography>
        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
          <Chip
            label={t('pages.initiativeDetail.accordion.step3.content.statusOk')}
            color="success"
          />
        </Typography>

        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
          {t('pages.initiativeDetail.accordion.step3.content.fileProcessingStatus')}
        </Typography>
        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
          {fileProcessingOutcomeStatus === 'OK' ? (
            <Chip
              label={t('pages.initiativeDetail.accordion.step3.content.statusOk')}
              color="success"
            />
          ) : fileProcessingOutcomeStatus === 'PROC_KO' ? (
            <Chip
              label={t('pages.initiativeDetail.accordion.step3.content.statusKo')}
              color="error"
            />
          ) : (
            <Chip
              label={t('pages.initiativeDetail.accordion.step3.content.statusLoading')}
              color="warning"
            />
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default BeneficiaryListContentBody;
