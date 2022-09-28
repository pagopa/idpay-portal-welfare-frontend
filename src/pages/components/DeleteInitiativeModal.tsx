import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';

type Props = {
  openInitiativeDeleteModal: boolean;
  handleCloseInitiativeDeleteModal: MouseEventHandler;
};

const DeleteInitiativeModal = ({
  openInitiativeDeleteModal,
  handleCloseInitiativeDeleteModal,
}: Props) => {
  const { t } = useTranslation();
  const initiativeSel = useAppSelector(initiativeSelector);

  const handleDelete = (id: string) => {
    console.log(id);
  };

  return (
    <Modal
      aria-labelledby="initiative-delete-modal-title"
      aria-describedby="initiative-delete-modal-description"
      open={openInitiativeDeleteModal}
      onClose={handleCloseInitiativeDeleteModal}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openInitiativeDeleteModal}>
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
          <Typography variant="h6">{t('pages.initiativeOverview.modal.title')}</Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            {t('pages.initiativeOverview.modal.subtitle')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridTemplateRows: 'auto',
              gridTemplateAreas: `". . . cancelBtn deleteBtn"`,
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              sx={{ gridArea: 'cancelBtn', justifySelf: 'end' }}
              onClick={handleCloseInitiativeDeleteModal}
            >
              {t('pages.initiativeOverview.modal.cancel')}
            </Button>
            <Button
              variant="contained"
              sx={{ gridArea: 'deleteBtn', justifySelf: 'end' }}
              onClick={(e) => {
                handleDelete(
                  typeof initiativeSel.initiativeId === 'string' ? initiativeSel.initiativeId : ''
                );
                handleCloseInitiativeDeleteModal(e);
              }}
            >
              {t('pages.initiativeOverview.modal.delete')}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DeleteInitiativeModal;
