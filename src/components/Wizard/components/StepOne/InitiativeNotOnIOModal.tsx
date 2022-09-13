import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  openInitiativeNotOnIOModal: boolean;
  handleCloseInitiativeNotOnIOModal: MouseEventHandler;
  values: any;
  sendValues: any;
};

const InitiativeNotOnIOModal = ({
  openInitiativeNotOnIOModal,
  handleCloseInitiativeNotOnIOModal,
  values,
  sendValues,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      aria-labelledby="initiative-not-on-IO-reminder-modal-title"
      aria-describedby="initiative-not-on-IO-reminder-modal-description"
      open={openInitiativeNotOnIOModal}
      onClose={handleCloseInitiativeNotOnIOModal}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openInitiativeNotOnIOModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            borderRadius: '4px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">
            {t('components.wizard.stepOne.modal.serviceNotOnIOTitle')}
          </Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            {t('components.wizard.stepOne.modal.serviceNotOnIODescription')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows: 'auto',
              gridTemplateAreas: `". . cancelBtn exitBtn"`,
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              sx={{ gridArea: 'cancelBtn', justifySelf: 'end' }}
              onClick={handleCloseInitiativeNotOnIOModal}
            >
              {t('components.wizard.stepOne.modal.cancelBtn')}
            </Button>
            <Button
              variant="contained"
              sx={{ gridArea: 'exitBtn', justifySelf: 'end' }}
              onClick={(e) => {
                sendValues(values);
                handleCloseInitiativeNotOnIOModal(e);
              }}
            >
              {t('components.wizard.stepOne.modal.continueBtn')}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default InitiativeNotOnIOModal;
