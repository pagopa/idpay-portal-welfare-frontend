import { Box } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { initiativePagesBreadcrumbsContainerStyle } from '../../../helpers';
import ROUTES from '../../../routes';
import BreadcrumbsBox from '../../components/BreadcrumbsBox';

type Props = {
  t: (key: string) => string;
  initiativeName: string;
};

const RefundBatchesPageHeader = ({ t, initiativeName }: Props) => (
  <Box sx={initiativePagesBreadcrumbsContainerStyle}>
    <BreadcrumbsBox
      backUrl={ROUTES.HOME}
      backLabel={t('breadcrumbs.back')}
      items={[initiativeName, t('breadcrumbs.initiativeRefunds')]}
    />

    <Box sx={{ display: 'grid', gridColumn: 'span 10', mt: 2 }}>
      <TitleBox
        title={t('pages.initiativeRefunds.title')}
        subTitle={t('pages.initiativeRefunds.subtitle')}
        mbTitle={2}
        mtTitle={2}
        mbSubTitle={5}
        variantTitle="h4"
        variantSubTitle="body1"
      />
    </Box>
  </Box>
);

export default RefundBatchesPageHeader;