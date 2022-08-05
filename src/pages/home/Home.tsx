import { Box, Paper } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  return (
    <Box width="100%" px={2}>
      <TitleBox
        title={t('pages.home.title')}
        subTitle={t('pages.home.title')}
        mbTitle={2}
        mtTitle={2}
        mbSubTitle={5}
        variantTitle="h4"
        variantSubTitle="body1"
      />
      <Paper sx={{ padding: '16px' }}>Some content</Paper>
    </Box>
  );
};

export default Home;
