import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusEnum as OnboardingStatusEnum } from '../../api/generated/initiative/OnboardingStatusDTO';
import { readmitUser, suspendUser } from '../../services/intitativeService';

type Props = {
  suspensionModalOpen: boolean;
  setSuspensionModalOpen: Dispatch<SetStateAction<boolean>>;
  statusOnb: OnboardingStatusEnum | undefined;
  setStatusOnb: Dispatch<SetStateAction<OnboardingStatusEnum | undefined>>;
  buttonType: string;
  id: string;
  cf: string;
};

const SuspensionModal = ({
  suspensionModalOpen,
  setSuspensionModalOpen,
  statusOnb,
  setStatusOnb,
  buttonType,
  id,
  cf,
}: Props) => {
  const { t } = useTranslation();
  const setLoading = useLoading('SUSPEND_USER');
  const addError = useErrorDispatcher();

  const handleSuspendUser = () => {
    if (statusOnb !== OnboardingStatusEnum.SUSPENDED) {
      setLoading(true);
      suspendUser(id, cf)
        .then((_res) => {
          setStatusOnb(OnboardingStatusEnum.SUSPENDED);
        })
        .catch((error) =>
          addError({
            id: 'SUSPEND_USER',
            blocking: false,
            error,
            techDescription: 'An error occurred suspending user',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          })
        )
        .finally(() => {
          setSuspensionModalOpen(false);
          setLoading(false);
        });
    }

    if (statusOnb === OnboardingStatusEnum.SUSPENDED) {
      setLoading(true);
      readmitUser(id, cf)
        .then((_res) => {
          setStatusOnb(OnboardingStatusEnum.ONBOARDING_OK);
        })
        .catch((error) =>
          addError({
            id: 'READMIT_USER',
            blocking: false,
            error,
            techDescription: 'An error occurred readmitting user',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          })
        )
        .finally(() => {
          setSuspensionModalOpen(false);
          setLoading(false);
        });
    }
    setSuspensionModalOpen(false);
  };

  const renderTitle = (buttonType: string) => {
    switch (buttonType) {
      case 'SUSPEND':
        return t('pages.initiativeUserDetails.suspendModal.suspendUserTitle');
      case 'READMIT':
        return t('pages.initiativeUserDetails.suspendModal.readmitUserTitle');
      case 'EXCLUDE':
        return t('pages.initiativeUserDetails.suspendModal.excludeUserTitle');
      default:
        return null;
    }
  };

  const renderDescription = (buttonType: string) => {
    switch (buttonType) {
      case 'SUSPEND':
        return t('pages.initiativeUserDetails.suspendModal.suspendUserDescription');
      case 'READMIT':
        return t('pages.initiativeUserDetails.suspendModal.readmitUserDescription');
      case 'EXCLUDE':
        return t('pages.initiativeUserDetails.suspendModal.excludeUserDescription');
      default:
        return null;
    }
  };

  const renderBtnLabel = (buttonType: string) => {
    switch (buttonType) {
      case 'SUSPEND':
        return t('pages.initiativeUserDetails.suspendModal.suspendBtn');
      case 'READMIT':
        return t('pages.initiativeUserDetails.suspendModal.readmitBtn');
      case 'EXCLUDE':
        return t('pages.initiativeUserDetails.suspendModal.excludeBtn');
      default:
        return null;
    }
  };

  return (
    <Modal
      aria-labelledby="suspend-user-modal-title"
      aria-describedby="suspend-user-modal-description"
      open={suspensionModalOpen}
      onClose={() => setSuspensionModalOpen(false)}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      data-testid="suspend-user-modal"
    >
      <Fade in={suspensionModalOpen} data-testid="fade-test">
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
          <Typography variant="h6">{renderTitle(buttonType)}</Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            {renderDescription(buttonType)}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridTemplateRows: 'auto',
              gridTemplateAreas: `". . . . . . cancelBtn cancelBtn cancelBtn suspendBtn suspendBtn suspendBtn"`,
              gap: 1,
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              sx={{ gridArea: 'cancelBtn', justifySelf: 'end' }}
              onClick={() => setSuspensionModalOpen(false)}
              data-testid="cancel-button-test"
            >
              {t('pages.initiativeUserDetails.suspendModal.backBtn')}
            </Button>
            <Button
              variant="contained"
              sx={{ gridArea: 'suspendBtn', justifySelf: 'end' }}
              onClick={() => {
                handleSuspendUser();
              }}
              data-testid="suspend-test"
            >
              {renderBtnLabel(buttonType)}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SuspensionModal;
