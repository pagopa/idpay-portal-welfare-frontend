import { Dispatch, SetStateAction, useEffect } from 'react';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { Box, Divider, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MerchantDetailDTO } from '../../api/generated/merchants/MerchantDetailDTO';
import { MerchantStatisticsDTO } from '../../api/generated/merchants/MerchantStatisticsDTO';
import {
  getMerchantDetail,
  getMerchantInitiativeStatistics,
} from '../../services/merchantsService';
import { formatAddress, formatIban, formatedCurrency } from '../../helpers';
import { merchantSummaryBoxStyle } from './helpers';

type Props = {
  initiativeId: string | undefined;
  merchantId: string | undefined;
  merchantDetail: MerchantDetailDTO | undefined;
  setMerchantDetail: Dispatch<SetStateAction<MerchantDetailDTO | undefined>>;
  merchantStatistics: MerchantStatisticsDTO | undefined;
  setMerchantStatistics: Dispatch<SetStateAction<MerchantStatisticsDTO | undefined>>;
};

const MerchantSummary = ({
  initiativeId,
  merchantId,
  merchantDetail,
  setMerchantDetail,
  merchantStatistics,
  setMerchantStatistics,
}: Props) => {
  const addError = useErrorDispatcher();

  const { t } = useTranslation();

  useEffect(() => {
    setMerchantDetail(undefined);
    setMerchantStatistics(undefined);
    if (typeof initiativeId === 'string' && typeof merchantId === 'string') {
      getMerchantDetail(initiativeId, merchantId)
        .then((response) => {
          setMerchantDetail(response);
        })
        .catch((error) => {
          addError({
            id: 'GET_INITIATIVE_MERCHANT_DETAIL_ERROR',
            blocking: false,
            error,
            techDescription: 'An error occurred getting initiative merchant detail',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        });

      getMerchantInitiativeStatistics(initiativeId, merchantId)
        .then((response) => {
          if (response) {
            setMerchantStatistics(response);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [initiativeId, merchantId]);

  return (
    <Paper
      sx={{
        display: 'grid',
        width: '100%',
        gridTemplateColumns: 'repeat(12, 1fr)',
        alignItems: 'baseline',
        background: 'background.paper',
        p: 3,
        columnGap: 3,
      }}
    >
      <Box sx={merchantSummaryBoxStyle}>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Typography variant="overline" color="text.primary" sx={{ fontWeight: 600 }}>
            {t('pages.initiativeMerchantDetail.refundsStatusTitle')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="body2">{t('pages.initiativeMerchantDetail.totalAmount')}</Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 9' }}>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            {formatedCurrency(merchantStatistics?.amount, '0,00 €')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="body2">
            {t('pages.initiativeMerchantDetail.totalRefunded')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 9' }}>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            {formatedCurrency(merchantStatistics?.refunded, '0,00 €')}
          </Typography>
        </Box>
      </Box>
      <Box sx={merchantSummaryBoxStyle}>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Typography variant="overline" color="text.primary" sx={{ fontWeight: 600 }}>
            {t('pages.initiativeMerchantDetail.refundsDataTitle')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="body2">{t('pages.initiativeMerchantDetail.iban')}</Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 9' }}>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            {formatIban(merchantDetail?.iban)}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ gridColumn: 'span 12', py: 3 }}>
        <Divider />
      </Box>
      <Box
        sx={{
          gridColumn: 'span 12',
          mb: 2,
        }}
      >
        <Typography variant="overline" color="text.primary" sx={{ fontWeight: 600 }}>
          {t('pages.initiativeMerchantDetail.merchantDataTitle')}
        </Typography>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 6',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          rowGap: 2,
        }}
      >
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="body2">
            {t('pages.initiativeMerchantDetail.businessName')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 9' }}>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            {merchantDetail?.businessName}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="body2">{t('pages.initiativeMerchantDetail.fiscalCode')}</Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 9' }}>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            {merchantDetail?.fiscalCode}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="body2">{t('pages.initiativeMerchantDetail.vatNumber')}</Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 9' }}>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            {merchantDetail?.vatNumber}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 6',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          rowGap: 2,
        }}
      >
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="body2">
            {t('pages.initiativeMerchantDetail.legalAddress')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 9' }}>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            {formatAddress(
              merchantDetail?.legalOfficeAddress,
              merchantDetail?.legalOfficeMunicipality,
              merchantDetail?.legalOfficeProvince,
              merchantDetail?.legalOfficeZipCode
            )}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="body2">
            {t('pages.initiativeMerchantDetail.certifiedEmail')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 9' }}>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            {merchantDetail?.certifiedEmail}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default MerchantSummary;
