import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  IconButton,
} from '@mui/material';

import SyncIcon from '@mui/icons-material/Sync';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ErrorIcon from '@mui/icons-material/Error';
import { matchPath } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useDropzone } from 'react-dropzone';
import { useEffect, useState } from 'react';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import Toast from '@pagopa/selfcare-common-frontend/components/Toast';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import {
  getDispFileErrors,
  getRewardNotificationImportsPaged,
  putDispFileUpload,
} from '../../services/intitativeService';
import { InitiativeRefundImports } from '../../model/InitiativeRefunds';
import LoadingFile from '../../components/LoadingFile/LoadingFile';
import InitUploadBox from '../../components/InitUploadBox/InitUploadBox';
import BreadcrumbsBox from '../components/BreadcrumbsBox';
import {
  downloadURI,
  initUploadBoxStyle,
  initUploadHelperBoxStyle,
  initiativePagesBreadcrumbsContainerStyle,
  initiativePagesTableContainerStyle,
} from '../../helpers';
import TitleBoxWithHelpLink from '../../components/TitleBoxWithHelpLink/TitleBoxWithHelpLink';
import TablePaginator from '../components/TablePaginator';

const InitiativeRefundsOutcome = () => {
  const { t } = useTranslation();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const [fileIsLoading, setFileIsLoading] = useState(false);
  const [fileRejected, setFileRejected] = useState(false);
  const [fileAccepted, setFileAccepted] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [rows, setRows] = useState<Array<InitiativeRefundImports>>([]);
  const addError = useErrorDispatcher();
  const setLoading = useLoading('GET_INITIATIVE_REWARD_IMPORTS');

  interface MatchParams {
    id: string;
  }

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_REFUNDS_OUTCOME],
    exact: true,
    strict: false,
  });

  const { id } = (match?.params as MatchParams) || {};

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 183500800,
    accept:
      'application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip',
    onDrop: () => {
      setFileRejected(false);
    },
    onDropAccepted: (files) => {
      setFileIsLoading(true);
      const uploadedFileName = files[0].name;
      if (typeof id === 'string') {
        putDispFileUpload(id, uploadedFileName, files[0])
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
      <Box sx={initUploadBoxStyle} {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} data-testid="drop-input" />
        <InitUploadBox
          text={t('pages.initiativeRefundsOutcome.uploadPaper.dragAreaText')}
          link={t('pages.initiativeRefundsOutcome.uploadPaper.dragAreaLink')}
        />
      </Box>
      <Box sx={initUploadHelperBoxStyle}>
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

  const getTableData = (initiativeId: string, page: number) => {
    setLoading(true);
    getRewardNotificationImportsPaged(initiativeId, page, 'feedbackDate,DESC')
      .then((res) => {
        if (typeof res.totalElements === 'number') {
          setTotalElements(res.totalElements);
        }
        if (Array.isArray(res.content) && res.content.length > 0) {
          const rowsData = res.content.map((r) => ({
            status: r.status,
            filePath: r.filePath,
            feedbackDate: r.feedbackDate?.toLocaleDateString('fr-BE'),
            rewardsResulted: t('pages.initiativeRefundsOutcome.uploadPaper.rewardsResulted', {
              x: r.rewardsResulted,
            }),
            rewardsAdded: t('pages.initiativeRefundsOutcome.uploadPaper.rewardsAdded', {
              x: r.rewardsResulted - r.rewardsResultedError,
            }),
            downloadFileInfo: { initiativeId: r.initiativeId, filePath: r.filePath },
            errorsSize: r.errorsSize,
          }));
          setRows(rowsData);
        }
      })
      .catch((error) => {
        addError({
          id: 'GET_REWARDS_NOTIFICATION_IMPORTS_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred getting reward notification imports paged data',
          displayableTitle: t('errors.title'),
          displayableDescription: t('errors.getDataDescription'),
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderRefundsImportStatus = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <SyncIcon color="disabled" />;
      case 'WARN':
        return <WarningIcon color="warning" />;
      case 'ERROR':
        return <ErrorIcon color="error" />;
      case 'COMPLETE':
        return <CheckCircleIcon color="success" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof id === 'string') {
      getTableData(id, page);
    }
  }, [id, page]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (fileAccepted === true && typeof id === 'string') {
      setPage(0);
      getTableData(id, 0);
    }
  }, [fileAccepted]);

  const handleDownloadFile = (data: {
    initiativeId: string | undefined;
    filePath: string | undefined;
  }) => {
    if (typeof data.initiativeId === 'string' && typeof data.filePath === 'string') {
      getDispFileErrors(data.initiativeId, data.filePath)
        .then((res) => {
          // eslint-disable-next-line no-prototype-builtins
          if (res.hasOwnProperty('data') && typeof res.data === 'string') {
            const blob = new Blob([res.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const extToReplace = '.zip';
            // eslint-disable-next-line functional/no-let
            let newFileName = data.filePath as string;
            if (newFileName.endsWith(extToReplace)) {
              newFileName = `${newFileName.substring(
                0,
                newFileName.length - extToReplace.length
              )}_errors.csv`;
            }
            downloadURI(url, newFileName);
          }
        })
        .catch((error) => {
          addError({
            id: 'GET_EXPORTS_FILE_ERROR',
            blocking: false,
            error,
            techDescription: 'An error occurred getting export file',
            displayableTitle: t('errors.title'),
            displayableDescription: t('errors.getDataDescription'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        });
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={initiativePagesBreadcrumbsContainerStyle}>
        <BreadcrumbsBox
          backUrl={`${BASE_ROUTE}/rimborsi-iniziativa/${id}`}
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

      {fileAccepted && (
        <Box sx={{ py: 3 }}>
          <Alert variant="outlined" severity="info" icon={<SyncIcon fontSize="inherit" />}>
            {t('pages.initiativeRefundsOutcome.uploadPaper.fileIsOnEvaluation')}
          </Alert>
        </Box>
      )}

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

      {rows.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            backgroundColor: 'white',
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignItems: 'center',
            mt: 5,
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 12', p: 3 }}>
            <Typography variant="h6">
              {t('pages.initiativeRefundsOutcome.uploadPaper.upoloadsHistoryTitle')}
            </Typography>
          </Box>
        </Box>
      )}

      {rows.length > 0 && (
        <Box sx={initiativePagesTableContainerStyle}>
          <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Table>
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{renderRefundsImportStatus(r.status)}</TableCell>
                      <TableCell>{r.filePath}</TableCell>
                      <TableCell>{r.feedbackDate}</TableCell>
                      <TableCell>{r.rewardsResulted}</TableCell>
                      <TableCell>{r.rewardsAdded}</TableCell>
                      <TableCell align="right">
                        {r.errorsSize > 0 && (
                          <IconButton
                            data-testid="download-file"
                            onClick={() => handleDownloadFile(r.downloadFileInfo)}
                          >
                            <FileDownloadIcon color="primary" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePaginator
                page={page}
                setPage={setPage}
                totalElements={totalElements}
                rowsPerPage={10}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InitiativeRefundsOutcome;
