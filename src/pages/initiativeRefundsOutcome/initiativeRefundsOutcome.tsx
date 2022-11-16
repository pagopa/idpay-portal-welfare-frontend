import {
  Box,
  Breadcrumbs,
  Button,
  FormHelperText,
  Paper,
  Typography,
  Link,
  LinearProgress,
  Chip,
  Alert,
  IconButton,
  AlertTitle,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonNaked } from '@pagopa/mui-italia';
import { matchPath } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import { putDispFileUpload } from '../../services/intitativeService';

const InitiativeRefundsOutcome = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const [fileRejected, setFileRejected] = useState(false);
  const [fileAccepted, setFileAccepted] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileDate, setFileDate] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const addError = useErrorDispatcher();

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_REFUNDS_OUTCOME],
    exact: true,
    strict: false,
  });
  console.log(match);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2097152,
    accept:
      'application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip',
    onDrop: () => {
      setFileRejected(false);
    },
    onDropAccepted: (files) => {
      setFileIsLoading(true);
      if (typeof initiativeSel.initiativeId === 'string') {
        putDispFileUpload(initiativeSel.initiativeId, fileName, files[0])
          .then((_res) => {
            const uploadedFileName = files[0].name;
            const uploadedFileDate = new Date(files[0].lastModified).toLocaleString('fr-BE');
            setFileName(uploadedFileName);
            setFileDate(uploadedFileDate);
            setFileIsLoading(false);
            setFileRejected(false);
            setFileAccepted(true);
          })
          .catch((error) => {
            setAlertTitle(t('pages.initiativeRefundsOutcome.uploadPaper.invalidFileTitle'));
            setAlertDescription(
              t('pages.initiativeRefundsOutcome.uploadPaper.invalidFileDescription')
            );
            addError({
              id: 'PUT_DISP_FILE_ERROR',
              blocking: false,
              error,
              techDescription: 'An error occurred saving dispositive file',
              displayableTitle: t('errors.title'),
              displayableDescription: t('errors.getFileDataDescription'),
              toNotify: true,
              component: 'Toast',
              showCloseIcon: true,
            });
            setFileIsLoading(false);
            setFileRejected(true);
            setFileAccepted(false);
          });
      }
    },
    onDropRejected: (files) => {
      const errorKey = files[0].errors[0].code;
      switch (errorKey) {
        case 'file-invalid-type':
          setAlertTitle(t('pages.initiativeRefundsOutcome.uploadPaper.invalidFileTitle'));
          setAlertDescription(
            t('pages.initiativeRefundsOutcome.uploadPaper.invalidFileTypeDescription')
          );
          break;
        case 'file-too-large':
          setAlertTitle(t('pages.initiativeRefundsOutcome.uploadPaper.invalidFileTitle'));
          setAlertDescription(
            t('pages.initiativeRefundsOutcome.uploadPaper.overMaxUploadDescription')
          );
          break;
        default:
          setAlertTitle(t('pages.initiativeRefundsOutcome.uploadPaper.invalidFileTitle'));
          setAlertDescription(
            t('pages.initiativeRefundsOutcome.uploadPaper.invalidFileDescription')
          );
          break;
      }
      setFileIsLoading(false);
      setFileRejected(true);
      setFileAccepted(false);
    },
  });

  const setIntiStatus = () => {
    setAlertTitle('');
    setAlertDescription('');
    setFileIsLoading(false);
    setFileRejected(false);
    setFileAccepted(false);
  };

  const InitStatusPartial = (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        py: 2,
        my: 1,
      }}
    >
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
        {...getRootProps({ className: 'dropzone' })}
      >
        <input {...getInputProps()} />
        <Box sx={{ textAlign: 'center', gridColumn: 'span 12' }}>
          <FileUploadIcon sx={{ verticalAlign: 'bottom', color: '#0073E6' }} />
          <Typography variant="body2" sx={{ textAlign: 'center', display: 'inline-grid' }}>
            {t('pages.initiativeRefundsOutcome.uploadPaper.dragAreaText')}&#160;
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', display: 'inline-grid', color: '#0073E6' }}
          >
            {t('pages.initiativeRefundsOutcome.uploadPaper.dragAreaLink')}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 12',
          alignItems: 'center',
          justifyItems: 'center',
          width: '100%',
          py: 1,
          px: 3,
        }}
      >
        <FormHelperText sx={{ fontSize: '0.875rem' }}>
          {t('pages.initiativeRefundsOutcome.uploadPaper.fileUploadHelpText')}&#160;
          <Link
            href="#"
            download
            target="_blank"
            variant="body2"
            sx={{ fontSize: '0.875rem', fontWeight: 600 }}
          >
            {t('pages.initiativeRefundsOutcome.uploadPaper.fileUuploadHelpFileLinkLabel')}
          </Link>
        </FormHelperText>
      </Box>
    </Box>
  );

  const LoadingFilePartial = (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        py: 2,
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
          {t('pages.initiativeRefundsOutcome.uploadPaper.fileIsLoading')}
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
        py: 2,
        my: 1,
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
            {fileName}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 4', textAlign: 'right' }}>
          <Typography variant="body2">{fileDate}</Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 3', justifySelf: 'right', px: 2 }}>
          <Chip label={t('pages.initiativeRefundsOutcome.uploadPaper.validFile')} color="success" />
        </Box>
      </Box>
      <Box sx={{ gridColumn: 'span 12', py: 2 }}>
        <ButtonNaked
          size="small"
          component="button"
          onClick={setIntiStatus}
          startIcon={<FileUploadIcon />}
          sx={{ color: 'primary.main' }}
          weight="default"
        >
          {t('pages.initiativeRefundsOutcome.uploadPaper.changeFile')}
        </ButtonNaked>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(12, 1fr)',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'grid', gridColumn: 'span 12' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <ButtonNaked
              component="button"
              onClick={() =>
                history.replace(`${BASE_ROUTE}/rimborsi-iniziativa/${initiativeSel.initiativeId}`)
              }
              startIcon={<ArrowBackIcon />}
              sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
              weight="default"
            >
              {t('breadcrumbs.back')}
            </ButtonNaked>
            <Typography color="text.primary" variant="body2">
              {initiativeSel.initiativeName}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbs.initiativeRefunds')}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbs.initiativeRefundsOutcome')}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 12', mt: 2 }}>
          <TitleBox
            title={t('pages.initiativeRefundsOutcome.title')}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
      </Box>
      <Paper sx={{ display: 'grid', width: '100%', mt: 2, px: 3 }}>
        <Box sx={{ py: 3 }}>
          <Typography variant="h6">
            {t('pages.initiativeRefundsOutcome.uploadPaper.title')}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)' }}>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Typography variant="body2">
              {t('pages.initiativeRefundsOutcome.uploadPaper.subtitle')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 12' }}>
            <Button size="small" href="" sx={{ p: 0 }}>
              {t('pages.initiativeRefundsOutcome.uploadPaper.findOut')}
            </Button>
          </Box>
        </Box>

        {fileRejected && (
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setFileRejected(false);
                }}
              >
                <CloseIcon color="primary" fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>{t(alertTitle)}</AlertTitle>
            <Typography variant="body2">{t(alertDescription)}</Typography>
          </Alert>
        )}

        {fileIsLoading
          ? LoadingFilePartial
          : fileAccepted
          ? FileAcceptedPartial
          : InitStatusPartial}
      </Paper>
    </Box>
  );
};

export default InitiativeRefundsOutcome;
