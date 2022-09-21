import { Paper, Box, Typography, Button, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { grey } from '@mui/material/colors';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UpdateIcon from '@mui/icons-material/Update';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory } from 'react-router-dom';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import { BASE_ROUTE } from '../../routes';

const InitiativeOverview = () => {
  const { t } = useTranslation();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const history = useHistory();

  type ChipProps = {
    label: string;
    color: string;
  };
  const StatusChip = ({ label, color }: ChipProps) => (
    <span
      style={{
        backgroundColor: color,
        padding: '7px 14px',
        borderRadius: '16px',
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );

  const renderInitiativeStatus = (status: string) => {
    /* eslint-disable functional/no-let */
    let statusLabel = '';
    let statusColor = '';
    switch (status) {
      case 'DRAFT':
        statusLabel = t('pages.initiativeList.status.draft');
        statusColor = grey.A200;
        return <StatusChip label={statusLabel} color={statusColor} />;
      case 'IN_REVISION':
        statusLabel = t('pages.initiativeList.status.inRevision');
        statusColor = '#FFD25E';
        return <StatusChip label={statusLabel} color={statusColor} />;
      case 'TO_CHECK':
        statusLabel = t('pages.initiativeList.status.toCheck');
        statusColor = '#FE7A7A';
        return <StatusChip label={statusLabel} color={statusColor} />;
      case 'APPROVED':
        statusLabel = t('pages.initiativeList.status.approved');
        statusColor = '#7FCD7D';
        return <StatusChip label={statusLabel} color={statusColor} />;
      case 'PUBLISHED':
        statusLabel = t('pages.initiativeList.status.published');
        statusColor = '#7ED5FC';
        return <StatusChip label={statusLabel} color={statusColor} />;
      case 'CLOSED':
        statusLabel = t('pages.initiativeList.status.closed');
        statusColor = grey.A200;
        return <StatusChip label={statusLabel} color={statusColor} />;
      case 'SUSPENDED':
        statusLabel = t('pages.initiativeList.status.suspended');
        statusColor = '#FFD25E';
        return <StatusChip label={statusLabel} color={statusColor} />;
      default:
        return <span>{status}</span>;
    }
  };

  const renderConditionalInfoStatus = (status: string) => {
    switch (status) {
      case 'DRAFT':
      case 'IN_REVISION':
        console.log('SONO QUI', initiativeSel.generalInfo.rankingStartDate);
        return (
          <Box
            sx={{
              width: '100%',
              gridTemplateRows: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              rowGap: 3,
              alignContent: 'start',
            }}
          >
            <Divider sx={{ gridColumn: 'span 8' }} />
            <Box sx={{ gridColumn: 'span 8' }}>
              <Typography variant="subtitle1">
                {t('pages.initiativeOverview.info.otherinfo.title')}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              {t('pages.initiativeOverview.info.otherinfo.adhesion')}
            </Box>
            <Box sx={{ gridColumn: 'span 1', textAlign: 'center' }}>
              <AccessTimeFilledIcon color="action" />
            </Box>
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>
              {t('pages.initiativeOverview.info.otherinfo.start')}{' '}
              {typeof initiativeSel.generalInfo.rankingStartDate === 'object' &&
                initiativeSel.generalInfo.rankingStartDate.toLocaleDateString('fr-BE')}
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              {t('pages.initiativeOverview.info.otherinfo.spend')}
            </Box>
            <Box sx={{ gridColumn: 'span 1', textAlign: 'center' }}>
              <AccessTimeFilledIcon color="action" />
            </Box>
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>
              {t('pages.initiativeOverview.info.otherinfo.start')}{' '}
              {typeof initiativeSel.generalInfo.startDate === 'object' &&
                initiativeSel.generalInfo.startDate.toLocaleDateString('fr-BE')}
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              <ButtonNaked
                size="medium"
                target="_blank"
                startIcon={<AssignmentIcon />}
                sx={{ color: 'primary.main', padding: 0 }}
                weight="default"
                variant="contained"
                data-testid="view-datails-test"
              >
                {t('pages.initiativeOverview.info.otherinfo.details')}
              </ButtonNaked>
            </Box>
          </Box>
        );
      case 'TO_CHECK':
        return (
          <Box sx={{ gridColumn: 'span 3' }}>
            <ButtonNaked
              size="small"
              //   href={}
              target="_blank"
              startIcon={<AssignmentIcon />}
              sx={{ color: 'primary.main', padding: 0 }}
              weight="default"
              variant="contained"
              data-testid="view-datails-test"
            >
              {t('pages.initiativeOverview.info.otherinfo.details')}
            </ButtonNaked>
          </Box>
        );
      // eslint-disable-next-line sonarjs/no-duplicated-branches
      case 'APPROVED':
        return (
          <Box sx={{ gridColumn: 'span 3' }}>
            <ButtonNaked
              size="small"
              //   href={}
              target="_blank"
              startIcon={<AssignmentIcon />}
              sx={{ color: 'primary.main', padding: 0 }}
              weight="default"
              variant="contained"
              data-testid="view-datails-test"
            >
              {t('pages.initiativeOverview.info.otherinfo.details')}
            </ButtonNaked>
          </Box>
        );
      case 'PUBLISHED':
        return;
      case 'CLOSED':
        return;
      case 'SUSPENDED':
        return;
      default:
        return null;
    }
  };

  const renderConditionalNextStatus = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return (
          <>
            <Box sx={{ gridColumn: 'span 8' }}>
              {t('pages.initiativeOverview.next.status.subtitleDraft')}
            </Box>
            <Box sx={{ gridColumn: 'span 8' }}>
              <Button variant="contained" startIcon={<EditIcon />}>
                {t('pages.initiativeOverview.next.status.draft')}
              </Button>
            </Box>
          </>
        );
      case 'IN_REVISION':
        return (
          <>
            <Box sx={{ gridColumn: 'span 8' }}>
              {t('pages.initiativeOverview.next.status.subtitleReview')}
            </Box>
            <Box sx={{ gridColumn: 'span 8' }}>
              <Button disabled variant="contained" startIcon={<UpdateIcon color="disabled" />}>
                {t('pages.initiativeOverview.next.status.review')}
              </Button>
            </Box>
          </>
        );
      case 'TO_CHECK':
        return (
          <>
            <Box sx={{ gridColumn: 'span 8' }}>
              {t('pages.initiativeOverview.next.status.subtitleModify')}
            </Box>
            <Box sx={{ gridColumn: 'span 8' }}>
              <Button variant="contained" startIcon={<EditIcon />}>
                {t('pages.initiativeOverview.next.status.modify')}
              </Button>
            </Box>
          </>
        );
      case 'APPROVED':
        return (
          <>
            <Box sx={{ gridColumn: 'span 8' }}>
              {t('pages.initiativeOverview.next.status.subtitleApproved')}
            </Box>
            <Box sx={{ gridColumn: 'span 8' }}>
              <Button variant="contained" startIcon={<PublishIcon />}>
                {t('pages.initiativeOverview.next.status.approved')}
              </Button>
            </Box>
          </>
        );
      case 'PUBLISHED':
        return;
      case 'CLOSED':
        return;
      case 'SUSPENDED':
        return;
      default:
        return null;
    }
  };

  const handleUpdateInitiative = (id: string) => {
    history.push(`${BASE_ROUTE}/iniziativa/${id}`);
  };

  return (
    <>
      <Box sx={{ width: '100%', px: 2 }}>
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(10, 1fr)',
            alignItems: 'start',
          }}
        >
          <Box sx={{ gridColumn: 'span 8' }}>
            <TitleBox
              title={
                typeof initiativeSel.additionalInfo.serviceName === 'string'
                  ? initiativeSel.additionalInfo.serviceName
                  : ''
              }
              mbTitle={2}
              mtTitle={2}
              variantTitle="h4"
              variantSubTitle="body1"
            />
          </Box>
          {initiativeSel.status === 'DRAFT' || initiativeSel.status === 'TO_CHECK' ? (
            <>
              <Box sx={{ gridColumn: 'span 1' }}>
                <ButtonNaked
                  size="small"
                  target="_blank"
                  startIcon={<EditIcon />}
                  sx={{ color: 'primary.main', padding: 0, alignItems: 'end', fontWeight: 700 }}
                  weight="default"
                  variant="contained"
                  data-testid="view-datails-test"
                  onClick={() =>
                    handleUpdateInitiative(
                      typeof initiativeSel.initiativeId === 'string'
                        ? initiativeSel.initiativeId
                        : ''
                    )
                  }
                >
                  {t('pages.initiativeList.actions.update')}
                </ButtonNaked>
              </Box>
              <Box sx={{ gridArea: 'span 1' }}>
                <ButtonNaked
                  size="small"
                  //   href={}
                  target="_blank"
                  startIcon={<DeleteOutlineIcon color="error" />}
                  sx={{ padding: 0, alignItems: 'end', fontWeight: 700 }}
                  weight="default"
                  variant="text"
                  data-testid="view-datails-test"
                  color="error"
                >
                  {t('pages.initiativeList.actions.delete')}
                </ButtonNaked>
              </Box>
            </>
          ) : null}
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            alignItems: 'start',
          }}
        >
          <Paper
            sx={{
              width: '100%',
              px: 3,
              pb: 3,
              gridTemplateRows: 'auto',
              gridColumn: 'span 1',
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              alignContent: 'start',
              rowGap: 3,
            }}
          >
            <Box sx={{ pt: 3, gridColumn: 'span 8' }}>
              <Typography variant="h6">{t('pages.initiativeOverview.info.title')}</Typography>
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>{t('pages.initiativeOverview.info.idCode')}</Box>
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>{initiativeSel.initiativeId} </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              {t('pages.initiativeOverview.info.creationData')}
            </Box>
            <Box sx={{ gridColumn: 'span 5' }}>
              {typeof initiativeSel.creationDate === 'object' &&
                initiativeSel.creationDate.toLocaleDateString('fr-BE')}
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>{t('pages.initiativeOverview.info.lastModify')}</Box>
            <Box sx={{ gridColumn: 'span 5' }}>
              {typeof initiativeSel.updateDate === 'object' &&
                initiativeSel.updateDate.toLocaleDateString('fr-BE')}
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              {t('pages.initiativeOverview.info.initiativeState')}
            </Box>
            <Box sx={{ gridColumn: 'span 5' }}>
              {typeof initiativeSel.status === 'string' &&
                renderInitiativeStatus(initiativeSel.status)}
            </Box>
            <Box sx={{ gridColumn: 'span 8' }}>
              {typeof initiativeSel.status === 'string' &&
                renderConditionalInfoStatus(initiativeSel.status)}
            </Box>
          </Paper>
          <Paper
            sx={{
              width: '100%',
              ml: 2,
              px: 3,
              pb: 3,
              gridTemplateRows: 'auto',
              gridColumn: 'span 1',
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              alignContent: 'start',
              rowGap: 3,
            }}
          >
            <Box sx={{ pt: 3, gridColumn: 'span 8' }}>
              <Typography variant="h6">{t('pages.initiativeOverview.next.title')}</Typography>
            </Box>
            {typeof initiativeSel.status === 'string' &&
              renderConditionalNextStatus(initiativeSel.status)}
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default InitiativeOverview;
