import { Modal, Backdrop, Fade, Box, Typography, Button, Alert } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ButtonNaked } from '@pagopa/mui-italia';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  openPublishInitiativeRankingModal: boolean;
  handleClosePublishInitiativeRankingModal: MouseEventHandler;
  initiativeId: string | undefined;
  fileName: string | undefined;
  publishInitiativeRanking: any;
  downloadInitiativeRanking: any;
};

const PublishInitiativeRankingModal = ({
  openPublishInitiativeRankingModal,
  handleClosePublishInitiativeRankingModal,
  initiativeId,
  fileName,
  publishInitiativeRanking,
  downloadInitiativeRanking,
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
            {t('pages.initiativeRanking.publishModal.subtitle')}
          </Typography>

          <Alert
            severity="info"
            sx={{ mb: 4 }}
            action={
              <ButtonNaked
                component="button"
                onClick={() => downloadInitiativeRanking(initiativeId, fileName)}
                sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
                weight="default"
                size="small"
                startIcon={<FileDownloadIcon />}
              >
                {t('pages.initiativeRanking.publishModal.alertBtn')}
              </ButtonNaked>
            }
          >
            {t('pages.initiativeRanking.publishModal.alertTitle')}
          </Alert>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows: 'auto',
              gridTemplateAreas: `". . cancelBtn exitBtn"`,
            }}
          >
            <Button
              variant="outlined"
              sx={{ gridArea: 'cancelBtn', justifySelf: 'end' }}
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
              data-testid="exit-button-test"
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
