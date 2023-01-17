import { useTranslation } from 'react-i18next';
import { Box, Typography, Link } from '@mui/material';
import { TOSAgreement } from '@pagopa/mui-italia';

interface TOSWallProps {
  acceptTOS: () => void;
  tosRoute: string;
  privacyRoute: string;
}

const TOSWall = ({ acceptTOS, tosRoute, privacyRoute }: TOSWallProps) => {
  const { t } = useTranslation();

  return (
    <Box height="100%" width="100%" px={2} sx={{ backgroundColor: '#FAFAFA' }}>
      <TOSAgreement
        sx={{ textAlign: 'center' }}
        productName={t('tos.title')}
        description=""
        onConfirm={() => acceptTOS()}
      >
        <div style={{ marginTop: '-64px' }}>
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
        </div>
      </TOSAgreement>
    </Box>
  );
};

export default TOSWall;
