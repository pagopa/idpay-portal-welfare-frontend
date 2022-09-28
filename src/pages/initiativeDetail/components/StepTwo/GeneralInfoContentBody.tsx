import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Initiative } from '../../../../model/Initiative';

type Props = {
  initiativeDetail: Initiative;
};

const GeneralInfoContentBody = ({ initiativeDetail }: Props) => {
  const { t } = useTranslation();
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
        {t('pages.initiativeDetail.accordion.step2.content.beneficiaryType')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        {initiativeDetail.generalInfo.beneficiaryType === 'PF'
          ? t('pages.initiativeDetail.accordion.step2.content.person')
          : t('pages.initiativeDetail.accordion.step2.content.family')}
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
        {t('pages.initiativeDetail.accordion.step2.content.beneficiaryknown')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        {initiativeDetail.generalInfo.beneficiaryKnown === 'true'
          ? t('pages.initiativeDetail.accordion.step2.content.taxCodeList')
          : t('pages.initiativeDetail.accordion.step2.content.manualSelection')}
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
        {t('pages.initiativeDetail.accordion.step2.content.budget')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        {`${initiativeDetail.generalInfo.budget} €`}
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
        {t('pages.initiativeDetail.accordion.step2.content.beneficiaryBudget')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        {`${initiativeDetail.generalInfo.beneficiaryBudget} €`}
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
        {t('pages.initiativeDetail.accordion.step2.content.rankingStartDate')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        {typeof initiativeDetail.generalInfo.rankingStartDate === 'object'
          ? initiativeDetail.generalInfo.rankingStartDate?.toLocaleDateString('fr-BE')
          : '-'}
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
        {t('pages.initiativeDetail.accordion.step2.content.rankingEndDate')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        {typeof initiativeDetail.generalInfo.rankingEndDate === 'object'
          ? initiativeDetail.generalInfo.rankingEndDate?.toLocaleDateString('fr-BE')
          : '-'}
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
        {t('pages.initiativeDetail.accordion.step2.content.startDate')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        {typeof initiativeDetail.generalInfo.startDate === 'object'
          ? initiativeDetail.generalInfo.startDate?.toLocaleDateString('fr-BE')
          : '-'}
      </Typography>

      <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
        {t('pages.initiativeDetail.accordion.step2.content.endDate')}
      </Typography>
      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
        {typeof initiativeDetail.generalInfo.endDate === 'object'
          ? initiativeDetail.generalInfo.endDate?.toLocaleDateString('fr-BE')
          : '-'}
      </Typography>
    </Box>
  );
};

export default GeneralInfoContentBody;