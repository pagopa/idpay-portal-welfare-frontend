import { useEffect, useLayoutEffect, useState } from 'react';
import { Grid, Link, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ENV } from '../../utils/env';

import routes from '../../routes';
declare const OneTrust: any;

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    OneTrust.NoticeApi.Initialized.then(function () {
      OneTrust.NoticeApi.LoadNotices([ENV.ONE_TRUST.PRIVACY_POLICY_JSON_URL], false);
    }).finally(() => {
      setContentLoaded(true);
    });
  }, []);

  useLayoutEffect(() => {
    setTimeout(() => {
      const links = document.querySelectorAll('.otnotice-content a');
      links.forEach((l) => {
        const href = l.getAttribute('href');
        if (href?.startsWith('#')) {
          const newHref = `${routes.PRIVACY_POLICY}${href}`;
          l.setAttribute('href', newHref);
        }
      });
    }, 1000);
  }, [contentLoaded]);

  return (
    <>
      <Grid sx={{ px: 3, py: 3 }}>
        <div id={ENV.ONE_TRUST.PRIVACY_POLICY_ID} className="otnotice"></div>
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
};

export default PrivacyPolicy;
