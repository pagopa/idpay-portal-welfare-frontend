import { Badge, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import PaymentMethodsModal from '../PaymentMethodsModal';
import { InstrumentDTO } from '../../../api/generated/initiative/InstrumentDTO';

interface Props {
  paymentMethodList: Array<InstrumentDTO>;
}

const InstrumentsList = ({ paymentMethodList }: Props) => {
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
    </>
  );
};

export default InstrumentsList;
