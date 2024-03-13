import { Badge, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import PaymentMethodsModal from '../PaymentMethodsModal';
import { InstrumentDTO } from '../../../api/generated/initiative/InstrumentDTO';
import { InitiativeRewardTypeEnum } from '../../../api/generated/initiative/InitiativeDTO';

interface Props {
  paymentMethodList: Array<InstrumentDTO>;
  initiativeRewardType: InitiativeRewardTypeEnum;
}

const InstrumentsList = ({ paymentMethodList, initiativeRewardType }: Props) => {
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
    <>
      <Typography
        sx={{
          display: 'grid',
          gridColumn: 'span 6',
          mt: 1,
          justifyContent: 'left',
          ml: 1,
        }}
      >
        <ButtonNaked
          component="button"
          sx={{
            color: paymentMethodList.length > 0 ? 'primary.main' : 'error.main',
            fontWeight: 700,
            fontSize: '14px',
          }}
          startIcon={
            <Badge
              color={paymentMethodList.length > 0 ? 'primary' : 'error'}
              badgeContent={`${paymentMethodList.length}`}
              sx={{
                mr: 1,
                '& .MuiBadge-badge': { color: '#FFF' },
              }}
            />
          }
          onClick={() => handleOpenPaymentMethodModal()}
        >
          {paymentMethodList.length > 0
            ? t('pages.initiativeUserDetails.paymentMethod')
            : t('pages.initiativeUserDetails.missingPaymentMethod')}
        </ButtonNaked>
      </Typography>
      {paymentMethodList.length > 0 && (
        <PaymentMethodsModal
          openPaymentMethodModal={openPaymentMethodModal}
          handleClosePaymentMethodModal={handleClosePaymentMethodModal}
          paymentMethodList={paymentMethodList}
          initiativeRewardType={initiativeRewardType}
        />
      )}
    </>
  );
};

export default InstrumentsList;
