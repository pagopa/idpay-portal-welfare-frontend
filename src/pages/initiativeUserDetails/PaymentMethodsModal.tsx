import {
  Modal,
  Backdrop,
  Fade,
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import { MouseEventHandler } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import CreditCardIcon from '@mui/icons-material/CreditCard';
// import { MockedInstrumentDTO } from '../../model/Initiative';
import { InstrumentDTO } from '../../api/generated/initiative/InstrumentDTO';

type Props = {
  openPaymentMethodModal: boolean;
  handleClosePaymentMethodModal: MouseEventHandler;
  paymentMethodList: Array<InstrumentDTO>;
};

const PaymentMethodsModal = ({
  openPaymentMethodModal,
  handleClosePaymentMethodModal,
  paymentMethodList,
}: Props) => {
  const { t } = useTranslation();

  const getMaskedPan = (pan: string | undefined) => {
    if (pan) {
      return `**** ${pan?.substring(pan.length - 4)}`;
    }
    return '****';
  };

  return (
    <Modal
      aria-labelledby="choose-transaction-detail-title"
      aria-describedby="choose-transaction-detail-description"
      open={openPaymentMethodModal}
      onClose={handleClosePaymentMethodModal}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      data-testid="transaction-detail-modal"
    >
      <Fade in={openPaymentMethodModal} data-testid="transaction-detail-fade">
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
                  handleClosePaymentMethodModal(e);
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
            <Typography variant="h6" component="h2" sx={{ gridColumn: 'span 12', mt: 2 }}>
              {t('pages.initiativeUserDetails.paymentMethod')}
            </Typography>

            <List sx={{ gridColumn: 'span 12' }}>
              {paymentMethodList.map((p, i) => (
                <>
                  <ListItem key={i}>
                    <ListItemAvatar>
                      {p.brandLogo ? <img src={p.brandLogo} width="32px" /> : <CreditCardIcon />}
                    </ListItemAvatar>
                    <ListItemText
                      primary={getMaskedPan(p.maskedPan)}
                      secondary={p.activationDate
                        ?.toLocaleString('fr-BE')
                        .substring(0, p.activationDate?.toLocaleString('fr-BE').length - 3)}
                    />
                  </ListItem>
                  <Divider component="li" />
                </>
              ))}
            </List>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PaymentMethodsModal;
