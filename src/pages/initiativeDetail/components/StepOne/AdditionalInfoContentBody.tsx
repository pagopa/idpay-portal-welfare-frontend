import { Box, Divider, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Initiative } from '../../../../model/Initiative';

type Props = {
  initiativeDetail: Initiative;
};

const AdditionalInfoContentBody = ({ initiativeDetail }: Props) => {
  const { t } = useTranslation();
  const printAssistanceChannelLabel = (type: string): string => {
    switch (type) {
      case 'web':
        return t('pages.initiativeDetail.accordion.step1.content.webUrl');
      case 'mobile':
        return t('pages.initiativeDetail.accordion.step1.content.mobile');
      case 'email':
        return t('pages.initiativeDetail.accordion.step1.content.email');
      default:
        return '';
    }
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
      <Typography variant="body1" sx={{ gridColumn: 'span 12', fontWeight: 600 }}>
        {t('pages.initiativeDetail.accordion.step1.content.description')}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridColumn: 'span 12',
          rowGap: 2,
          columnGap: 3,
          alignItems: 'start',
        }}
      >
        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
          {t('pages.initiativeDetail.accordion.step1.content.serviceDeliver')}
        </Typography>
        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
          {initiativeDetail.additionalInfo.initiativeOnIO
            ? t('pages.initiativeDetail.accordion.step1.content.serviceOnIO')
            : t('pages.initiativeDetail.accordion.step1.content.serviceNotOnIO')}
        </Typography>

        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
          {t('pages.initiativeDetail.accordion.step1.content.serviceName')}
        </Typography>
        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
          {initiativeDetail.additionalInfo.serviceName}
        </Typography>

        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
          {t('pages.initiativeDetail.accordion.step1.content.serviceArea')}
        </Typography>
        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
          {initiativeDetail.additionalInfo.serviceArea === 'NATIONAL'
            ? t('pages.initiativeDetail.accordion.step1.content.serviceAreaNational')
            : t('pages.initiativeDetail.accordion.step1.content.serviceAreaLocal')}
        </Typography>

        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
          {t('pages.initiativeDetail.accordion.step1.content.serviceDescription')}
        </Typography>
        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
          {initiativeDetail.additionalInfo.serviceDescription}
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ gridColumn: 'span 12', fontWeight: 600, mt: 1 }}>
        {t('pages.initiativeDetail.accordion.step1.content.legalInfo')}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridColumn: 'span 12',
          rowGap: 2,
          columnGap: 3,
          alignItems: 'start',
        }}
      >
        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
          {t('pages.initiativeDetail.accordion.step1.content.privacyPolicyURL')}
        </Typography>
        <ButtonNaked
          size="medium"
          href={initiativeDetail.additionalInfo.privacyPolicyUrl}
          target="_blank"
          sx={{ color: 'primary.main', gridColumn: 'span 7', justifyContent: 'start' }}
          weight="default"
        >
          {initiativeDetail.additionalInfo.privacyPolicyUrl}
        </ButtonNaked>
        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
          {t('pages.initiativeDetail.accordion.step1.content.tosURL')}
        </Typography>
        <ButtonNaked
          size="medium"
          href={initiativeDetail.additionalInfo.termsAndConditions}
          target="_blank"
          sx={{ color: 'primary.main', gridColumn: 'span 7', justifyContent: 'start' }}
          weight="default"
        >
          {initiativeDetail.additionalInfo.termsAndConditions}
        </ButtonNaked>
      </Box>
      <Typography variant="body1" sx={{ gridColumn: 'span 12', fontWeight: 600, mt: 1 }}>
        {t('pages.initiativeDetail.accordion.step1.content.assistanceChannels')}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridColumn: 'span 12',
          rowGap: 2,
          columnGap: 3,
          alignItems: 'start',
        }}
      >
        {initiativeDetail.additionalInfo.assistanceChannels.map((a, index) => (
          <Fragment key={index}>
            <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
              {printAssistanceChannelLabel(a.type)}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {a.contact}
            </Typography>
          </Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default AdditionalInfoContentBody;
