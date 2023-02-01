import { Modal, Backdrop, Fade, Box, IconButton, Typography } from '@mui/material';
import { MouseEventHandler, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { Chip } from '@mui/material';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { MockedOperation, MockedOperationType } from '../../model/Initiative';
import { getTimelineDetail } from '../../services/__mocks__/initiativeService';

type Props = {
  operationId: string;
  openModal: boolean;
  handleCloseModal: MouseEventHandler;
  initiativeId: string;
  holderBank: string;
  operationTypeLabel: any;
};

const TransactionDetailModal = ({
  operationId,
  openModal,
  handleCloseModal,
  initiativeId,
  holderBank,
  operationTypeLabel,
}: Props) => {
  const { t } = useTranslation();
  const [transactionDetail, setTransactionDetail] = useState<MockedOperation>();
  const addError = useErrorDispatcher();

  useEffect(() => {
    if (typeof initiativeId === 'string' && typeof operationId === 'string' && openModal) {
      getTimelineDetail(initiativeId, operationId)
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
        );
    }
  }, [operationId, openModal, initiativeId]);

  const getMaskedPan = (pan: string | undefined) => `**** ${pan?.substring(pan.length - 4)}`;

  const transactionResult = (opeType: MockedOperationType | undefined) => {
    if (typeof opeType !== 'undefined') {
      if (opeType?.toUpperCase().substring(0, 8) === 'REJECTED') {
        return (
          <>
            <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
              <Typography variant="body2" color="text.secondary" textAlign="left">
                {t('pages.initiativeUserDetails.transactionDetail.result')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 12', mt: 2 }}>
              <Chip
                sx={{ fontSize: '14px', variant: 'body2', fontWeight: 600, px: '2px', py: '4px' }}
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
                sx={{ fontSize: '14px', variant: 'body2', fontWeight: 600, px: '2px', py: '4px' }}
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
            p: 4,
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
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
            }}
          >
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="h6" component="h2">
                {operationTypeLabel(transactionDetail?.operationType)}
              </Typography>
            </Box>
            {transactionDetail?.operationType !== MockedOperationType.ADD_IBAN ? (
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
            {transactionDetail?.operationType === MockedOperationType.ADD_IBAN ? (
              <>
                <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" textAlign="left">
                    {t('pages.initiativeUserDetails.transactionDetail.iban')}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 12', mt: 2 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {transactionDetail?.iban}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" textAlign="left">
                    {t('pages.initiativeUserDetails.transactionDetail.bank')}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {holderBank}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" textAlign="left">
                    {t('pages.initiativeUserDetails.addedBy')}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {transactionDetail.channel}
                  </Typography>
                </Box>
              </>
            ) : null}
            {transactionDetail?.operationType === MockedOperationType.REVERSAL ||
            transactionDetail?.operationType === MockedOperationType.ADD_IBAN ? null : (
              <>
                <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" textAlign="left">
                    {t('pages.initiativeUserDetails.transactionDetail.paymentCircuit')}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {transactionDetail?.circuitType}
                  </Typography>
                </Box>
              </>
            )}
            {transactionDetail?.operationType === MockedOperationType.TRANSACTION ||
            transactionDetail?.operationType === MockedOperationType.REVERSAL ? (
              <>
                <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" textAlign="left">
                    {t('pages.initiativeUserDetails.transactionDetail.totExpense')}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {`${transactionDetail?.amount} € `}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" textAlign="left">
                    {t('pages.initiativeUserDetails.transactionDetail.importToRefund')}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {`${transactionDetail?.accrued} € `}
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
                {transactionDetail?.operationDate
                  ?.toLocaleString('fr-BE')
                  .substring(
                    0,
                    transactionDetail?.operationDate.toLocaleString('fr-BE').length - 3
                  )}
              </Typography>
            </Box>
            {transactionDetail?.operationType === MockedOperationType.TRANSACTION ||
            transactionDetail?.operationType === MockedOperationType.REVERSAL ? (
              <>
                <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" textAlign="left">
                    {t('pages.initiativeUserDetails.transactionDetail.acquirerTransactionId')}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {transactionDetail.aquirerId}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" textAlign="left">
                    {t('pages.initiativeUserDetails.transactionDetail.issuerTransactionId')}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {transactionDetail.issuerId}
                  </Typography>
                </Box>
              </>
            ) : (
              transactionResult(transactionDetail?.operationType)
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TransactionDetailModal;
