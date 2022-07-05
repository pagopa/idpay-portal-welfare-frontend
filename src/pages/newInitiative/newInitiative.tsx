import { Box } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import Wizard from '../../components/Wizard/Wizard';

const NewInitiative = () => {
  const { t } = useTranslation();
  return (
    <Box width="100%" px={2}>
      <TitleBox
        title={t('pages.newInitiative.title')}
        subTitle={t('pages.newInitiative.subtitle')}
        mbTitle={2}
        mtTitle={2}
        mbSubTitle={5}
        variantTitle="h4"
        variantSubTitle="body1"
      />
      <Wizard />
    </Box>
  );
};
export default NewInitiative;
