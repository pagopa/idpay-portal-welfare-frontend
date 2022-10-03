import { Box, IconButton, Snackbar, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SyncIcon from '@mui/icons-material/Sync';
import { ButtonNaked } from '@pagopa/mui-italia';
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Initiative } from '../../../model/Initiative';

type Props = {
  openSnackBar: boolean;
  setOpenSnackBar: Dispatch<SetStateAction<boolean>>;
  fileStatus: string | undefined;
  initiative: Initiative;
};

const StatusSnackBar = ({ openSnackBar, setOpenSnackBar, fileStatus, initiative }: Props) => {
  const { t } = useTranslation();
  const handleAlertSeverity = (fileStatus: string | undefined) =>
    fileStatus === 'KO' || fileStatus === 'PROC_KO' ? 'error' : 'info';

  const peopleReached = (totalBudget: string, budgetPerPerson: string) => {
    const totalBudgetInt = parseInt(totalBudget, 10);
    const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
    return Math.floor(totalBudgetInt / budgetPerPersonInt);
  };

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
            >
              {t('pages.initiativeOverview.snackBar.users')}
            </ButtonNaked>
            <IconButton aria-label="close" onClick={() => setOpenSnackBar(false)} sx={{ mx: 1 }}>
              <CloseIcon />
            </IconButton>
          </>
        );
      case 'KO':
      case 'PROC_KO':
        return (
          <IconButton aria-label="close" onClick={() => setOpenSnackBar(false)} sx={{ mx: 1 }}>
            <CloseIcon />
          </IconButton>
        );
      default:
        return null;
    }
  };

  const renderAlertBody = (fileStatus: string | undefined, initiative: Initiative) => {
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
              {peopleReached(
                initiative.generalInfo.budget,
                initiative.generalInfo.beneficiaryBudget
              )}
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
        {renderAlertBody(fileStatus, initiative)}
      </MuiAlert>
    </Snackbar>
  );
};

export default StatusSnackBar;
