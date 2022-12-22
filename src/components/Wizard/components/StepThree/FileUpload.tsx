import {
  Alert,
  AlertTitle,
  Box,
  Chip,
  FormHelperText,
  IconButton,
  LinearProgress,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { ButtonNaked } from '@pagopa/mui-italia';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import CloseIcon from '@mui/icons-material/Close';
import Toast from '@pagopa/selfcare-common-frontend/components/Toast';
import { WIZARD_ACTIONS } from '../../../../utils/constants';
import {
  getGroupOfBeneficiaryStatusAndDetail,
  uploadGroupOfBeneficiaryPut,
} from '../../../../services/groupsService';
import { initiativeIdSelector } from '../../../../redux/slices/initiativeSlice';
import { useAppSelector } from '../../../../redux/hooks';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setDisabledNext: Dispatch<SetStateAction<boolean>>;
}

const FileUpload = ({ action, setAction, currentStep, setCurrentStep, setDisabledNext }: Props) => {
  const { t } = useTranslation();
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const [fileRejected, setFileRejected] = useState(false);
  const [fileAccepted, setFileAccepted] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileDate, setFileDate] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const initiativeId = useAppSelector(initiativeIdSelector);
  const addError = useErrorDispatcher();
  const setLoading = useLoading('GET_STATUS_AND_DETAIL');
  const [openDraftSavedToast, setOpenDraftSavedToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (initiativeId) {
      setLoading(true);
      getGroupOfBeneficiaryStatusAndDetail(initiativeId)
        .then((res) => {
          const fileNameRes = res.fileName || '';
          const fileUploadingDateTimeRes = res.fileUploadingDateTime || new Date();
          const fileUploadingDateTimeStr = fileUploadingDateTimeRes.toLocaleString('fr-BE');
          setFileName(fileNameRes);
          setFileDate(fileUploadingDateTimeStr);
          setFileRejected(false);
          setFileAccepted(true);
          setFileIsLoading(false);
          setDisabledNext(false);
        })
        .catch((error) => {
          if (!Object.keys(error).length) {
            setIntiStatus();
          } else {
            addError({
              id: 'GET_UPLOADED_FILE_DATA_ERROR',
              blocking: false,
              error,
              techDescription: 'An error occurred getting groups file info',
              displayableTitle: t('errors.title'),
              displayableDescription: t('errors.getFileDataDescription'),
              toNotify: true,
              component: 'Toast',
              showCloseIcon: true,
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2097152,
    accept: 'text/csv',
    onDrop: () => {
      setFileRejected(false);
    },
    onDropAccepted: (files) => {
      setAlertTitle('');
      setAlertDescription('');
      setFileIsLoading(true);
      if (initiativeId) {
        setLoading(true);
        uploadGroupOfBeneficiaryPut(initiativeId, files[0])
          .then((res) => {
            setFileIsLoading(false);
            if (res.status === 'KO') {
              setFileRejected(true);
              const errorKey = res.errorKey;
              const errorRow = res.errorRow;
              switch (errorKey) {
                case 'group.groups.invalid.file.format':
                  setAlertTitle(t('components.wizard.stepThree.upload.invalidFileTitle'));
                  setAlertDescription(
                    t('components.wizard.stepThree.upload.invalidFileTypeDescription')
                  );
                  break;
                case 'group.groups.invalid.file.empty':
                  setAlertTitle(t('components.wizard.stepThree.upload.invalidFileTitle'));
                  setAlertDescription(t('components.wizard.stepThree.upload.notEmptyDescription'));
                  break;
                case 'group.groups.invalid.file.size':
                  setAlertTitle(t('components.wizard.stepThree.upload.invalidFileTitle'));
                  setAlertDescription(
                    t('components.wizard.stepThree.upload.overMaxUploadDescription')
                  );
                  break;
                case 'group.groups.invalid.fiIe':
                case 'group.groups.invalid.file.beneficiary.number.budget':
                  setAlertTitle(
                    t('components.wizard.stepThree.upload.invalidBeneficiaryNumberTitle')
                  );
                  setAlertDescription(
                    t('components.wizard.stepThree.upload.invalidBeneficiaryNumberDescription')
                  );
                  break;
                case 'group.groups.invalid.file.cf.wrong':
                  setAlertTitle(t('components.wizard.stepThree.upload.invalidFileTitle'));
                  setAlertDescription(
                    t('components.wizard.stepThree.upload.invalidRow', { rowNumber: errorRow })
                  );
                  break;
              }
            } else {
              setFileRejected(false);
              setFileAccepted(true);
              setFileName(files[0].name);
              const dateField =
                Object.prototype.toString.call(res.elabTimeStamp) === '[object Date]'
                  ? res.elabTimeStamp
                  : new Date();
              const fileDate = dateField && dateField.toLocaleString('fr-BE');
              setFileDate(fileDate || '');
              setDisabledNext(false);
            }
          })
          .catch((error) => {
            addError({
              id: 'PUT_GROUP_FILE_ERROR',
              blocking: false,
              error,
              techDescription: 'An error occurred saving groups file',
              displayableTitle: t('errors.title'),
              displayableDescription: t('errors.getFileDataDescription'),
              toNotify: true,
              component: 'Toast',
              showCloseIcon: true,
            });
            setAlertTitle(t('components.wizard.stepThree.upload.invalidFileTitle'));
            setAlertTitle(t('components.wizard.stepThree.upload.invalidFileDescription'));
            setFileIsLoading(false);
            setFileRejected(true);
            setFileAccepted(false);
            setDisabledNext(true);
          })
          .finally(() => setLoading(false));
      }
    },
    onDropRejected: (files) => {
      const errorKey = files[0].errors[0].code;
      switch (errorKey) {
        case 'file-invalid-type':
          setAlertTitle(t('components.wizard.stepThree.upload.invalidFileTitle'));
          setAlertDescription(t('components.wizard.stepThree.upload.invalidFileTypeDescription'));
          break;
        case 'file-too-large':
          setAlertTitle(t('components.wizard.stepThree.upload.invalidFileTitle'));
          setAlertDescription(t('components.wizard.stepThree.upload.overMaxUploadDescription'));
          break;
        default:
          setAlertTitle(t('components.wizard.stepThree.upload.invalidFileTitle'));
          setAlertTitle(t('components.wizard.stepThree.upload.invalidFileDescription'));
          break;
      }
      setFileIsLoading(false);
      setFileRejected(true);
      setFileAccepted(false);
      setDisabledNext(true);
    },
  });

  const setIntiStatus = () => {
    setAlertTitle('');
    setAlertDescription('');
    setFileIsLoading(false);
    setFileRejected(false);
    setFileAccepted(false);
    setDisabledNext(true);
  };

  useEffect(() => {
    setDisabledNext(true);
  }, []);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      setCurrentStep(currentStep + 1);
    } else if (action === WIZARD_ACTIONS.DRAFT) {
      setOpenDraftSavedToast(true);
      return;
    } else {
      return;
    }
    setAction('');
  }, [action]);

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
          {t('components.wizard.stepThree.upload.fileIsLoading')}
        </Typography>
        <Box sx={{ gridColumn: 'span 9' }}>
          <LinearProgress />
        </Box>
      </Box>
    </Box>
  );

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
        <input {...getInputProps()} data-testid="drop-input-step3" />
        <Box sx={{ textAlign: 'center', gridColumn: 'span 12' }}>
          <FileUploadIcon sx={{ verticalAlign: 'bottom', color: '#0073E6' }} />
          <Typography variant="body2" sx={{ textAlign: 'center', display: 'inline-grid' }}>
            {t('components.wizard.stepThree.upload.dragAreaText')}&#160;
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', display: 'inline-grid', color: '#0073E6' }}
          >
            {t('components.wizard.stepThree.upload.dragAreaLink')}
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
          {t('components.wizard.stepThree.upload.fileUploadHelpText')}&#160;
          <Link
            href="example_fiscal_code_.csv"
            download
            target="_blank"
            variant="body2"
            sx={{ fontSize: '0.875rem', fontWeight: 600 }}
          >
            {t('components.wizard.stepThree.upload.fileUuploadHelpFileLinkLabel')}
          </Link>
        </FormHelperText>
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
          <Chip label={t('components.wizard.stepThree.upload.validFile')} color="success" />
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
          {t('components.wizard.stepThree.upload.changeFile')}
        </ButtonNaked>
      </Box>
    </Box>
  );

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6">{t('components.wizard.stepThree.upload.title')}</Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', py: 2 }}>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Typography variant="body1">
            {t('components.wizard.stepThree.upload.subTitle')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Link
            sx={{ fontSize: '0.875rem', fontWeight: 700 }}
            href={t('helpStaticUrls.wizard.fileUpload')}
            target="_blank"
            underline="none"
            variant="body2"
          >
            {t('components.wizard.common.links.findOut')}
          </Link>
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

      {fileIsLoading ? LoadingFilePartial : fileAccepted ? FileAcceptedPartial : InitStatusPartial}
      {openDraftSavedToast && (
        <Toast
          open={openDraftSavedToast}
          title={t('components.wizard.common.draftSaved')}
          showToastCloseIcon={true}
          onCloseToast={() => setOpenDraftSavedToast(false)}
        />
      )}
    </Paper>
  );
};

export default FileUpload;
