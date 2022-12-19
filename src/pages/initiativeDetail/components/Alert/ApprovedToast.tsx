import { CheckCircleOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

type Props = {
  openToast: boolean;
  handleClose: () => void;
};

export default function ApprovedToast({ openToast, handleClose }: Props) {
  const { t } = useTranslation();

  return (
    <Snackbar
      sx={{ pb: 2 }}
      open={openToast}
      onClose={() => handleClose()}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={3000}
      data-testid="snack-bar-test"
    >
      <MuiAlert severity="success" elevation={6} variant="outlined" icon={<CheckCircleOutline />}>
        {t('pages.initiativeDetail.alert.approved')}
      </MuiAlert>
    </Snackbar>
  );
}
