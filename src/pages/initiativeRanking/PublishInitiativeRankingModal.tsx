import { Modal, Backdrop, Fade, Box, Typography, Button } from '@mui/material';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  openPublishInitiativeRankingModal: boolean;
  handleClosePublishInitiativeRankingModal: MouseEventHandler;
  initiativeId: string | undefined;
  initiativeName: string | undefined;
  publishInitiativeRanking: any;
};

const PublishInitiativeRankingModal = ({
  openPublishInitiativeRankingModal,
  handleClosePublishInitiativeRankingModal,
  initiativeId,
  initiativeName,
  publishInitiativeRanking,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Modal
      aria-labelledby="publish-initiative-ranking-modal-title"
      aria-describedby="publish-initiative-ranking-modal-description"
      open={openPublishInitiativeRankingModal}
      onClose={handleClosePublishInitiativeRankingModal}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      data-testid="publish-initiative-ranking-modal-test"
    >
      <Fade in={openPublishInitiativeRankingModal} data-testid="fade-test">
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
          <Typography variant="h6">{t('pages.initiativeRanking.publishModal.title')}</Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            {t('pages.initiativeRanking.publishModal.subtitle', { initiativeName })}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridTemplateRows: 'auto',
              gridTemplateAreas: `". . . cancelBtn cancelBtn exitBtn"`,
            }}
          >
            <Button
              variant="outlined"
              sx={{ gridArea: 'cancelBtn', justifySelf: 'start' }}
              onClick={handleClosePublishInitiativeRankingModal}
              data-testid="cancel-button-test"
            >
              {t('pages.initiativeRanking.publishModal.cancelBtn')}
            </Button>
            <Button
              variant="contained"
              sx={{ gridArea: 'exitBtn', justifySelf: 'end' }}
              onClick={() => {
                publishInitiativeRanking(initiativeId);
              }}
              data-testid="publish-button-test"
            >
              {t('pages.initiativeRanking.publishModal.publishBtn')}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PublishInitiativeRankingModal;
