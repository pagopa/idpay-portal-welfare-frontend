import { matchPath } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ButtonNaked } from '@pagopa/mui-italia';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { MerchantDetailDTO } from '../../api/generated/merchants/MerchantDetailDTO';
import { initiativePagesBreadcrumbsContainerStyle } from '../../helpers';
import BreadcrumbsBox from '../components/BreadcrumbsBox';
import { MerchantStatisticsDTO } from '../../api/generated/merchants/MerchantStatisticsDTO';
import MerchantSummary from './MerchantSummary';
import MerchantTransactions from './MerchantTransactions';
import MerchantTransactionsProcessed from './MerchantTransactionsProcessed';

const InitiativeMerchantDetail = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [merchantDetail, setMerchantDetail] = useState<MerchantDetailDTO | undefined>();
  const [merchantStatistics, setMerchantStatistics] = useState<MerchantStatisticsDTO | undefined>();

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_MERCHANT_DETAIL],
    exact: true,
    strict: false,
  });

  interface MatchParams {
    id: string;
    merchantId: string;
  }

  const { id, merchantId } = (match?.params as MatchParams) || {};

  useEffect(() => {
    setValue(0);
  }, [id, merchantId]);

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ pt: 3 }}>
            <Box>{children}</Box>
          </Box>
        )}
      </div>
    );
  };

  const a11yProps = (index: number) => ({
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Box sx={initiativePagesBreadcrumbsContainerStyle}>
        <BreadcrumbsBox
          backUrl={`${BASE_ROUTE}/esercenti-iniziativa/${id}`}
          backLabel={t('breadcrumbs.back')}
          items={[
            merchantDetail?.initiativeName,
            t('breadcrumbs.initiativeMerchants'),
            merchantDetail?.businessName,
          ]}
        />
        <Box sx={{ display: 'grid', gridColumn: 'span 12', mt: 2, mb: 5 }}>
          <TitleBox
            title={merchantDetail?.businessName || ''}
            subTitle={''}
            mbTitle={0}
            mtTitle={0}
            mbSubTitle={0}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
      </Box>
      <MerchantSummary
        initiativeId={id}
        merchantId={merchantId}
        merchantDetail={merchantDetail}
        setMerchantDetail={setMerchantDetail}
        merchantStatistics={merchantStatistics}
        setMerchantStatistics={setMerchantStatistics}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', mt: 5 }}>
        <Box sx={{ gridColumn: 'span 10', mb: 2 }}>
          <Typography variant="h6">
            {t('pages.initiativeMerchantDetail.eventsListTitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 2', mb: 2, justifyContent: 'end' }}>
          <ButtonNaked
            component="button"
            disabled
            sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
            weight="default"
            size="small"
            startIcon={<FileDownloadIcon />}
          >
            {t('pages.initiativeMerchantDetail.downloadCsvBtn')}
          </ButtonNaked>
        </Box>
        <Box sx={{ gridColumn: 'span 12', height: '100%' }}>
          <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="merchant transactions tabs">
              <Tab
                label={t('pages.initiativeMerchantDetail.currentTransactions')}
                {...a11yProps(0)}
                data-testid="merchant-transactions-1"
              />
              <Tab
                label={t('pages.initiativeMerchantDetail.processedTransactions')}
                {...a11yProps(1)}
                data-testid="merchant-transactions-2"
              />
            </Tabs>
          </Box>
          <Box sx={{ width: '100%' }}>
            <TabPanel value={value} index={0}>
              <MerchantTransactions initiativeId={id} merchantId={merchantId} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <MerchantTransactionsProcessed initiativeId={id} merchantId={merchantId} />
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InitiativeMerchantDetail;
