import { Alert, Box, Breadcrumbs, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SyncIcon from '@mui/icons-material/Sync';
import { matchPath, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useState } from 'react';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { getInitiativeOnboardingRankingStatusPaged } from '../../services/intitativeService';
import { InitiativeRankingToDisplay } from '../../model/InitiativeRanking';

const InitiativeRanking = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  // const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [rows, setRows] = useState<Array<InitiativeRankingToDisplay>>([]);

  interface MatchParams {
    id: string;
  }

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_RANKING],
    exact: true,
    strict: false,
  });

  const { id } = (match?.params as MatchParams) || {};

  const getTableData = (initiativeId: string, page: number) => {
    getInitiativeOnboardingRankingStatusPaged(initiativeId, page)
      .then((res) => {
        if (typeof res.totalElements === 'number') {
          setTotalElements(res.totalElements);
        }
        if (Array.isArray(res.content) && res.content.length > 0) {
          const rowsData = res.content.map((r) => ({
            beneficiary: r.beneficiary,
            ranking: r.ranking,
            rankingValue: `${r.rankingValue}€`,
            criteriaConsensusTimeStamp: r.criteriaConsensusTimeStamp.toLocaleString('fr-BE'),
          }));
          setRows(rowsData);
        }
      })
      .catch((error) => console.log(error));
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
              onClick={() => history.replace(`${BASE_ROUTE}/panoramica-iniziativa/${id}`)}
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
              {t('breadcrumbs.initiativeRanking')}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 12', mt: 2 }}>
          <TitleBox
            title={t('pages.initiativeRanking.title')}
            subTitle={t('pages.initiativeRanking.subtitle')}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
      </Box>

      {rows.length > 0 ? (
        <div>todo list</div>
      ) : (
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'grid', gridColumn: 'span 12', mb: 5 }}>
            <Alert severity="info" variant="outlined" elevation={4} icon={<SyncIcon />}>
              <Typography variant="body2">{t('pages.initiativeRanking.alertText')}</Typography>
            </Alert>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridColumn: 'span 12',
              justifyContent: 'center',
              py: 2,
              backgroundColor: 'white',
            }}
          >
            <Typography variant="body2">{t('pages.initiativeRanking.noData')}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InitiativeRanking;
