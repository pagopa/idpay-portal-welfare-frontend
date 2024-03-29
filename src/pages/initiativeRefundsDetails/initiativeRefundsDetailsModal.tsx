import CloseIcon from '@mui/icons-material/Close';
import { Backdrop, Box, Fade, IconButton, Modal, Typography } from '@mui/material';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefundDetailDTO } from '../../api/generated/initiative/RefundDetailDTO';
import { formatedCurrency, formatedDate, formatIban } from '../../helpers';
import { getRefundDetail } from '../../services/intitativeService';
import { getRefundStatus } from './helpers';

type Props = {
  openRefundsDetailModal: boolean;
  handleCloseRefundModal: React.MouseEventHandler;
  refundEventId: string | undefined;
  initiativeId: string;
};

const InitiativeRefundsDetailsModal = ({
  openRefundsDetailModal,
  handleCloseRefundModal,
  refundEventId,
  initiativeId,
}: Props) => {
  const addError = useErrorDispatcher();
  const setLoading = useLoading('GET_INITIATIVE_REFUNDS_DETAILS_SUMMARY');
  const [refundEventDetails, setRefundEventDetails] = useState<RefundDetailDTO>();

  const { t } = useTranslation();

  useEffect(() => {
    if (
      typeof initiativeId === 'string' &&
      typeof refundEventId === 'string' &&
      openRefundsDetailModal
    ) {
      setLoading(true);
      getRefundDetail(initiativeId, refundEventId)
        .then((res) => {
          if (typeof res === 'object') {
            setRefundEventDetails({ ...res });
          }
        })
        .catch((error) => {
          addError({
            id: 'GET_EXPORTS_PAGED_ERROR',
            blocking: false,
            error,
            techDescription: 'An error occurred getting refund detail',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [initiativeId, refundEventId, openRefundsDetailModal]);

  const renderRefundType = (refundType: string | undefined) => {
    switch (refundType) {
      case 'ORDINARY':
        return t('pages.initiativeRefundsDetails.modal.ordinary');
      case 'REMEDIAL':
        return t('pages.initiativeRefundsDetails.modal.remedial');
      default:
        return '';
    }
  };

  return (
    <Modal
      open={openRefundsDetailModal}
      onClose={handleCloseRefundModal}
      aria-labelledby="initiative-refunds-detail-title"
      aria-describedby="initiative-refunds-detail-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      data-testid="initiative-refund-detail-modal"
    >
      <Fade in={openRefundsDetailModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '0',
            right: '0',
            transform: 'translate(0, 0)',
            width: '375px',
            height: '100%',
            bgcolor: 'background.paper',
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
                onClick={(e: any) => handleCloseRefundModal(e)}
                data-testid="close-modal-test"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Typography variant="h6" component={'h2'}>
              {t('pages.initiativeRefundsDetails.modal.title')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
            <Typography variant="body2" color="text.secondary" textAlign="left">
              {t('pages.initiativeRefundsDetails.modal.taxIdCode')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Typography variant="body2" fontWeight={600}>
              {refundEventDetails?.fiscalCode}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
            <Typography variant="body2" color="text.secondary" textAlign="left">
              {t('pages.initiativeRefundsDetails.modal.iban')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Typography variant="monospaced">{formatIban(refundEventDetails?.iban)}</Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
            <Typography variant="body2" color="text.secondary" textAlign="left">
              {t('pages.initiativeRefundsDetails.modal.amount')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Typography variant="body2" fontWeight={600}>
              {formatedCurrency(refundEventDetails?.amount)}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
            <Typography variant="body2" color="text.secondary" textAlign="left">
              {t('pages.initiativeRefundsDetails.modal.referencePeriod')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Typography variant="body2" fontWeight={600}>
              {`${formatedDate(refundEventDetails?.startDate)} - ${formatedDate(
                refundEventDetails?.endDate
              )}`}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
            <Typography variant="body2" color="text.secondary" textAlign="left">
              {t('pages.initiativeRefundsDetails.modal.outcome')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12', mt: 2 }}>
            {getRefundStatus(refundEventDetails?.status)}
          </Box>
          <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
            <Typography variant="body2" color="text.secondary" textAlign="left">
              {t('pages.initiativeRefundsDetails.modal.typology')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Typography variant="body2" fontWeight={600}>
              {renderRefundType(refundEventDetails?.refundType)}
            </Typography>
          </Box>

          {refundEventDetails?.cro && (
            <>
              <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" textAlign="left">
                  {t('pages.initiativeRefundsDetails.modal.cro')}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 12' }}>
                <Typography
                  variant="body2"
                  sx={{
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontWeight: 600,
                  }}
                >
                  {refundEventDetails?.cro}
                </Typography>
              </Box>
            </>
          )}
          {refundEventDetails?.transferDate && (
            <>
              <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" textAlign="left">
                  {t('pages.initiativeRefundsDetails.modal.transferDate')}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 12' }}>
                <Typography variant="body2" fontWeight={600}>
                  {formatedDate(refundEventDetails?.transferDate)}
                </Typography>
              </Box>
            </>
          )}

          {refundEventDetails?.userNotificationDate && (
            <>
              <Box sx={{ gridColumn: 'span 12', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" textAlign="left">
                  {t('pages.initiativeRefundsDetails.modal.userNotificationDate')}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 12' }}>
                <Typography variant="body2" fontWeight={600}>
                  {formatedDate(refundEventDetails?.userNotificationDate)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default InitiativeRefundsDetailsModal;
