import { Box } from '@mui/material';
import { initiativePagesBreadcrumbsContainerStyle } from '../../../helpers';
import ROUTES from '../../../routes';
import BreadcrumbsBox from '../../components/BreadcrumbsBox';

type Props = {
  t: (key: string) => string;
  initiativeName: string;
  initiativeId: string;
  businessName: string;
};

const RefundTransactionsBreadcrumbs = ({ t, initiativeName, initiativeId, businessName }: Props) => (
  <Box sx={initiativePagesBreadcrumbsContainerStyle}>
    <BreadcrumbsBox
      backUrl={ROUTES.INITIATIVE_REFUNDS.replace(':id', initiativeId)}
      backLabel={t('breadcrumbs.back')}
      items={[initiativeName, t('breadcrumbs.initiativeRefunds'), businessName]}
    />
  </Box>
);

export default RefundTransactionsBreadcrumbs;