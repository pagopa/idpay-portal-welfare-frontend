import { Box } from '@mui/system';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Chip, FormHelperText, LinearProgress, Typography } from '@mui/material';
import Toast from '@pagopa/selfcare-common-frontend/components/Toast';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatFileName } from '../../../../helpers';

interface Props {
  setUploadFile: Dispatch<SetStateAction<File | undefined>>;
  setFileUploadedOk: Dispatch<SetStateAction<boolean>>;
  fileUplodedOk: boolean;
  fileUplodedKo: boolean;
  fileName: string | undefined;
  fileUploadDate: string | undefined;
  setFileName: Dispatch<SetStateAction<string>>;
  setUploadDate: Dispatch<SetStateAction<string>>;
}

const UploadServiceIcon = ({
  setUploadFile,
  setFileUploadedOk,
  fileUplodedOk,
  fileUplodedKo,
  fileName,
  fileUploadDate,
  setFileName,
  setUploadDate,
}: Props) => {
  const { t } = useTranslation();
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const [fileIsAcceppted, setFileIsAcceppted] = useState(false);
  const [fileIsRejected, setFileIsRejected] = useState(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertDescription, setAlertDescription] = useState<string>('');

  useEffect(() => {
    if (fileUplodedOk) {
      setFileIsLoading(false);
      setFileIsRejected(false);
      setFileIsAcceppted(true);
    }
  }, [fileUplodedOk]);

  useEffect(() => {
    if (fileUplodedKo) {
      resetStatus();
    }
  }, [fileUplodedKo]);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 1048576,
    accept: 'image/png',
    onDrop: () => {
      setFileIsLoading(true);
    },
    onDropAccepted: (files) => {
      setUploadFile(files[0]);
      setFileName(files[0].name);
      const dateField =
        Object.prototype.toString.call(files[0].lastModified) === '[object Date]'
          ? files[0].lastModified
          : new Date();
      const fileDate = dateField && dateField.toLocaleString('fr-BE');
      setUploadDate(fileDate || '');
      setFileIsLoading(false);
      setFileIsRejected(false);
      setFileIsAcceppted(true);
    },
    onDropRejected: (files) => {
      const errorKey = files[0].errors[0].code;
      switch (errorKey) {
        case 'file-invalid-type':
          setAlertTitle(t('components.wizard.stepOne.uploadIcon.invalidFileTitle'));
          setAlertDescription(
            t('components.wizard.stepOne.uploadIcon.invalidFileTypeLogoDescription')
          );
          break;
        case 'file-too-large':
          setAlertTitle(t('components.wizard.stepOne.uploadIcon.invalidFileTitle'));
          setAlertDescription(
            t('components.wizard.stepOne.uploadIcon.overMaxUploadLogoDescription')
          );
          break;
        default:
          setAlertTitle(t('components.wizard.stepOne.uploadIcon.invalidFileTitle'));
          setAlertTitle(t('components.wizard.stepOne.uploadIcon.invalidFileDescription'));
          break;
      }
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
    setFileUploadedOk(false);
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
          px: 3,
          py: 2,
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
        alignItems: 'center',
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
            {formatFileName(fileName)}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 3', textAlign: 'right' }}>
          <Typography variant="body2">{fileUploadDate}</Typography>
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
        <input {...getInputProps()} data-testid="drop-input" />
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
        <Toast
          open={fileIsRejected}
          title={alertTitle}
          message={alertDescription}
          onCloseToast={() => {
            setFileIsRejected(false);
          }}
          logo={InfoOutlinedIcon}
          leftBorderColor="#FE6666"
          toastColorIcon="#FE6666"
          showToastCloseIcon={true}
        />
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
