/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Backdrop, Box, Chip, Fade, IconButton, Modal, Typography } from '@mui/material';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { MouseEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { InitiativeRewardTypeEnum } from '../../api/generated/initiative/InitiativeDTO';
import { OperationDTO } from '../../api/generated/initiative/OperationDTO';
import {
  copyTextToClipboard,
  formatIban,
  formatedCurrency,
  getMaskedPan,
  mappedChannel,
} from '../../helpers';
import { getTimelineDetail } from '../../services/intitativeService';

type Props = {
  fiscalCode: string;
  operationId: string;
  openModal: boolean;
  handleCloseModal: MouseEventHandler;
  initiativeId: string;
  holderBank: string | undefined;
  rewardType: string | undefined;
};

const TransactionDetailModal = ({
  fiscalCode,
  operationId,
  openModal,
  handleCloseModal,
  initiativeId,
  holderBank,
  rewardType,
}: Props) => {
  const { t } = useTranslation();
  const [transactionDetail, setTransactionDetail] = useState<OperationDTO>();
  const addError = useErrorDispatcher();
  const setLoading = useLoading('GET_TRANSACTION_DETAIL');

  useEffect(() => {
    if (typeof initiativeId === 'string' && typeof operationId === 'string' && openModal) {
      setLoading(true);
      getTimelineDetail(fiscalCode, initiativeId, operationId)
        .then((res) => {
          if (typeof res === 'object') {
            setTransactionDetail(res);
          }
        })
        .catch((error) =>
          addError({
            id: 'GET_TIMELINE_DETAIL',
            blocking: false,
            error,
            techDescription: 'An error occurred getting timeline detail',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          })
        )
        .finally(() => setLoading(false));
    }
  }, [operationId, openModal, initiativeId]);

  const transactionResult = (opeType: string | undefined) => {
    if (typeof opeType !== 'undefined') {
      if (opeType?.toUpperCase().includes('REJECTED') || opeType?.toUpperCase().includes('KO')) {
        return (
          <>
            <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
              <Typography variant="body2" color="text.secondary" textAlign="left">
                {t('pages.initiativeUserDetails.transactionDetail.result')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12', mt: 2 }}>
              <Chip
                sx={{ fontSize: '14px', variant: 'body2', fontWeight: 600 }}
                label={i18n.t('pages.initiativeUserDetails.transactionDetail.negativeResult')}
                color="error"
              />
            </Box>
          </>
        );
      } else {
        return (
          <>
            <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
              <Typography variant="body2" color="text.secondary" textAlign="left">
                {t('pages.initiativeUserDetails.transactionDetail.result')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12', mt: 2 }}>
              <Chip
                sx={{ fontSize: '14px', variant: 'body2', fontWeight: 600 }}
                label={i18n.t('pages.initiativeUserDetails.transactionDetail.positiveResult')}
                color="success"
              />
            </Box>
          </>
        );
      }
    } else {
      return;
    }
  };

  const formatDate = (date: string | undefined) => {
    if (typeof date === 'string') {
      const newDate = new Date(date);
      if (newDate) {
        return newDate.toLocaleString('it-IT', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'Europe/Rome',
          hour: 'numeric',
          minute: 'numeric',
        });
      }
    }
    return '';
  };

  const operationTypeLabel = (
    opeType: string | undefined,
    rewardType: string | undefined,
    transactionDetail: OperationDTO | undefined
  ) => {
    switch (opeType) {
      case 'ADD_IBAN':
        return t('pages.initiativeUserDetails.operationTypes.addIban');
      case 'ADD_INSTRUMENT':
        return t('pages.initiativeUserDetails.operationTypes.addInstrument');
      case 'DELETE_INSTRUMENT':
        return t('pages.initiativeUserDetails.operationTypes.deleteInstrument');
      case 'ONBOARDING':
        return t('pages.initiativeUserDetails.operationTypes.onboarding');
      case 'PAID_REFUND':
        return t('pages.initiativeUserDetails.operationTypes.paidRefund');
      case 'REJECTED_ADD_INSTRUMENT':
        return t('pages.initiativeUserDetails.operationTypes.rejectedAddInstrument');
      case 'REJECTED_DELETE_INSTRUMENT':
      case 'DELETE_INSTRUMENT_KO':
        return t('pages.initiativeUserDetails.operationTypes.rejectedDeleteInstrument');
      case 'REJECTED_REFUND':
        return t('pages.initiativeUserDetails.operationTypes.rejectedRefund');
      case 'REVERSAL':
        return t('pages.initiativeUserDetails.operationTypes.reversal');
      case 'TRANSACTION':
        if (rewardType === InitiativeRewardTypeEnum.DISCOUNT) {
          if (
            transactionDetail?.status === 'AUTHORIZED' ||
            transactionDetail?.status === 'REWARDED'
          ) {
            return t('pages.initiativeUserDetails.operationTypes.discountAuthorized');
          }
          if (transactionDetail?.status === 'CANCELLED') {
            return t('pages.initiativeUserDetails.operationTypes.discountCancelled');
          }
        } else if (rewardType === InitiativeRewardTypeEnum.REFUND) {
          return t('pages.initiativeUserDetails.operationTypes.transaction');
        }
        return '';
      default:
        return null;
    }
  };

  return (
    <Modal
      aria-labelledby="choose-transaction-detail-title"
      aria-describedby="choose-transaction-detail-description"
      open={openModal}
      onClose={handleCloseModal}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      data-testid="transaction-detail-modal"
    >
      <Fade in={openModal} data-testid="transaction-detail-fade">
        <Box
          sx={{
            position: 'absolute',
            top: '0',
            right: '0',
            transform: 'translate(0, 0)',
            width: '375px',
            height: '100%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              justifyItems: 'end',
            }}
          >
            <Box sx={{ gridColumn: 'span 12' }}>
              <IconButton
                color="default"
                aria-label="close mcc modal"
                component="span"
                onClick={(e: any) => {
                  handleCloseModal(e);
                }}
                data-testid="close-modal-test"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          {rewardType === InitiativeRewardTypeEnum.REFUND && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
              }}
            >
              <Box sx={{ gridColumn: 'span 12' }}>
                <Typography variant="h6" component="h2">
                  {operationTypeLabel(
                    transactionDetail?.operationType,
                    rewardType,
                    transactionDetail
                  )}
                </Typography>
              </Box>
              {transactionDetail?.operationType !== 'ADD_IBAN' &&
              transactionDetail?.operationType !== 'ONBOARDING' &&
              transactionDetail?.operationType !== 'PAID_REFUND' &&
              transactionDetail?.operationType !== 'REJECTED_REFUND' ? (
                <>
                  <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="left">
                      {t('pages.initiativeUserDetails.transactionDetail.paymentMethod')}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {getMaskedPan(transactionDetail?.maskedPan)}
                    </Typography>
                  </Box>
                </>
              ) : null}
              {transactionDetail?.operationType === 'ADD_IBAN' ? (
                <>
                  <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="left">
                      {t('pages.initiativeUserDetails.transactionDetail.iban')}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12' }}>
                    <Typography variant="monospaced" fontWeight={400}>
                      {formatIban(transactionDetail?.iban)}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="left">
                      {t('pages.initiativeUserDetails.transactionDetail.bank')}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {holderBank ? holderBank : '-'}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="left">
                      {t('pages.initiativeUserDetails.addedBy')}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {mappedChannel(transactionDetail.channel)}
                    </Typography>
                  </Box>
                </>
              ) : null}
              {transactionDetail?.operationType === 'ADD_IBAN' ||
              transactionDetail?.operationType === 'ONBOARDING' ||
              transactionDetail?.operationType === 'PAID_REFUND' ||
              transactionDetail?.operationType === 'REJECTED_REFUND' ? null : (
                <>
                  <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="left">
                      {t('pages.initiativeUserDetails.transactionDetail.brand')}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {typeof transactionDetail?.brand !== 'undefined'
                        ? transactionDetail?.brand
                        : '-'}
                    </Typography>
                  </Box>
                </>
              )}
              {transactionDetail?.operationType === 'TRANSACTION' ||
              transactionDetail?.operationType === 'REVERSAL' ? (
                <>
                  <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="left">
                      {t('pages.initiativeUserDetails.transactionDetail.totExpense')}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {transactionDetail.operationType === 'REVERSAL'
                        ? `-${formatedCurrency(transactionDetail?.amount)}`
                        : formatedCurrency(transactionDetail?.amount)}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="left">
                      {t('pages.initiativeUserDetails.transactionDetail.importToRefund')}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {transactionDetail.operationType === 'REVERSAL'
                        ? `${formatedCurrency(transactionDetail?.accrued)}`
                        : formatedCurrency(transactionDetail?.accrued)}
                    </Typography>
                  </Box>
                </>
              ) : null}

              {transactionDetail?.operationType === 'PAID_REFUND' ||
              transactionDetail?.operationType === 'REJECTED_REFUND' ? (
                <>
                  <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="left">
                      {t('pages.initiativeUserDetails.transactionDetail.import')}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {formatedCurrency(transactionDetail?.amount, '00,00 €')}
                    </Typography>
                  </Box>
                </>
              ) : null}

              <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" textAlign="left">
                  {t('pages.initiativeUserDetails.transactionDetail.date')}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 12' }}>
                <Typography variant="body2" fontWeight={600}>
                  {formatDate(transactionDetail?.operationDate)}
                </Typography>
              </Box>
              {transactionDetail?.operationType === 'TRANSACTION' ||
              transactionDetail?.operationType === 'REVERSAL' ? (
                <>
                  <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="left">
                      {t('pages.initiativeUserDetails.transactionDetail.acquirerTransactionId')}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12' }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {transactionDetail.idTrxAcquirer}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="left">
                      {t('pages.initiativeUserDetails.transactionDetail.issuerTransactionId')}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: 'span 12' }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {transactionDetail.idTrxIssuer}
                    </Typography>
                  </Box>
                </>
              ) : (
                transactionResult(transactionDetail?.operationType)
              )}
            </Box>
          )}
          {rewardType === InitiativeRewardTypeEnum.DISCOUNT && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
              }}
            >
              <Box sx={{ gridColumn: 'span 12' }}>
                <Typography variant="h6" component="h2">
                  {operationTypeLabel(
                    transactionDetail?.operationType,
                    rewardType,
                    transactionDetail
                  )}
                </Typography>
              </Box>
              {transactionDetail?.status === 'CANCELLED' && (
                <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      {t(
                        'pages.initiativeUserDetails.transactionDetail.discountCancelledAlertText'
                      )}
                    </Typography>
                  </Alert>
                </Box>
              )}
              <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" textAlign="left">
                  {t('pages.initiativeUserDetails.transactionDetail.merchant')}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 12' }}>
                <Typography variant="body2" fontWeight={600}>
                  {transactionDetail?.businessName}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" textAlign="left">
                  {t('pages.initiativeUserDetails.transactionDetail.expenseAmount')}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 12' }}>
                <Typography variant="body2" fontWeight={600}>
                  {formatedCurrency(transactionDetail?.amount)}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" textAlign="left">
                  {t('pages.initiativeUserDetails.transactionDetail.discountApplied')}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 12' }}>
                <Typography variant="body2" fontWeight={600}>
                  {formatedCurrency(transactionDetail?.accrued)}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" textAlign="left">
                  {t('pages.initiativeUserDetails.transactionDetail.date')}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 12' }}>
                <Typography variant="body2" fontWeight={600}>
                  {formatDate(transactionDetail?.operationDate)}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" textAlign="left">
                  {t('pages.initiativeUserDetails.transactionDetail.transactionId')}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 10' }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    width: '260px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {transactionDetail?.eventId}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 2' }}>
                <ContentCopyIcon
                  onClick={() => copyTextToClipboard(transactionDetail?.eventId)}
                  color="primary"
                  sx={{ cursor: 'pointer', transform: 'scale(-1) rotate(270deg)' }}
                  data-testid="transaction-modal-copy"
                />
              </Box>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default TransactionDetailModal;
