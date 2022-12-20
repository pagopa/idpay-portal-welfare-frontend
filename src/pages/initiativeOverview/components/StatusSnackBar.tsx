import { Box, IconButton, Snackbar, Typography, Alert } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import { ButtonNaked } from '@pagopa/mui-italia';
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { BASE_ROUTE } from '../../../routes';

type Props = {
  openSnackBar: boolean;
  setOpenSnackBar: Dispatch<SetStateAction<boolean>>;
  fileStatus: string | undefined;
  beneficiaryReached: number | undefined;
  initiativeId: string | undefined;
};

const StatusSnackBar = ({
  openSnackBar,
  setOpenSnackBar,
  fileStatus,
  beneficiaryReached,
  initiativeId,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const handleAlertSeverity = (fileStatus: string | undefined) =>
    fileStatus === 'KO' || fileStatus === 'PROC_KO' || fileStatus === '' ? 'error' : 'info';

  const handleIconType = (fileStatus: string | undefined) =>
    fileStatus === 'TO_SCHEDULE' ? <SyncIcon /> : null;

  const handleTypeAction = (fileStatus: string | undefined) => {
    switch (fileStatus) {
      case 'OK':
        return (
          <>
            <ButtonNaked
              size="medium"
              sx={{
                padding: 0,
                color: 'primary.main',
                fontWeight: 700,
                gridColumn: 'span 1',
              }}
              weight="default"
              variant="contained"
              data-testid="view-users-test"
              onClick={() => history.replace(`${BASE_ROUTE}/utenti-iniziativa/${initiativeId}`)}
            >
              {t('pages.initiativeOverview.snackBar.users')}
            </ButtonNaked>
            <IconButton
              aria-label="close"
              onClick={() => setOpenSnackBar(false)}
              sx={{ mx: 1, marginTop: '3px' }}
              data-testid="close-bar-test"
            >
              <CloseIcon />
            </IconButton>
          </>
        );
      case 'KO':
      case 'PROC_KO':
      default:
        return (
          <IconButton
            aria-label="close"
            onClick={() => setOpenSnackBar(false)}
            sx={{ mx: 1, marginTop: '3px' }}
            data-testid="close-bar-test"
          >
            <CloseIcon />
          </IconButton>
        );
    }
  };

  const renderAlertBody = (
    fileStatus: string | undefined,
    beneficiaryReached: number | undefined
  ) => {
    switch (fileStatus) {
      case 'OK':
        return (
          <Box
            sx={{
              display: 'inline-flex',
              gridTemplateColumns: 'repeat(11, 1fr)',
              width: '100%',
            }}
          >
            <Typography>{t('pages.initiativeOverview.snackBar.approved')}&nbsp;</Typography>
            <Typography sx={{ fontWeight: 600, textAlign: 'center' }}>
              {beneficiaryReached}
            </Typography>
            <Typography>&nbsp;{t('pages.initiativeOverview.snackBar.recipients')}</Typography>
          </Box>
        );
      case 'TO_SCHEDULE':
      case 'VALIDATE':
      case 'PROCESSING':
        return (
          <Box
            sx={{
              display: 'inline-flex',
              gridTemplateColumns: 'repeat(11, 1fr)',
              width: '100%',
            }}
          >
            <Typography>{t('pages.initiativeOverview.snackBar.pending')}</Typography>
          </Box>
        );
      case 'KO':
      case 'PROC_KO':
      default:
        return (
          <Box
            sx={{
              display: 'inline-flex',
              gridTemplateColumns: 'repeat(11, 1fr)',
              width: '100%',
            }}
          >
            <Typography>{t('pages.initiativeOverview.snackBar.uploadFailed')}</Typography>
          </Box>
        );
    }
  };

  return (
    <Snackbar open={openSnackBar} sx={{ position: 'initial', gridColumn: 'span 12', zIndex: 0 }}>
      <Alert
        sx={{
          gridColumn: 'span 12',
          mb: 3,
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
          padding: '6px 16px !important',
        }}
        severity={handleAlertSeverity(fileStatus)}
        elevation={6}
        variant="outlined"
        icon={handleIconType(fileStatus)}
        action={handleTypeAction(fileStatus)}
      >
        {renderAlertBody(fileStatus, beneficiaryReached)}
      </Alert>
    </Snackbar>
  );
};

export default StatusSnackBar;
