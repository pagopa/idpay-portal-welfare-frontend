import { Alert, AlertTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  title: string;
  description: string;
  dismissFn: () => void;
}

const RejectedFile = ({ title, description, dismissFn }: Props) => (
  <Alert
    severity="error"
    action={
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={dismissFn}
        data-testid="close-icon"
      >
        <CloseIcon color="primary" fontSize="inherit" />
      </IconButton>
    }
  >
    <AlertTitle>{title}</AlertTitle>
    <Typography variant="body2">{description}</Typography>
  </Alert>
);

export default RejectedFile;
