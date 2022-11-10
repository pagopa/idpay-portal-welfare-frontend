import { Box } from '@mui/system';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  Alert,
  AlertTitle,
  Chip,
  FormHelperText,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';

const UploadServiceIcon = () => {
  const { t } = useTranslation();
  const [iconIsLoading, setIconIsLoading] = useState(false);
  const [iconIsAcceppted, setIconIsAcceppted] = useState(false);
  const [iconIsRejected, setIconIsRejected] = useState(false);

  const load = () => setIconIsLoading(false);
  const reject = () => setIconIsRejected(true);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2097152,
    accept: 'image/png',
    onDrop: () => {
      setIconIsLoading(true);
    },
    onDropAccepted: () => {
      setTimeout(load, 3000);
      setIconIsRejected(false);
      setIconIsAcceppted(true);
    },
    onDropRejected: () => {
      setTimeout(load, 3000);
      setTimeout(reject, 3000);
      setIconIsAcceppted(false);
    },
  });

  const resetStatus = () => {
    setIconIsLoading(false);
    setIconIsRejected(false);
    setIconIsAcceppted(false);
  };

  const loadingIconPartial = (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
      }}
    >
      <Box
        sx={{
          gridColumn: 'span 12',
          alignItems: 'center',
          width: '100%',
          border: '1px solid #E3E7EB',
          borderRadius: '10px',
          p: 3,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
        }}
      >
        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
          {t('components.wizard.stepOne.uploadIcon.IconIsLoading')}
        </Typography>
        <Box sx={{ gridColumn: 'span 9' }}>
          <LinearProgress />
        </Box>
      </Box>
    </Box>
  );

  const IconAcceptedPartial = (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
      }}
    >
      <Box
        sx={{
          gridColumn: 'span 12',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          px: 2,
          py: 1,
          borderRadius: '10px',
          border: '1px solid #E3E7EB',
          alignItems: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center', gridColumn: 'span 1', mt: 1 }}>
          <CheckCircleIcon color="success" />
        </Box>
        <Box sx={{ gridColumn: 'span 4' }}>
          <Typography variant="body2" fontWeight={600}>
            Icona
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 4', textAlign: 'right' }}>
          <Typography variant="body2"></Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 3', justifySelf: 'right', px: 2 }}>
          <Chip label={t('components.wizard.stepOne.uploadIcon.validIcon')} color="success" />
        </Box>
      </Box>
      <Box sx={{ gridColumn: 'span 12', pt: 1 }}>
        <ButtonNaked
          size="small"
          component="button"
          onClick={resetStatus}
          startIcon={<FileUploadIcon />}
          sx={{ color: 'primary.main', fontSize: '14px', fontWeight: 700 }}
          weight="default"
        >
          {t('components.wizard.stepOne.uploadIcon.changeIcon')}
        </ButtonNaked>
      </Box>
    </Box>
  );

  const InitStatusPartial = (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)' }}>
      <Box
        sx={{
          gridColumn: 'span 12',
          alignItems: 'center',
          justifyItems: 'center',
          width: '100%',
          border: '1px dashed #0073E6',
          borderRadius: '10px',
          backgroundColor: 'rgba(0, 115, 230, 0.08)',
          p: 3,
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Box sx={{ textAlign: 'center', gridColumn: 'span 12', cursor: 'pointer' }}>
          <FileUploadIcon sx={{ verticalAlign: 'bottom', color: '#0073E6' }} />
          <Typography variant="body2" sx={{ textAlign: 'center', display: 'inline-grid' }}>
            {t('components.wizard.stepOne.uploadIcon.dragAreaText')}&#160;
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', display: 'inline-grid', color: '#0073E6' }}
          >
            {t('components.wizard.stepOne.uploadIcon.dragAreaLink')}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 12',
          alignItems: 'center',
          justifyItems: 'center',
          width: '100%',
        }}
      >
        <FormHelperText sx={{ fontSize: '12px', fontWeight: 600, color: '#5C6F82' }}>
          {t('components.wizard.stepOne.uploadIcon.helperText')}
        </FormHelperText>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'grid', width: '100%', pt: 2 }}>
      {iconIsRejected && (
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setIconIsRejected(false);
              }}
            >
              <CloseIcon color="primary" fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          <AlertTitle>Il file caricato non è valido</AlertTitle>
          <Typography variant="body2">Errore</Typography>
        </Alert>
      )}

      {iconIsLoading
        ? loadingIconPartial
        : iconIsAcceppted
        ? IconAcceptedPartial
        : InitStatusPartial}
    </Box>
  );
};

export default UploadServiceIcon;
