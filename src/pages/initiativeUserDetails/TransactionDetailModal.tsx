import { Modal, Backdrop, Fade, Box, IconButton, Typography } from '@mui/material';
import { MouseEventHandler, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { MockedOperation } from '../../model/Initiative';
import { getTimelineDetail } from '../../services/__mocks__/initiativeService';

type Props = {
  operationId: string;
  openModal: boolean;
  handleCloseModal: MouseEventHandler;
  initiativeId: string;
};

const TransactionDetailModal = ({
  operationId,
  openModal,
  handleCloseModal,
  initiativeId,
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
                {transactionDetail?.operationType}
              </Typography>
            </Box>
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
            <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
              <Typography variant="body2" color="text.secondary" textAlign="left">
                {t('pages.initiativeUserDetails.transactionDetail.importToRefund')}
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
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TransactionDetailModal;
