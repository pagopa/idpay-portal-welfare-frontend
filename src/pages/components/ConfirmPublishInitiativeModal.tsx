import { Backdrop, Modal, Fade, Box, Typography, Button } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';

type Props = {
  publishModalOpen: boolean;
  setPublishModalOpen: Dispatch<SetStateAction<boolean>>;
  id: string | undefined;
  handlePusblishInitiative: any;
};

const ConfirmPublishInitiativeModal = ({
  publishModalOpen,
  setPublishModalOpen,
  id,
  handlePusblishInitiative,
}: Props) => {
  const { t } = useTranslation();
  const initiativeSel = useAppSelector(initiativeSelector);

  const peopleReached = (totalBudget: string, budgetPerPerson: string) => {
    const totalBudgetInt = parseInt(totalBudget, 10);
    const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
    return Math.floor(totalBudgetInt / budgetPerPersonInt);
  };

  return (
    <Modal
      aria-labelledby="confirm-publish-initiative-modal-title"
      aria-describedby="confirm-publish-initiative-modal-description"
      open={publishModalOpen}
      onClose={() => setPublishModalOpen(false)}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={publishModalOpen}>
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
            {t('pages.initiativeOverview.next.modalPublish.title')}
          </Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            {t('pages.initiativeOverview.next.modalPublish.subtitle', {
              initiativeName: initiativeSel.initiativeName,
              usersNumber: peopleReached(
                initiativeSel.generalInfo.budget,
                initiativeSel.generalInfo.beneficiaryBudget
              ),
            })}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows: 'auto',
              gridTemplateAreas: `". . cancelBtn pubBtn"`,
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              sx={{ gridArea: 'cancelBtn', justifySelf: 'end' }}
              onClick={() => setPublishModalOpen(false)}
            >
              {t('components.wizard.stepOne.modal.cancelBtn')}
            </Button>
            <Button
              variant="contained"
              sx={{ gridArea: 'pubBtn', justifySelf: 'end' }}
              onClick={() => {
                handlePusblishInitiative(id);
                setPublishModalOpen(false);
              }}
            >
              {t('pages.initiativeOverview.next.status.approved')}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ConfirmPublishInitiativeModal;
