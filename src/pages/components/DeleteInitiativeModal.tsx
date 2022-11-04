import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import ROUTES from '../../routes';
import { logicallyDeleteInitiative } from '../../services/intitativeService';
import { USER_PERMISSIONS } from '../../utils/constants';
import { usePermissions } from '../../hooks/usePermissions';

type Props = {
  initiativeId: string | undefined;
  initiativeStatus: string | undefined;
  openInitiativeDeleteModal: boolean;
  handleCloseInitiativeDeleteModal: MouseEventHandler;
};

const DeleteInitiativeModal = ({
  initiativeId,
  initiativeStatus,
  openInitiativeDeleteModal,
  handleCloseInitiativeDeleteModal,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const userCanDeleteInitiative = usePermissions(USER_PERMISSIONS.DELETE_INITIATIVE);
  const setLoading = useLoading('DELETE_INITIATIVE');

  const handleDeleteInitiative = (id: string | undefined, status: string | undefined) => {
    if (
      userCanDeleteInitiative &&
      typeof id === 'string' &&
      typeof status === 'string' &&
      status !== 'PUBLISHED' &&
      status !== 'IN_REVISION'
    ) {
      setLoading(true);
      logicallyDeleteInitiative(id)
        .then((_res) => history.replace(ROUTES.INITIATIVE_LIST))
        .catch((error) =>
          addError({
            id: 'DELETE_INITIATIVE_ERROR',
            blocking: false,
            error,
            techDescription: 'An error occurred deleting initiative',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.cantDeleteInitiative'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          })
        )
        .finally(() => setLoading(false));
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
      data-testid="delete-modal-test"
    >
      <Fade in={openInitiativeDeleteModal} data-testid="fade-test">
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
              data-testid="cancel-button-test"
            >
              {t('pages.initiativeOverview.modal.cancel')}
            </Button>
            <Button
              variant="contained"
              sx={{ gridArea: 'deleteBtn', justifySelf: 'end' }}
              onClick={(e) => {
                handleDeleteInitiative(initiativeId, initiativeStatus);
                handleCloseInitiativeDeleteModal(e);
              }}
              data-testid="delete-button-test"
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
