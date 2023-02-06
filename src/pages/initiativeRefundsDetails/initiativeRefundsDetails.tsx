import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Breadcrumbs, Button, Typography, Paper } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { matchPath } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';

const InitiativeRefundsDetails = () => {
  const history = useHistory();
  const { t } = useTranslation();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);

  interface MatchParams {
    id: string;
    filePath: string;
  }

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_REFUNDS_DETAIL],
    exact: true,
    strict: false,
  });

  const { id, filePath } = (match?.params as MatchParams) || {};
  console.log('id', id);
  console.log('filePath', filePath);
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
              onClick={() => history.replace(`${BASE_ROUTE}/rimborsi-iniziativa/${id}`)}
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
            onClick={() => console.log('clicked')}
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
              12/12/2023
            </Typography>

            <Typography variant="body2" sx={{ gridColumn: 'span 6' }}>
              {t('pages.initiativeRefundsDetails.recap.totalOrders')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 6', fontWeight: 600 }}>
              10000
            </Typography>

            <Typography variant="body2" sx={{ gridColumn: 'span 6' }}>
              {t('pages.initiativeRefundsDetails.recap.totalRefunds')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 6', fontWeight: 600 }}>
              30
            </Typography>

            <Typography variant="body2" sx={{ gridColumn: 'span 6' }}>
              {t('pages.initiativeRefundsDetails.recap.totalWarrant')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 6', fontWeight: 600 }}>
              40
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
              20
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 6' }}>
              {t('pages.initiativeRefundsDetails.recap.status')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 6', fontWeight: 600 }}>
              complete
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default InitiativeRefundsDetails;
