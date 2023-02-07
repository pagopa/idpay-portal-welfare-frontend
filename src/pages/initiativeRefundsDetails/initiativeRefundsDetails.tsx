import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  Box,
  Breadcrumbs,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath } from 'react-router';
import { useHistory } from 'react-router-dom';
import { SasToken } from '../../api/generated/initiative/SasToken';
import { formatedCurrency } from '../../helpers';
import { useInitiative } from '../../hooks/useInitiative';
import {
  InitiativeRefundsDetailsListItem,
  InitiativeRefundsDetailsSummary,
} from '../../model/InitiativeRefunds';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { getRewardFileDownload } from '../../services/intitativeService';
import {
  getRefundsDetailsList,
  getRefundsDetailsSummary,
} from '../../services/__mocks__/initiativeService';

const InitiativeRefundsDetails = () => {
  const history = useHistory();
  const { t } = useTranslation();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const addError = useErrorDispatcher();
  const [detailsSummary, setDetailsSummary] = useState<InitiativeRefundsDetailsSummary>();
  const [rows, setRows] = useState<Array<InitiativeRefundsDetailsListItem>>([]);

  interface MatchParams {
    initiativeId: string;
    exportId: string;
    filePath: string;
  }

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_REFUNDS_DETAIL],
    exact: true,
    strict: false,
  });

  const { initiativeId, exportId, filePath } = (match?.params as MatchParams) || {};
  console.log('id', initiativeId);
  console.log('id', exportId);
  console.log('filePath', filePath);

  useEffect(() => {
    if (typeof initiativeId !== undefined && typeof exportId !== undefined) {
      getRefundsDetailsSummary(initiativeId, exportId)
        .then((res: any) => {
          console.log('res', res);
          setDetailsSummary(res);
        })
        .catch((err: any) => console.log('err', err));
    }
  }, [initiativeId, exportId]);

  useEffect(() => {
    if (typeof initiativeId !== undefined && typeof exportId !== undefined) {
      getTableData(initiativeId, exportId);
    }
  }, [initiativeId, exportId]);

  const getTableData = (
    initiativeId: string,
    exportId: string,
    _trn?: string,
    _status?: string,
    _page?: number
  ) => {
    getRefundsDetailsList(initiativeId, exportId)
      .then((res: any) => {
        console.log('List res', res);
        setRows(res);
      })
      .catch((err: any) => console.log('err', err));
  };

  const downloadURI = (uri: string) => {
    const link = document.createElement('a');
    // eslint-disable-next-line functional/immutable-data
    link.download = 'download';
    // eslint-disable-next-line functional/immutable-data
    link.href = uri;
    // eslint-disable-next-line functional/immutable-data
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadFile = (data: {
    initiativeId: string | undefined;
    filePath: string | undefined;
  }) => {
    if (typeof data.initiativeId === 'string' && typeof data.filePath === 'string') {
      getRewardFileDownload(data.initiativeId, data.filePath)
        .then((res: SasToken) => {
          if (typeof res.sas === 'string') {
            downloadURI(res.sas);
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
              onClick={() => history.replace(`${BASE_ROUTE}/rimborsi-iniziativa/${initiativeId}`)}
              startIcon={<ArrowBackIcon />}
              sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
              weight="default"
              data-testid="back-btn-test"
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
              {t('breadcrumbs.initiativeRefundsDetails')}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 10', mt: 2 }}>
          <TitleBox
            title={filePath}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 2', mt: 2, justifyContent: 'right' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={() => handleDownloadFile({ initiativeId, filePath })}
            data-testid="download-btn-test"
          >
            {t('pages.initiativeRefundsDetails.downloadBtn')}
          </Button>
        </Box>
        <Paper
          sx={{
            display: 'grid',
            gridColumn: 'span 12',
            gridTemplateColumns: 'repeat(12, 1fr)',
            width: '100%',
            mt: 2,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridColumn: 'span 6',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ gridColumn: 'span 6' }}>
              {t('pages.initiativeRefundsDetails.recap.creationDate')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 6', fontWeight: 600 }}>
              {detailsSummary?.createDate
                ? detailsSummary.createDate.toLocaleString('fr-BE', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })
                : '-'}
            </Typography>

            <Typography variant="body2" sx={{ gridColumn: 'span 6' }}>
              {t('pages.initiativeRefundsDetails.recap.totalOrders')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 6', fontWeight: 600 }}>
              {formatedCurrency(detailsSummary?.totalAmount)}
            </Typography>

            <Typography variant="body2" sx={{ gridColumn: 'span 6' }}>
              {t('pages.initiativeRefundsDetails.recap.totalRefunds')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 6', fontWeight: 600 }}>
              {formatedCurrency(detailsSummary?.totalRefundedAmount)}
            </Typography>

            <Typography variant="body2" sx={{ gridColumn: 'span 6' }}>
              {t('pages.initiativeRefundsDetails.recap.totalWarrant')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 6', fontWeight: 600 }}>
              {detailsSummary?.totalRefunds ? detailsSummary.totalRefunds : '-'}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridColumn: 'span 6',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridTemplateRows: 'max-content',
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ gridColumn: 'span 6' }}>
              {t('pages.initiativeRefundsDetails.recap.percentageSuccess')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 6', fontWeight: 600 }}>
              {detailsSummary?.successPercentage ? detailsSummary.successPercentage : '-'}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 6' }}>
              {t('pages.initiativeRefundsDetails.recap.status')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 6', fontWeight: 600 }}>
              {detailsSummary?.status ? detailsSummary.status : '-'}
            </Typography>
          </Box>
        </Paper>
      </Box>
      {rows.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            height: '100%',
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 12', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="25%">iban</TableCell>
                    <TableCell width="40%">Importo</TableCell>
                    <TableCell width="17.5%">Esito</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: 'white' }}>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.iban}</TableCell>
                      <TableCell>{r.amount}</TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          data-testid="download-file-refunds"
                          onClick={() => console.log('clicked')}
                        >
                          <ArrowForwardIos color="primary" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default InitiativeRefundsDetails;
