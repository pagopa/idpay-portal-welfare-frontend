import { Backdrop, Modal, Fade, Box, Typography, Button } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  rejectModalOpen: boolean;
  setRejectModalOpen: Dispatch<SetStateAction<boolean>>;
  initiativeId: string | undefined;
  handleRejectInitiative: any;
  userCanRejectInitiative: boolean;
};

const ConfirmRejectInitiativeModal = ({
  rejectModalOpen,
  setRejectModalOpen,
  initiativeId,
  handleRejectInitiative,
  userCanRejectInitiative,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      aria-labelledby="confirm-reject-initiative-modal-title"
      aria-describedby="confirm-reject-initiative-modal-description"
      open={rejectModalOpen}
      onClose={() => setRejectModalOpen(false)}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      data-testid="reject-modal-test"
    >
      <Fade in={rejectModalOpen} data-testid="fade-test">
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
          <Typography variant="h6">{t('pages.initiativeDetail.accordion.modal.title')}</Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            {t('pages.initiativeDetail.accordion.modal.subtitle')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows: 'auto',
              gridTemplateAreas: `". . cancelBtn exitBtn"`,
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              sx={{ gridArea: 'cancelBtn', justifySelf: 'end' }}
              onClick={() => setRejectModalOpen(false)}
            >
              {t('components.wizard.stepOne.modal.cancelBtn')}
            </Button>
            <Button
              variant="contained"
              sx={{ gridArea: 'exitBtn', justifySelf: 'end' }}
              onClick={() => {
                handleRejectInitiative(initiativeId, userCanRejectInitiative);
                setRejectModalOpen(false);
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

export default ConfirmRejectInitiativeModal;
