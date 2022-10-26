import { Box, IconButton, Snackbar, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
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
  console.log(initiativeId);

  const { t } = useTranslation();
  const history = useHistory();
  const handleAlertSeverity = (fileStatus: string | undefined) =>
    fileStatus === 'KO' || fileStatus === 'PROC_KO' ? 'error' : 'info';

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
              sx={{ mx: 1 }}
              data-testid="close-bar-test"
            >
              <CloseIcon />
            </IconButton>
          </>
        );
      case 'KO':
      case 'PROC_KO':
        return (
          <IconButton
            aria-label="close"
            onClick={() => setOpenSnackBar(false)}
            sx={{ mx: 1 }}
            data-testid="close-bar-test"
          >
            <CloseIcon />
          </IconButton>
        );
      default:
        return null;
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
      case 'TO_SHEDULE':
      case 'VALIDATE':
      case 'PROCESSING':
        return t('pages.initiativeOverview.snackBar.pending');
      case 'KO':
      case 'PROC_KO':
        return t('pages.initiativeOverview.snackBar.uploadFailed');
      default:
        return null;
    }
  };

  return (
    <Snackbar open={openSnackBar} sx={{ position: 'initial', gridColumn: 'span 12', zIndex: 0 }}>
      <MuiAlert
        sx={{
          gridColumn: 'span 10',
          mb: 3,
          width: '100%',
          gridTemplateColumns: 'repeat(10, 1fr)',
        }}
        severity={handleAlertSeverity(fileStatus)}
        elevation={6}
        variant="outlined"
        icon={handleIconType(fileStatus)}
        action={handleTypeAction(fileStatus)}
      >
        {renderAlertBody(fileStatus, beneficiaryReached)}
      </MuiAlert>
    </Snackbar>
  );
};

export default StatusSnackBar;
