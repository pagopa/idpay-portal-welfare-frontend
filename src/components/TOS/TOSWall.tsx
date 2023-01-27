import { useTranslation } from 'react-i18next';
import { Box, Typography, Link } from '@mui/material';
import { TOSAgreement } from '@pagopa/mui-italia';

interface TOSWallProps {
  acceptTOS: () => void;
  tosRoute: string;
  privacyRoute: string;
  newVersionAvailable: boolean;
}

const TOSWall = ({ acceptTOS, tosRoute, privacyRoute, newVersionAvailable }: TOSWallProps) => {
  const { t } = useTranslation();

  const description = newVersionAvailable ? (
    <Typography color="text.secondary">{t('tos.termsDescriptionChanged')}</Typography>
  ) : (
    <Typography color="text.secondary">
      {t('tos.termsDescription')}{' '}
      <Link underline="hover" href={tosRoute}>
        {t('tos.linkTos')}
      </Link>{' '}
      {t('tos.termsDescription2')}
      <Link underline="hover" href={privacyRoute}>
        {t('tos.linkPrivacy')}
      </Link>
    </Typography>
  );

  return (
    <Box height="100%" width="100%" px={2} sx={{ backgroundColor: '#FAFAFA' }}>
      <TOSAgreement
        sx={{ textAlign: 'center' }}
        productName={t('tos.title')}
        description={description}
        onConfirm={() => acceptTOS()}
      >
        {null}
      </TOSAgreement>
    </Box>
  );
};

export default TOSWall;
