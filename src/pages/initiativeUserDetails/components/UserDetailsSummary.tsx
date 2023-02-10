import { Badge, Box, Card, CardContent, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatIban, formatedCurrency } from '../../../helpers';
import { MockedInstrumentDTO, MockedStatusWallet } from '../../../model/Initiative';
import PaymentMethodsModal from '../PaymentMethodsModal';

type Props = {
  amount: number | undefined;
  refunded: number | undefined;
  accrued: number | undefined;
  walletStatus: MockedStatusWallet | undefined;
  paymentMethodList: Array<MockedInstrumentDTO>;
  iban: string | undefined;
  holderBank: string | undefined;
  checkIbanResponseDate: Date | undefined;
  channel: string | undefined;
};

const UserDetailsSummary = ({
  amount,
  refunded,
  accrued,
  walletStatus,
  paymentMethodList,
  iban,
  holderBank,
  checkIbanResponseDate,
  channel,
}: Props) => {
  const { t } = useTranslation();
  const [openPaymentMethodModal, setOpenPaymentMethodModal] = useState(false);

  const handleOpenPaymentMethodModal = () => {
    if (paymentMethodList.length > 0) {
      setOpenPaymentMethodModal(true);
    }
  };

  const handleClosePaymentMethodModal = () => {
    setOpenPaymentMethodModal(false);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        width: '100%',
        gridTemplateColumns: 'repeat(12, 1fr)',
        alignItems: 'center',
        mt: 2,
      }}
    >
      <Card sx={{ display: 'grid', gridColumn: 'span 12' }}>
        <CardContent
          sx={{
            p: 3,
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignItems: 'center',
            rowGap: 1,
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 6', rowGap: 1 }}>
            <Typography
              sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 6', mb: 1 }}
              variant="overline"
              color="text.secondary"
            >
              {t('pages.initiativeUserDetails.summary')}
            </Typography>
            <Typography
              sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1' }}
              variant="body2"
              color="text.primary"
            >
              {t('pages.initiativeUserDetails.availableBalance')}
            </Typography>
            <Typography
              sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5' }}
              variant="body2"
            >
              {formatedCurrency(amount, '00,00 €')}
            </Typography>
            <Typography
              sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1' }}
              variant="body2"
              color="text.primary"
            >
              {t('pages.initiativeUserDetails.refundedBalance')}
            </Typography>
            <Typography
              sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5' }}
              variant="body2"
            >
              {formatedCurrency(refunded, '00,00 €')}
            </Typography>
            <Typography
              sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1' }}
              variant="body2"
              color="text.primary"
            >
              {t('pages.initiativeUserDetails.balanceToBeRefunded')}
            </Typography>
            <Typography
              sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5' }}
              variant="body2"
            >
              {formatedCurrency(accrued, '00,00 €')}
            </Typography>
            <Typography
              sx={{
                display: 'grid',
                gridColumn: 'span 6',
                mt: 1,
                justifyContent: 'left',
                ml: 1,
              }}
            >
              {paymentMethodList.length > 0 ? (
                <ButtonNaked
                  component="button"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                  startIcon={
                    <Badge color="primary" badgeContent={paymentMethodList.length} sx={{ mr: 1 }} />
                  }
                  onClick={() => handleOpenPaymentMethodModal()}
                >
                  {t('pages.initiativeUserDetails.paymentMethod')}
                </ButtonNaked>
              ) : (
                <>
                  <ButtonNaked
                    component="button"
                    sx={{
                      color: 'error.main',
                      fontWeight: 700,
                      fontSize: '14px',
                    }}
                    onClick={() => handleOpenPaymentMethodModal()}
                    startIcon={
                      <Badge
                        color="error"
                        badgeContent={`${paymentMethodList.length}`}
                        sx={{ mr: 1, '& .MuiBadge-badge': { color: '#FFF' } }}
                      />
                    }
                  >
                    {t('pages.initiativeUserDetails.missingPaymentMethod')}
                  </ButtonNaked>
                </>
              )}
            </Typography>
            {paymentMethodList.length > 0 && (
              <PaymentMethodsModal
                openPaymentMethodModal={openPaymentMethodModal}
                handleClosePaymentMethodModal={handleClosePaymentMethodModal}
                paymentMethodList={paymentMethodList}
              />
            )}
          </Box>
          <Box sx={{ display: 'grid', gridColumn: 'span 6', rowGap: 1 }}>
            <Typography
              sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 6', mb: 1 }}
              variant="overline"
              color="text.secondary"
            >
              {t('pages.initiativeUserDetails.refundDetail')}
            </Typography>
            <Typography
              sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1' }}
              variant="body2"
              color="text.primary"
            >
              {t('pages.initiativeUserDetails.transactionDetail.iban')}
            </Typography>
            <Typography
              sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5' }}
              variant="body2"
              color={
                walletStatus === MockedStatusWallet.NOT_REFUNDABLE ||
                walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT
                  ? 'error'
                  : undefined
              }
            >
              {walletStatus === MockedStatusWallet.NOT_REFUNDABLE ||
              walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT
                ? t('pages.initiativeUserDetails.missingIban')
                : formatIban(iban)}
            </Typography>
            <Typography
              sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1' }}
              variant="body2"
              color="text.primary"
            >
              {t('pages.initiativeUserDetails.transactionDetail.bank')}
            </Typography>
            <Typography
              sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5' }}
              variant="body2"
            >
              {walletStatus === MockedStatusWallet.NOT_REFUNDABLE ||
              walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT
                ? '-'
                : holderBank}
            </Typography>
            <Typography
              sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1' }}
              variant="body2"
              color="text.primary"
            >
              {t('pages.initiativeUserDetails.updatedOn')}
            </Typography>
            <Typography
              sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5' }}
              variant="body2"
            >
              {walletStatus === MockedStatusWallet.NOT_REFUNDABLE ||
              walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT
                ? '-'
                : checkIbanResponseDate
                    ?.toLocaleString('fr-BE')
                    .substring(0, checkIbanResponseDate?.toLocaleString('fr-BE').length - 3)}
            </Typography>
            <Typography
              sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1' }}
              variant="body2"
              color="text.primary"
            >
              {t('pages.initiativeUserDetails.addedBy')}
            </Typography>
            <Typography
              sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5' }}
              variant="body2"
            >
              {walletStatus === MockedStatusWallet.NOT_REFUNDABLE ||
              walletStatus === MockedStatusWallet.NOT_REFUNDABLE_ONLY_INSTRUMENT
                ? '-'
                : channel}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetailsSummary;
