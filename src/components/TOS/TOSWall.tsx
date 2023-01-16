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
  // console.log(tosRoute);
  // console.log(privacyRoute);

  return (
    <Box height="100%" width="100%" px={2} sx={{ backgroundColor: '#FAFAFA' }}>
      <TOSAgreement
        productName={t('tos.title')}
        description={t('tos.description')}
        onConfirm={() => acceptTOS()}
      >
        <Typography sx={{ px: 8 }} color="text.secondary">
          {t('tos.termsDescription')}
        </Typography>
        <Link underline="hover" href={privacyRoute}>
          {t('tos.linkPrivacy')}
        </Link>
        <Typography sx={{ px: 8 }} color="text.secondary">
          {t('tos.congiunction')}
        </Typography>
        <Link underline="hover" href={tosRoute}>
          {t('tos.linkTos')}
        </Link>
        <Typography sx={{ px: 8 }} color="text.secondary">
          {t('tos.pagoPa')}
        </Typography>
      </TOSAgreement>
    </Box>
  );
};

export default TOSWall;
