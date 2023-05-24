import {
  Alert,
  AlertTitle,
  FormHelperText,
  IconButton,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { matchPath } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import InitUploadBox from '../../components/InitUploadBox/InitUploadBox';
import LoadingFile from '../../components/LoadingFile/LoadingFile';
import TitleBoxWithHelpLink from '../../components/TitleBoxWithHelpLink/TitleBoxWithHelpLink';
import { initiativePagesBreadcrumbsContainerStyle } from '../../helpers';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { uploadMerchantList } from '../../services/merchantsService';
import BreadcrumbsBox from '../components/BreadcrumbsBox';
import AcceptedFile from '../../components/AcceptedFile/AcceptedFile';

const InitativeUploadMerchants = () => {
  const { t } = useTranslation();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const [fileRejected, setFileRejected] = useState(false);
  const [fileAccepted, setFileAccepted] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileDate, setFileDate] = useState('');

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_MERCHANT_UPLOAD],
    exact: true,
    strict: false,
  });

  interface MatchParams {
    id: string;
  }

  const { id } = (match?.params as MatchParams) || {};

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2097152,
    accept: 'text/csv',
    onDrop: () => {
      setFileRejected(false);
    },
    onDropAccepted: (files) => {
      if (typeof id === 'string') {
        uploadMerchantList(id, files[0])
          .then((res) => {
            if (res.status === 'OK') {
              setFileName(files[0].name);
              const dateField =
                Object.prototype.toString.call(files[0].lastModified) === '[object Date]'
                  ? files[0].lastModified
                  : new Date();
              const fileDate = dateField && dateField.toLocaleString('fr-BE');
              setFileDate(fileDate || '');
              setFileIsLoading(false);
              setFileRejected(false);
              setFileAccepted(true);
            } else {
              setAlertTitle(t('pages.initiativeMerchantUpload.uploadPaper.errorTitle'));
              switch (res.errorKey) {
                case 'merchant.invalid.file.empty':
                  setAlertDescription(t('pages.initiativeMerchantUpload.uploadPaper.emptyFile'));
                  break;
                case 'merchant.invalid.file.format':
                  setAlertDescription(
                    t('pages.initiativeMerchantUpload.uploadPaper.wrongFileType')
                  );
                  break;
                case 'merchant.invalid.file.name':
                  setAlertDescription(
                    t('pages.initiativeMerchantUpload.uploadPaper.fileNameError')
                  );
                  break;
                case 'merchant.invalid.file.size':
                  setAlertDescription(
                    t('pages.initiativeMerchantUpload.uploadPaper.fileTooLarge', { x: 2 })
                  );
                  break;
                case 'merchant.missing.required.fields':
                  setAlertDescription(
                    t('pages.initiativeMerchantUpload.uploadPaper.missingRow', { x: res.errorRow })
                  );
                  break;
                case 'merchant.invalid.file.cf.wrong':
                  setAlertDescription(
                    t('pages.initiativeMerchantUpload.uploadPaper.wrongCf', { x: res.errorRow })
                  );
                  break;
                case 'merchant.invalid.file.iban.wrong':
                  setAlertDescription(
                    t('pages.initiativeMerchantUpload.uploadPaper.wrongIban', { x: res.errorRow })
                  );
                  break;
                case 'merchant.invalid.file.email.wrong':
                  setAlertDescription(
                    t('pages.initiativeMerchantUpload.uploadPaper.wrongEmail', { x: res.errorRow })
                  );
                  break;
                default:
                  setAlertDescription(
                    t('pages.initiativeMerchantUpload.uploadPaper.errorDescription')
                  );
                  break;
              }
              setFileIsLoading(false);
              setFileAccepted(false);
              setFileRejected(true);
            }
          })
          .catch((_error) => {
            setAlertTitle(t('pages.initiativeMerchantUpload.uploadPaper.errorTitle'));
            setAlertDescription(t('pages.initiativeMerchantUpload.uploadPaper.errorDescription'));
            setFileIsLoading(false);
            setFileAccepted(false);
            setFileRejected(true);
          });
      }
    },
    onDropRejected: (files) => {
      const errorKey = files[0].errors[0].code;
      switch (errorKey) {
        case 'file-invalid-type':
          setAlertTitle(t('pages.initiativeMerchantUpload.uploadPaper.errorTitle'));
          setAlertDescription(t('pages.initiativeMerchantUpload.uploadPaper.wrongFileType'));
          break;
        case 'file-too-large':
          setAlertTitle(t('pages.initiativeMerchantUpload.uploadPaper.errorTitle'));
          setAlertDescription(
            t('pages.initiativeMerchantUpload.uploadPaper.fileTooLarge', { x: 2 })
          );
          break;
        default:
          setAlertTitle(t('pages.initiativeMerchantUpload.uploadPaper.errorTitle'));
          setAlertDescription(t('pages.initiativeMerchantUpload.uploadPaper.errorDescription'));
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
    setFileName('');
    setFileDate('');
    setFileIsLoading(false);
    setFileRejected(false);
    setFileAccepted(false);
  };

  const InitStatusPartial = (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        pt: 2,
        mt: 1,
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
        <input {...getInputProps()} data-testid="drop-input" />
        <InitUploadBox
          text={t('pages.initiativeMerchantUpload.uploadPaper.dragAreaText')}
          link={t('pages.initiativeMerchantUpload.uploadPaper.dragAreaLink')}
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
          {t('pages.initiativeMerchantUpload.uploadPaper.fileUploadHelpText')}&#160;
          <Link
            href="#"
            download
            target="_blank"
            variant="body2"
            sx={{ fontSize: '0.875rem', fontWeight: 600 }}
          >
            {t('pages.initiativeMerchantUpload.uploadPaper.fileUploadHelpLinkLabel')}
          </Link>
        </FormHelperText>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={initiativePagesBreadcrumbsContainerStyle}>
        <BreadcrumbsBox
          backUrl={`${BASE_ROUTE}/esercenti-iniziativa/${id}`}
          backLabel={t('breadcrumbs.back')}
          items={[
            initiativeSel.initiativeName,
            t('breadcrumbs.initiativeMerchants'),
            t('breadcrumbs.initiativeMerchantUpload'),
          ]}
        />

        <Box sx={{ display: 'grid', gridColumn: 'span 12', mt: 2 }}>
          <TitleBox
            title={t('pages.initiativeMerchantUpload.title')}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
      </Box>

      <Paper sx={{ display: 'grid', width: '100%', my: 2, p: 3 }}>
        <TitleBoxWithHelpLink
          title={t('pages.initiativeMerchantUpload.uploadPaper.title')}
          subtitle={t('pages.initiativeMerchantUpload.uploadPaper.subtitle')}
          helpLink={t('helpStaticUrls.pages.initiativeMerchantUpload')}
          helpLabel={t('pages.initiativeMerchantUpload.uploadPaper.helpLinkLabel')}
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
          <LoadingFile message={t('pages.initiativeMerchantUpload.uploadPaper.fileIsLoading')} />
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
      </Paper>
    </Box>
  );
};

export default InitativeUploadMerchants;
