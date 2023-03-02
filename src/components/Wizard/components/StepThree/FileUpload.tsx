import {
  Alert,
  AlertTitle,
  Box,
  FormHelperText,
  IconButton,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
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
import LoadingFile from '../../../LoadingFile/LoadingFile';
import InitUploadBox from '../../../InitUploadBox/InitUploadBox';
import AcceptedFile from '../../../AcceptedFile/AcceptedFile';
import TitleBoxWithHelpLink from '../../../TitleBoxWithHelpLink/TitleBoxWithHelpLink';

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
        <InitUploadBox
          text={t('components.wizard.stepThree.upload.dragAreaText')}
          link={t('components.wizard.stepThree.upload.dragAreaLink')}
        />
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

  return (
    <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>
      <TitleBoxWithHelpLink
        title={t('components.wizard.stepThree.upload.title')}
        subtitle={t('components.wizard.stepThree.upload.subTitle')}
        helpLink={t('helpStaticUrls.wizard.fileUpload')}
        helpLabel={t('components.wizard.common.links.findOut')}
      />

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
              data-testid="close-icon"
            >
              <CloseIcon color="primary" fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>{t(alertTitle)}</AlertTitle>
          <Typography variant="body2">{t(alertDescription)}</Typography>
        </Alert>
      )}

      {fileIsLoading ? (
        <LoadingFile message={t('components.wizard.stepThree.upload.fileIsLoading')} />
      ) : fileAccepted ? (
        <AcceptedFile
          fileName={fileName}
          fileDate={fileDate}
          chipLabel={t('components.wizard.stepThree.upload.validFile')}
          buttonLabel={t('components.wizard.stepThree.upload.changeFile')}
          buttonHandler={setIntiStatus}
        />
      ) : (
        InitStatusPartial
      )}
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
