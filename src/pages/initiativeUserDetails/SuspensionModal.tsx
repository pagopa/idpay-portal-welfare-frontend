import { Backdrop, Modal, Fade, Box, Typography, Button } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusEnum as OnboardingStatusEnum } from '../../api/generated/initiative/OnboardingStatusDTO';

type Props = {
  suspensionModalOpen: boolean;
  setSuspensionModalOpen: Dispatch<SetStateAction<boolean>>;
  statusOnb: OnboardingStatusEnum | undefined;
  buttonType: string;
};

const SuspensionModal = ({
  suspensionModalOpen,
  setSuspensionModalOpen,
  // statusOnb,
  buttonType,
}: Props) => {
  const { t } = useTranslation();

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
                console.log('suspend');
                setSuspensionModalOpen(false);
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
