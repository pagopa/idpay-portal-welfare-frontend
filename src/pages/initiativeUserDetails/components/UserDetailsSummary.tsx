import { Alert, Badge, Box, Card, CardContent, Snackbar, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InitiativeRewardTypeEnum } from '../../../api/generated/initiative/InitiativeDTO';
import { BeneficiaryTypeEnum } from '../../../api/generated/initiative/InitiativeGeneralDTO';
import { InstrumentDTO } from '../../../api/generated/initiative/InstrumentDTO';
import { StatusEnum as OnboardingStatusEnum } from '../../../api/generated/initiative/OnboardingStatusDTO';
import { StatusEnum } from '../../../api/generated/initiative/WalletDTO';
import { formatIban, formatedCurrency, mappedChannel } from '../../../helpers';
import { useAppSelector } from '../../../redux/hooks';
import {
  initiativeRewardTypeSelector,
  stepTwoBeneficiaryTypeSelector,
} from '../../../redux/slices/initiativeSlice';
import { getIban, getInstrumentList, getWalletDetail } from '../../../services/intitativeService';
import PaymentMethodsModal from '../PaymentMethodsModal';

type Props = {
  id: string;
  cf: string;
  statusOnb: OnboardingStatusEnum | undefined;
  holderBank: string | undefined;
  setHolderBank: Dispatch<SetStateAction<string | undefined>>;
};

const UserDetailsSummary = ({ id, cf, statusOnb, holderBank, setHolderBank }: Props) => {
  const { t } = useTranslation();
  const [openPaymentMethodModal, setOpenPaymentMethodModal] = useState(false);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [accrued, setAccrued] = useState<number | undefined>(undefined);
  const [refunded, setRefunded] = useState<number | undefined>(undefined);
  const [iban, setIban] = useState<string | undefined>(undefined);
  const [walletStatus, setWalletStatus] = useState<StatusEnum | undefined>(undefined);
  const [lastCounterUpdate, setLastCounterUpdate] = useState<Date | undefined>(undefined);
  const [checkIbanResponseDate, setCheckIbanResponseDate] = useState<Date | undefined>(undefined);
  const [channel, setChannel] = useState<string | undefined>(undefined);
  const [paymentMethodList, setPaymentMethodList] = useState<Array<InstrumentDTO>>([]);
  const [openSnackBarOnBoardingStatus, setOpenSnackBarOnBoardingStatus] = useState(false);
  const addError = useErrorDispatcher();
  const initiativeRewardType = useAppSelector(initiativeRewardTypeSelector);
  const beneficiaryType = useAppSelector(stepTwoBeneficiaryTypeSelector);

  useEffect(() => {
    if (
      typeof id === 'string' &&
      typeof cf === 'string' &&
      (statusOnb === OnboardingStatusEnum.ONBOARDING_OK ||
        statusOnb === OnboardingStatusEnum.UNSUBSCRIBED ||
        statusOnb === OnboardingStatusEnum.SUSPENDED)
    ) {
      getWalletDetail(id, cf)
        .then((res) => {
          setAmount(res.amount);
          setAccrued(res.accrued);
          setRefunded(res.refunded);
          if (typeof res.lastCounterUpdate === 'object') {
            setLastCounterUpdate(res.lastCounterUpdate);
          }
          setIban(res.iban);
          setWalletStatus(res.status);
        })
        .catch((error) =>
          addError({
            id: 'GET_WALLET_INFO',
            blocking: false,
            error,
            techDescription: 'An error occurred getting wallet info',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          })
        );
    }
    HandleOpenSnackBarOnBoardingStatus();
  }, [id, cf, statusOnb]);

  useEffect(() => {
    if (
      initiativeRewardType === InitiativeRewardTypeEnum.REFUND &&
      typeof id === 'string' &&
      typeof cf === 'string' &&
      (statusOnb === OnboardingStatusEnum.ONBOARDING_OK ||
        statusOnb === OnboardingStatusEnum.UNSUBSCRIBED ||
        statusOnb === OnboardingStatusEnum.SUSPENDED)
    ) {
      getInstrumentList(id, cf)
        .then((res) => {
          const walletInst = res.instrumentList.filter(
            (r: { status: string }) => r.status === 'ACTIVE'
          );
          setPaymentMethodList([...walletInst]);
        })
        .catch((error) =>
          addError({
            id: 'GET_WALLET_INSTRUMENT',
            blocking: false,
            error,
            techDescription: 'An error occurred getting wallet instrument',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          })
        );
    }
  }, [id, cf, statusOnb, initiativeRewardType]);

  useEffect(() => {
    if (typeof iban === 'string' && initiativeRewardType === InitiativeRewardTypeEnum.REFUND) {
      getIban(id, cf, iban)
        .then((res) => {
          if (typeof res.iban === 'string') {
            setIban(iban);
          }
          if (typeof res.holderBank === 'string') {
            setHolderBank(res.holderBank);
          }
          if (typeof res.checkIbanResponseDate === 'object') {
            setCheckIbanResponseDate(res.checkIbanResponseDate);
          }
          if (typeof res.channel === 'string') {
            setChannel(res.channel);
          }
        })
        .catch((error) => {
          addError({
            id: 'GET_WALLET_INFO',
            blocking: false,
            error,
            techDescription: 'An error occurred getting wallet info',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        });
    }
  }, [iban, initiativeRewardType]);

  const handleOpenPaymentMethodModal = () => {
    if (paymentMethodList.length > 0) {
      setOpenPaymentMethodModal(true);
    }
  };

  const handleClosePaymentMethodModal = () => {
    setOpenPaymentMethodModal(false);
  };

  const HandleOpenSnackBarOnBoardingStatus = () => {
    setOpenSnackBarOnBoardingStatus(true);
  };

  const HandleCloseSnackBarOnBoardingStatus = () => {
    setOpenSnackBarOnBoardingStatus(false);
  };

  const renderUserStatusAlert = (status: OnboardingStatusEnum | undefined) => {
    switch (status) {
      case OnboardingStatusEnum.ONBOARDING_KO:
        return (
          <>
            <Snackbar
              open={openSnackBarOnBoardingStatus}
              onClose={() => HandleCloseSnackBarOnBoardingStatus()}
              autoHideDuration={4000}
              sx={{
                position: 'initial',
                justifyContent: 'center',
                gridColumn: 'span 24',
                zIndex: 0,
                my: 3,
              }}
              data-testid="onboarding-ko-snackbar-test"
            >
              <Alert
                variant="outlined"
                severity="error"
                sx={{ gridColumn: 'span 24', width: '100%' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t('pages.initiativeUserDetails.onboardingKo')}
                </Typography>
                <Typography variant="body2">
                  {t('pages.initiativeUserDetails.onboardingKoDescription')}
                </Typography>
              </Alert>
            </Snackbar>
          </>
        );
      case OnboardingStatusEnum.ELIGIBLE_KO:
        return (
          <>
            <Snackbar
              open={openSnackBarOnBoardingStatus}
              onClose={() => HandleCloseSnackBarOnBoardingStatus()}
              autoHideDuration={4000}
              sx={{
                position: 'initial',
                justifyContent: 'center',
                gridColumn: 'span 24',
                zIndex: 0,
                my: 3,
              }}
              data-testid="eligible-ko-snackbar-test"
            >
              <Alert
                variant="outlined"
                severity="warning"
                sx={{ gridColumn: 'span 24', width: '100%' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t('pages.initiativeUserDetails.eligibleKo')}
                </Typography>
                <Typography variant="body2">
                  {t('pages.initiativeUserDetails.eligibleKoDescription')}
                </Typography>
              </Alert>
            </Snackbar>
          </>
        );
      case OnboardingStatusEnum.SUSPENDED:
        return (
          <>
            <Alert
              variant="outlined"
              severity="warning"
              sx={{
                position: 'initial',
                gridColumn: 'span 24',
                zIndex: 0,
                my: 3,
              }}
            >
              <Typography variant="body2">
                {t('pages.initiativeUserDetails.onboardingSuspendedDescription')}
              </Typography>
            </Alert>
          </>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (date) {
      return date.toLocaleString('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Rome',
        hour: 'numeric',
        minute: 'numeric',
      });
    }

    return '';
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 2,
        }}
      >
        <Box sx={{ gridColumn: 'span 24' }}>{renderUserStatusAlert(statusOnb)}</Box>

        <Box sx={{ display: 'inline-flex', gridColumn: 'span 6' }}>
          <Typography variant="h6">{t('pages.initiativeUserDetails.initiativeState')}</Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 6', display: 'inline-flex', justifyContent: 'end' }}>
          <Typography variant="body2" color="text.secondary" sx={{ pr: 1 }}>
            {t('pages.initiativeUserDetails.updatedOn')}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatDate(lastCounterUpdate)}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
          mt: 2,
        }}
      >
        {initiativeRewardType === InitiativeRewardTypeEnum.REFUND && (
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
                  color="text.primary"
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
                  {formatedCurrency(amount, '0,00 €')}
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
                  {formatedCurrency(accrued, '0,00 €')}
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
                  {formatedCurrency(refunded, '0,00 €')}
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
                        <Badge
                          color="primary"
                          badgeContent={paymentMethodList.length}
                          sx={{ mr: 1 }}
                        />
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
                  color="text.primary"
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
                    walletStatus === StatusEnum.NOT_REFUNDABLE ||
                    walletStatus === StatusEnum.NOT_REFUNDABLE_ONLY_INSTRUMENT
                      ? 'error'
                      : undefined
                  }
                >
                  {walletStatus === StatusEnum.NOT_REFUNDABLE ||
                  walletStatus === StatusEnum.NOT_REFUNDABLE_ONLY_INSTRUMENT
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
                  {walletStatus === StatusEnum.NOT_REFUNDABLE ||
                  walletStatus === StatusEnum.NOT_REFUNDABLE_ONLY_INSTRUMENT ||
                  holderBank === undefined
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
                  {walletStatus === StatusEnum.NOT_REFUNDABLE ||
                  walletStatus === StatusEnum.NOT_REFUNDABLE_ONLY_INSTRUMENT
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
                  {walletStatus === StatusEnum.NOT_REFUNDABLE ||
                  walletStatus === StatusEnum.NOT_REFUNDABLE_ONLY_INSTRUMENT
                    ? '-'
                    : mappedChannel(channel)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {initiativeRewardType === InitiativeRewardTypeEnum.DISCOUNT && (
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
                  color="text.primary"
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
                  {formatedCurrency(amount, '0,00 €')}
                </Typography>

                <Typography
                  sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1' }}
                  variant="body2"
                  color="text.primary"
                >
                  {beneficiaryType === BeneficiaryTypeEnum.NF
                    ? t('pages.initiativeUserDetails.totalSpentBySingle')
                    : t('pages.initiativeUserDetails.refundedBalance')}
                </Typography>
                <Typography
                  sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5' }}
                  variant="body2"
                >
                  {formatedCurrency(refunded, '0,00 €')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default UserDetailsSummary;
