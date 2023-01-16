import { useEffect } from 'react';
import { Grid, Box, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';

declare const OneTrust: any;

export function TOS() {
  const { t } = useTranslation();

  useEffect(() => {
    OneTrust.NoticeApi.Initialized.then(function () {
      OneTrust.NoticeApi.LoadNotices(
        [
          'https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/draft/6240fe7c-a66c-4395-a5c6-f1fee15e8258.json',
        ],
        false
      );
    });
  }, []);

  return (
    <>
      <Grid sx={{ px: 3, py: 3 }}>
        <div id="otnotice-6240fe7c-a66c-4395-a5c6-f1fee15e8258" className="otnotice"></div>
      </Grid>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)' }}>
        <Grid
          sx={{ display: 'grid', gridColumn: 'span 2', mt: 5, justifyContent: 'center' }}
        ></Grid>
        <Grid sx={{ display: 'grid', gridColumn: 'span 10', mt: 5, justifyContent: 'center' }}>
          <Link underline="hover" href={routes.HOME}>
            {t('tos.backHome')}
          </Link>
        </Grid>
      </Box>
    </>
  );
}
