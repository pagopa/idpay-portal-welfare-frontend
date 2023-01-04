import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { matchPath, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useState } from 'react';
import ROUTES, { BASE_ROUTE } from '../../routes';

const InitiativeUserDetails = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(true);

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_USER_DETAILS],
    exact: true,
    strict: false,
  });

  interface MatchParams {
    id: string;
    cf: string;
  }

  const { id, cf } = (match?.params as MatchParams) || {};

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
              onClick={() => history.replace(`${BASE_ROUTE}/utenti-iniziativa/${id}`)}
              startIcon={<ArrowBackIcon />}
              sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
              weight="default"
              data-testid="back-btn-test"
            >
              {t('breadcrumbs.back')}
            </ButtonNaked>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbs.initiativeUsers')}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbs.initiativeUserDetails')}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {cf}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>
      <Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: '10fr minmax(400px, 2fr)' }}>
        <Box sx={{ gridColumn: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              width: '100%',
              gridTemplateColumns: 'repeat(12, 1fr)',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'grid', gridColumn: 'span 10' }}>
              <TitleBox
                title={cf}
                subTitle={''}
                mbTitle={2}
                mtTitle={2}
                mbSubTitle={5}
                variantTitle="h4"
                variantSubTitle="body1"
              />
            </Box>
            <Box sx={{ display: 'grid', gridColumn: 'span 2' }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => console.log('download .csv')}
                data-testid="download-csv-test"
              >
                {t('pages.initiativeUserDetails.downloadCsvBtn')}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'grid',
              width: '100%',
              gridTemplateColumns: 'repeat(24, 1fr)',
              gridTemplateAreas: `"title title title title title icon . . . . . . . . . . update update update date date date date date"`,
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'inline-flex', gridArea: 'title' }}>
              <Typography variant="h6">
                {t('pages.initiativeUserDetails.initiativeState')}
              </Typography>
            </Box>
            <Box sx={{ display: 'inline-flex', gridArea: 'icon' }}>
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowDetails(!showDetails)}
                data-testid="view-detail-icon"
              >
                <RemoveRedEyeIcon color="primary" fontSize="inherit" />
              </IconButton>
            </Box>
            <Box sx={{ display: 'inline-flex', gridArea: 'update', justifyContent: 'start' }}>
              <Typography variant="body2" color="text.secondary" textAlign="left">
                {t('pages.initiativeUserDetails.updatedOn')}
              </Typography>
            </Box>
            <Box sx={{ display: 'inline-flex', gridArea: 'date', justifyContent: 'start' }}>
              <Typography variant="body2"> 23 giugno 2022, 15:50</Typography>
            </Box>
          </Box>

          <Collapse in={showDetails} sx={{ py: 2 }}>
            <Box
              sx={{
                display: 'grid',
                width: '100%',
                gridTemplateColumns: 'repeat(24, 1fr)',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'grid', gridColumn: 'span 8', pr: 1.5 }}>
                <Card>
                  <CardContent sx={{ pr: 3, pl: '23px', py: 4 }}>
                    <Typography sx={{ fontWeight: 700 }} variant="body2" color="text.secondary">
                      {t('pages.initiativeUserDetails.availableBalance')}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                      500,00 €
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {t('pages.initiativeUserDetails.spendableAmount')}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ display: 'grid', gridColumn: 'span 8', px: 1.5 }}>
                <Card>
                  <CardContent sx={{ px: 3, py: 4 }}>
                    <Typography sx={{ fontWeight: 700 }} variant="body2" color="text.secondary">
                      {t('pages.initiativeUserDetails.refundedBalance')}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                      134,56 €
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {t('pages.initiativeUserDetails.refundedAmount')}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ display: 'grid', gridColumn: 'span 8', pl: 1.5 }}>
                <Card>
                  <CardContent sx={{ px: 3, py: 4 }}>
                    <Typography sx={{ fontWeight: 700 }} variant="body2" color="text.secondary">
                      {t('pages.initiativeUserDetails.balanceToBeRefunded')}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
                      13,67 €
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {t('pages.initiativeUserDetails.importNotRefundedYet')}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Collapse>
        </Box>
        <Box sx={{ gridColumn: 'auto', px: 3 }}>
          <Box sx={{ px: 3, py: 2, backgroundColor: 'background.paper' }}>
            <Typography variant="overline">{t('pages.initiativeUserDetails.alerts')}</Typography>
          </Box>
          <Box sx={{ px: 3, py: 2, mt: 3, backgroundColor: 'background.paper' }}>
            <Typography variant="overline">
              {t('pages.initiativeUserDetails.paymentMethod')}
            </Typography>
          </Box>
          <Box sx={{ px: 3, py: 2, mt: 3, backgroundColor: 'background.paper' }}>
            <Typography variant="overline">{t('pages.initiativeUserDetails.iban')}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InitiativeUserDetails;
