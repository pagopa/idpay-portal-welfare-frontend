import { useTranslation } from 'react-i18next';
import { Alert, Box, Chip, Divider, Typography } from '@mui/material';
import { usePermissions } from '../../../../hooks/usePermissions';
import { USER_PERMISSIONS } from '../../../../utils/constants';

type Props = {
  fileProcessingOutcomeStatus: string | undefined;
  fileBeneficiaryReached: number | undefined;
};

const BeneficiaryListContentBody = ({
  fileProcessingOutcomeStatus,
  fileBeneficiaryReached,
}: Props) => {
  const { t } = useTranslation();

  const userCanReviewInitiative = usePermissions(USER_PERMISSIONS.REVIEW_INITIATIVE);

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
          rowGap: 2,
          columnGap: 2,
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
          {t('pages.initiativeDetail.accordion.step3.content.beneficiaryNumber')}
        </Typography>
        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
          {fileBeneficiaryReached}
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

        {userCanReviewInitiative && fileProcessingOutcomeStatus === 'PROC_KO' && (
          <Box sx={{ display: 'grid', gridColumn: 'span 12' }}>
            <Alert severity="error" elevation={6}>
              <Typography variant="body2">
                {t('pages.initiativeDetail.accordion.step3.content.fileUploadedErrorMessage')}
              </Typography>
            </Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BeneficiaryListContentBody;
