import React from 'react';
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
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { getMaskedPan } from '../../helpers';
import { InstrumentDTO, InstrumentDtoInstrumentTypeEnum } from '../../api/generated/initiative/apiClient';
import { InitiativeRewardTypeEnum } from '../../services/intitativeService';

type Props = {
  openPaymentMethodModal: boolean;
  handleClosePaymentMethodModal: MouseEventHandler;
  paymentMethodList: Array<InstrumentDTO>;
  initiativeRewardType: InitiativeRewardTypeEnum;
};

const PaymentMethodsModal = ({
  openPaymentMethodModal,
  handleClosePaymentMethodModal,
  paymentMethodList,
  initiativeRewardType,
}: Props) => {
  const { t } = useTranslation();

  const getPaymentMethodAvatar = (
    brandLogo: string | undefined,
    instrumentType: InstrumentDtoInstrumentTypeEnum,
    rewardType: InitiativeRewardTypeEnum
  ) => {
    switch (rewardType) {
      case InitiativeRewardTypeEnum.REFUND:
        return brandLogo ? <img alt='' src={brandLogo} width="32px" /> : <CreditCardIcon />;
      case InitiativeRewardTypeEnum.DISCOUNT:
        if (instrumentType === InstrumentDtoInstrumentTypeEnum.IDPAYCODE) {
          return <CreditCardIcon />;
        } else {
          return <PhoneIphoneIcon />;
        }
    }
  };

  const getPaymentMethodLabel = (
    rewardType: InitiativeRewardTypeEnum,
    instrumentType: InstrumentDtoInstrumentTypeEnum,
    maskedPan: string | undefined
  ) => {
    switch (rewardType) {
      case InitiativeRewardTypeEnum.REFUND:
        return getMaskedPan(maskedPan);
      case InitiativeRewardTypeEnum.DISCOUNT:
        if (instrumentType === InstrumentDtoInstrumentTypeEnum.CARD) {
          return getMaskedPan(maskedPan);
        } else if (instrumentType === InstrumentDtoInstrumentTypeEnum.IDPAYCODE) {
          return t('pages.initiativeUserDetails.transactionDetail.idPayCode');
        } else if (instrumentType === InstrumentDtoInstrumentTypeEnum.APP_IO_PAYMENT) {
          return t('pages.initiativeUserDetails.appIo');
        }
        return '-';
    }
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
                aria-label="close modal"
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
                <React.Fragment key={i}>
                  <ListItem>
                    <ListItemAvatar>
                      {getPaymentMethodAvatar(p.brandLogo, p.instrumentType, initiativeRewardType)}
                    </ListItemAvatar>
                    <ListItemText
                      primary={getPaymentMethodLabel(
                        initiativeRewardType,
                        p.instrumentType,
                        p.maskedPan
                      )}
                      secondary={p.activationDate
                        ?.toString()
                        .substring(0, p.activationDate?.toString().length - 3)}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PaymentMethodsModal;
