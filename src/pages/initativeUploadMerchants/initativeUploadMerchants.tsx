import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Paper } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox, Toast, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { matchPath } from 'react-router-dom';
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

const InitativeUploadMerchants = () => {
  const { t } = useTranslation();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const setLoading = useLoading('PUT_INITIATIVE_MERCHANTS_UPLOAD');
  const addError = useErrorDispatcher();
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const [fileRejected, setFileRejected] = useState(false);
  const [fileAccepted, setFileAccepted] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

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
    maxSize: 183500800,
    accept: 'text/csv',
    onDrop: () => {
      setFileRejected(false);
    },
    onDropAccepted: (files) => {
      setFileIsLoading(true);

      if (typeof id === 'string') {
        uploadMerchantList(id, files[0])
          .then((_res) => {
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
        <input {...getInputProps()} data-testid="drop-input" />
        <InitUploadBox
          text={t('pages.initiativeRefundsOutcome.uploadPaper.dragAreaText')}
          link={t('pages.initiativeRefundsOutcome.uploadPaper.dragAreaLink')}
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
        {/* <FormHelperText sx={{ fontSize: '0.875rem' }}>
          {t('pages.initiativeRefundsOutcome.uploadPaper.fileUploadHelpText')}&#160;
          <Link
            href="#"
            download
            target="_blank"
            variant="body2"
            sx={{ fontSize: '0.875rem', fontWeight: 600 }}
          >
            {t('pages.initiativeRefundsOutcome.uploadPaper.fileUploadHelpFileLinkLabel')}
          </Link>
        </FormHelperText> */}
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
            t('breadcrumbs.initiativeRefunds'),
            t('breadcrumbs.initiativeRefundsOutcome'),
          ]}
        />

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
        <TitleBoxWithHelpLink
          title={t('pages.initiativeRefundsOutcome.uploadPaper.title')}
          subtitle={t('pages.initiativeRefundsOutcome.uploadPaper.subtitle')}
          helpLink={t('helpStaticUrls.pages.initiativeRefundsOutcome')}
          helpLabel={t('pages.initiativeRefundsOutcome.uploadPaper.findOut')}
        />

        {fileRejected && (
          <Toast
            open={fileRejected}
            title={t(alertTitle)}
            message={t(alertDescription)}
            onCloseToast={() => {
              setFileRejected(false);
            }}
            logo={InfoOutlinedIcon}
            leftBorderColor="#FE6666"
            toastColorIcon="#FE6666"
            showToastCloseIcon={true}
          />
        )}

        {fileIsLoading ? (
          <LoadingFile message={t('pages.initiativeRefundsOutcome.uploadPaper.fileIsLoading')} />
        ) : (
          InitStatusPartial
        )}
      </Paper>
    </Box>
  );
};

export default InitativeUploadMerchants;
