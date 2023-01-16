import { useEffect } from 'react';
import { Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
declare const OneTrust: any;

export function PrivacyPolicy() {
  const { t } = useTranslation();

  useEffect(() => {
    OneTrust.NoticeApi.Initialized.then(function () {
      OneTrust.NoticeApi.LoadNotices(
        [
          'https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/draft/5b7fed3e-ea34-4620-b01d-b17fa7c88441.json',
        ],
        false
      );
    });
  }, []);

  return (
    <Grid container>
      <Grid item xs={8} sx={{ px: 3, py: 3 }}>
        <TitleBox
          title={t('tos.title')}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={6}
          variantTitle="h4"
          variantSubTitle="body1"
        />

        <div id="otnotice-5b7fed3e-ea34-4620-b01d-b17fa7c88441" className="otnotice"></div>
      </Grid>
    </Grid>
  );
}
