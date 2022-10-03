import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES from '../../routes';
import { logicallyDeleteInitiative } from '../../services/intitativeService';

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
  const history = useHistory();

  const handleDeleteInitiative = (id: string | undefined) => {
    if (
      initiativeSel.status !== 'PUBLISHED' &&
      initiativeSel.status !== 'IN_REVISION' &&
      typeof id === 'string'
    ) {
      logicallyDeleteInitiative(id)
        .then((_res) => history.replace(ROUTES.HOME))
        .catch((error) => ({
          id: 'DELETE_INITIATIVE_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred deleting initiative',
          displayableDescription: t('errors.cantDeleteInitiative'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        }));
    }
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
                handleDeleteInitiative(initiativeSel.initiativeId);
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
