import { Alert, Box, Card, CardContent, Snackbar, Typography } from '@mui/material';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatIban, formatedCurrency, mappedChannel } from '../../../helpers';
import { InstrumentDTO, InstrumentDtoStatusEnum, OnboardingStatusDtoStatusEnum, WalletDtoStatusEnum } from '../../../api/generated/initiative/apiClient';
import { useAppSelector } from '../../../redux/hooks';
import { initiativeRewardTypeSelector } from '../../../redux/slices/initiativeSlice';
import { getIban, getInstrumentList, getWalletDetail, InitiativeRewardTypeEnum } from '../../../services/intitativeService';
import InstrumentsList from './InstrumentsList';

type Props = {
  id: string;
  cf: string;
  statusOnb: OnboardingStatusDtoStatusEnum | undefined;
  holderBank: string | undefined;
  setHolderBank: Dispatch<SetStateAction<string | undefined>>;
};

const UserDetailsSummary = ({ id, cf, statusOnb, holderBank, setHolderBank }: Props) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [accrued, setAccrued] = useState<number | undefined>(undefined);
  const [refunded, setRefunded] = useState<number | undefined>(undefined);
  const [iban, setIban] = useState<string | undefined>(undefined);
  const [walletStatus, setWalletStatus] = useState<WalletDtoStatusEnum | undefined>(undefined);
  const [lastCounterUpdate, setLastCounterUpdate] = useState<Date | undefined>(undefined);
  const [checkIbanResponseDate, setCheckIbanResponseDate] = useState<Date | undefined>(undefined);
  const [channel, setChannel] = useState<string | undefined>(undefined);
  const [paymentMethodList, setPaymentMethodList] = useState<Array<InstrumentDTO>>([]);
  const [openSnackBarOnBoardingStatus, setOpenSnackBarOnBoardingStatus] = useState(false);
  const addError = useErrorDispatcher();
  const initiativeRewardType = useAppSelector(initiativeRewardTypeSelector);

  useEffect(() => {
    if (
      typeof id === 'string' &&
      typeof cf === 'string' &&
      (statusOnb === OnboardingStatusDtoStatusEnum.ONBOARDING_OK ||
        statusOnb === OnboardingStatusDtoStatusEnum.UNSUBSCRIBED ||
        statusOnb === OnboardingStatusDtoStatusEnum.SUSPENDED)
    ) {
      getWalletDetail(id, cf)
        .then((res) => {
          setAmount((res as any).amountCents);
          setAccrued((res as any).accruedCents);
          setRefunded((res as any).refundedCents);
          if (typeof (res as any).lastCounterUpdate === 'object') {
            setLastCounterUpdate((res as any).lastCounterUpdate);
          }
          setIban((res as any).iban);
          setWalletStatus((res as any).status);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, cf, statusOnb]);

  useEffect(() => {
    if (
      typeof id === 'string' &&
      typeof cf === 'string' &&
      (statusOnb === OnboardingStatusDtoStatusEnum.ONBOARDING_OK ||
        statusOnb === OnboardingStatusDtoStatusEnum.UNSUBSCRIBED ||
        statusOnb === OnboardingStatusDtoStatusEnum.SUSPENDED)
    ) {
      getInstrumentList(id, cf)
        .then((res) => {
          const walletInst = res.instrumentList.filter(
            (r: any) => r.status === InstrumentDtoStatusEnum.ACTIVE
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iban, initiativeRewardType]);

  const HandleOpenSnackBarOnBoardingStatus = () => {
    setOpenSnackBarOnBoardingStatus(true);
  };

  const HandleCloseSnackBarOnBoardingStatus = () => {
    setOpenSnackBarOnBoardingStatus(false);
  };

  const renderUserStatusAlert = (status: OnboardingStatusDtoStatusEnum | undefined) => {
    switch (status) {
      case OnboardingStatusDtoStatusEnum.ONBOARDING_KO:
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
      case OnboardingStatusDtoStatusEnum.ELIGIBLE_KO:
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
      case OnboardingStatusDtoStatusEnum.SUSPENDED:
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

    return '-';
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
                  {formatedCurrency(amount, '0,00 €', true)}
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
                  {formatedCurrency(accrued, '0,00 €', true)}
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
                  {formatedCurrency(refunded, '0,00 €', true)}
                </Typography>
                <InstrumentsList
                  paymentMethodList={paymentMethodList}
                  initiativeRewardType={initiativeRewardType}
                />
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
                    walletStatus === WalletDtoStatusEnum.NOT_REFUNDABLE ||
                    walletStatus === WalletDtoStatusEnum.NOT_REFUNDABLE_ONLY_INSTRUMENT
                      ? 'error'
                      : undefined
                  }
                >
                  {walletStatus === WalletDtoStatusEnum.NOT_REFUNDABLE ||
                  walletStatus === WalletDtoStatusEnum.NOT_REFUNDABLE_ONLY_INSTRUMENT
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
                  {walletStatus === WalletDtoStatusEnum.NOT_REFUNDABLE ||
                  walletStatus === WalletDtoStatusEnum.NOT_REFUNDABLE_ONLY_INSTRUMENT ||
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
                  {walletStatus === WalletDtoStatusEnum.NOT_REFUNDABLE ||
                  walletStatus === WalletDtoStatusEnum.NOT_REFUNDABLE_ONLY_INSTRUMENT
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
                  {walletStatus === WalletDtoStatusEnum.NOT_REFUNDABLE ||
                  walletStatus === WalletDtoStatusEnum.NOT_REFUNDABLE_ONLY_INSTRUMENT
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
                  {formatedCurrency(amount, '0,00 €', true)}
                </Typography>

                <Typography
                  sx={{ fontWeight: 400, display: 'grid', gridColumn: 'span 1' }}
                  variant="body2"
                  color="text.primary"
                >
                  {/* {beneficiaryType === BeneficiaryTypeEnum.NF
                    ? t('pages.initiativeUserDetails.totalSpentBySingle')
                    : t('pages.initiativeUserDetails.refundedBalance')} */}

                  {t('pages.initiativeUserDetails.transactionDetail.totExpense')}
                </Typography>
                <Typography
                  sx={{ fontWeight: 700, display: 'grid', gridColumn: 'span 5' }}
                  variant="body2"
                >
                  {formatedCurrency(accrued, '0,00 €', true)}
                </Typography>
                <InstrumentsList
                  paymentMethodList={paymentMethodList}
                  initiativeRewardType={initiativeRewardType}
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default UserDetailsSummary;
