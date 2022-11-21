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
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';

interface Props {
  setUploadFile: Dispatch<SetStateAction<File | undefined>>;
  fileUplodedOk: boolean;
  fileName: string | undefined;
  fileUploadDate: string | undefined;
}

const UploadServiceIcon = ({ setUploadFile, fileUplodedOk, fileName, fileUploadDate }: Props) => {
  const { t } = useTranslation();
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const [fileIsAcceppted, setFileIsAcceppted] = useState(false);
  const [fileIsRejected, setFileIsRejected] = useState(false);

  useEffect(() => {
    if (fileUplodedOk) {
      setFileIsLoading(false);
      setFileIsRejected(false);
      setFileIsAcceppted(true);
    }
  }, [fileUplodedOk]);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2097152,
    accept: 'image/png',
    onDrop: () => {
      setFileIsLoading(true);
    },
    onDropAccepted: (files) => {
      setUploadFile(files[0]);
    },
    onDropRejected: () => {
      setFileIsLoading(false);
      setFileIsRejected(true);
      setFileIsAcceppted(false);
    },
  });

  const resetStatus = () => {
    setFileIsLoading(false);
    setFileIsRejected(false);
    setFileIsAcceppted(false);
    setUploadFile(undefined);
  };

  const loadingFilePartial = (
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

  const FileAcceptedPartial = (
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
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="body2" fontWeight={600}>
            {fileName}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 3', textAlign: 'right' }}>
          <Typography variant="body2">
            {fileUploadDate}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 5', justifySelf: 'right', px: 2 }}>
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
      {fileIsRejected && (
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setFileIsRejected(false);
              }}
            >
              <CloseIcon color="primary" fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          <AlertTitle>{t('components.wizard.stepThree.upload.invalidFileTitle')}</AlertTitle>
          <Typography variant="body2">
            {t('components.wizard.stepThree.upload.invalidFileDescription')}
          </Typography>
        </Alert>
      )}

      {fileIsLoading
        ? loadingFilePartial
        : fileIsAcceppted
        ? FileAcceptedPartial
        : InitStatusPartial}
    </Box>
  );
};

export default UploadServiceIcon;
