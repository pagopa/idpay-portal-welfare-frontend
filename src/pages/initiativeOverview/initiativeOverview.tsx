import { Paper, Box, Typography, Button, Divider, Snackbar, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { grey } from '@mui/material/colors';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UpdateIcon from '@mui/icons-material/Update';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import SyncIcon from '@mui/icons-material/Sync';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MuiAlert from '@mui/material/Alert';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import { BASE_ROUTE } from '../../routes';
import { getGroupOfBeneficiaryStatusAndDetail } from '../../services/groupsService';
import { initiativeIdSelector } from '../../redux/slices/initiativeSlice';
import InitiativeOverviewDeleteModal from './initiativeOverviewDeleteModal';

const InitiativeOverview = () => {
  const { t } = useTranslation();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  const initiativeId = useAppSelector(initiativeIdSelector);
  const history = useHistory();
  const [openInitiativeOverviewDeleteModal, setOpenInitiativeOverviewDeleteModal] = useState(false);
  const [openSnackbar, setOpenSnackBar] = useState(true);
  const [statusFile, setStatusFile] = useState('');

  useEffect(() => {
    if (initiativeSel.generalInfo.beneficiaryKnown === 'true' && initiativeId) {
      getGroupOfBeneficiaryStatusAndDetail(initiativeId)
        .then((res) => {
          const statusFileRes = res.status || '';
          setStatusFile(statusFileRes);
          console.log('STATUS', res.status);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCloseInitiativeOverviewDeleteModal = () =>
    setOpenInitiativeOverviewDeleteModal(false);

  const handleOpenInitiativeOverviewDeleteModal = () => setOpenInitiativeOverviewDeleteModal(true);

  const handleCloseSnackBar = () => setOpenSnackBar(false);

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

  const peopleReached = (totalBudget: string, budgetPerPerson: string) => {
    const totalBudgetInt = parseInt(totalBudget, 10);
    const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
    return Math.floor(totalBudgetInt / budgetPerPersonInt);
  };

  const timeRemainingToJoin = () => {
    const expirationDate =
      typeof initiativeSel.generalInfo.rankingEndDate === 'object'
        ? initiativeSel.generalInfo.rankingEndDate.getTime()
        : 0;
    const startDate =
      typeof initiativeSel.generalInfo.rankingStartDate === 'object'
        ? initiativeSel.generalInfo.rankingStartDate.getTime()
        : 0;
    return (expirationDate - startDate) / (1000 * 60 * 60 * 24);
  };

  const handleUpdateInitiative = (id: string) => {
    history.push(`${BASE_ROUTE}/iniziativa/${id}`);
  };

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
        return;
      case 'IN_REVISION':
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
      case 'APPROVED':
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
      case 'PUBLISHED':
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
              <HourglassTopIcon color="action" />
            </Box>
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>
              {initiativeSel.generalInfo.rankingStartDate &&
              initiativeSel.generalInfo.rankingEndDate
                ? // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                  timeRemainingToJoin() +
                  ' ' +
                  t('pages.initiativeOverview.info.otherinfo.expiration')
                : '-'}
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
      case 'CLOSED':
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
      case 'CLOSED':
      case 'SUSPENDED':
        return;
      default:
        return null;
    }
  };

  const renderConditionalActionsStatus = (status: string) => {
    switch (status) {
      case 'TO_CHECK':
      case 'APPROVED':
      case 'DRAFT':
        return (
          <>
            <Box sx={{ gridColumn: 'span 1', textAlign: 'end' }}>
              <ButtonNaked
                size="small"
                target="_blank"
                startIcon={<EditIcon />}
                sx={{ color: 'primary.main', padding: 0, fontWeight: 700 }}
                weight="default"
                variant="contained"
                data-testid="view-custom-test"
                onClick={() =>
                  handleUpdateInitiative(
                    typeof initiativeSel.initiativeId === 'string' ? initiativeSel.initiativeId : ''
                  )
                }
              >
                {t('pages.initiativeList.actions.update')}
              </ButtonNaked>
            </Box>

            <InitiativeOverviewDeleteModal
              openInitiativeOverviewDeleteModal={openInitiativeOverviewDeleteModal}
              handleCloseInitiativeOverviewDeleteModal={handleCloseInitiativeOverviewDeleteModal}
            />
            <Box sx={{ gridColumn: 'span 1', textAlign: 'end' }}>
              <ButtonNaked
                size="small"
                onClick={handleOpenInitiativeOverviewDeleteModal}
                target="_blank"
                startIcon={<DeleteOutlineIcon color="error" />}
                sx={{ padding: 0, color: 'error.main', fontWeight: 700 }}
                weight="default"
                variant="contained"
                data-testid="view-delete-test"
              >
                {t('pages.initiativeList.actions.delete')}
              </ButtonNaked>
            </Box>
          </>
        );
      case 'IN_REVISION':
        return;
      case 'PUBLISHED':
        return (
          <Box sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
            <ButtonNaked
              size="small"
              // onClick={}
              target="_blank"
              startIcon={<HighlightOffIcon color="error" />}
              sx={{ padding: 0, color: 'error.main', fontWeight: 700 }}
              weight="default"
              variant="contained"
              data-testid="view-suspend-test"
            >
              {t('pages.initiativeList.actions.suspend')}
            </ButtonNaked>
          </Box>
        );
      case 'CLOSED':
        return;
      case 'SUSPENDED':
        return;
      default:
        return null;
    }
  };

  const renderTypeSnackBarStatus = (status: string) => {
    switch (status) {
      case 'OK':
        return (
          <Snackbar
            open={openSnackbar}
            sx={{ position: 'initial', gridColumn: 'span 10', zIndex: 0 }}
          >
            <MuiAlert
              sx={{
                gridColumn: 'span 10',
                mb: 3,
                width: '100%',
                gridTemplateColumns: 'repeat(10, 1fr)',
              }}
              severity="info"
              elevation={6}
              variant="outlined"
              action={
                <>
                  <ButtonNaked
                    size="medium"
                    target="_blank"
                    sx={{
                      padding: 0,
                      color: 'primary.main',
                      fontWeight: 700,
                      gridColumn: 'span 1',
                    }}
                    weight="default"
                    variant="contained"
                    data-testid="view-users-test"
                  >
                    {t('pages.initiativeOverview.snackBar.users')}
                  </ButtonNaked>
                  <IconButton aria-label="close" onClick={handleCloseSnackBar} sx={{ mx: 1 }}>
                    <CloseIcon />
                  </IconButton>
                </>
              }
            >
              {t('pages.initiativeOverview.snackBar.approved')}{' '}
              {peopleReached(
                initiativeSel.generalInfo.budget,
                initiativeSel.generalInfo.beneficiaryBudget
              )}{' '}
              {t('pages.initiativeOverview.snackBar.recipients')}
            </MuiAlert>
          </Snackbar>
        );
      case 'VALIDATE':
      case 'PROCESSING':
      case 'TO_SCHEDULE':
        return (
          <Snackbar open={openSnackbar} sx={{ position: 'initial', gridColumn: 'span 10' }}>
            <MuiAlert
              sx={{
                gridColumn: 'span 10',
                mb: 3,
                width: '100%',
                gridTemplateColumns: 'repeat(10, 1fr)',
              }}
              severity="info"
              elevation={6}
              variant="outlined"
              icon={<SyncIcon />}
            >
              {t('pages.initiativeOverview.snackBar.pending')}
            </MuiAlert>
          </Snackbar>
        );
      case 'KO':
      case 'PROC_KO':
        return (
          <Snackbar open={openSnackbar} sx={{ position: 'initial', gridColumn: 'span 10' }}>
            <MuiAlert
              sx={{
                gridColumn: 'span 10',
                mb: 3,
                width: '100%',
                gridTemplateColumns: 'repeat(10, 1fr)',
              }}
              severity="error"
              elevation={6}
              variant="outlined"
              action={
                <>
                  <IconButton aria-label="close" onClick={handleCloseSnackBar} sx={{ mx: 1 }}>
                    <CloseIcon />
                  </IconButton>
                </>
              }
            >
              {t('pages.initiativeOverview.snackBar.uploadFailed')}
            </MuiAlert>
          </Snackbar>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Box sx={{ width: '100%', px: 2 }}>
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(10, 1fr)',
            alignItems: 'center',
          }}
        >
          <Box sx={{ gridColumn: 'span 8' }}>
            <TitleBox
              title={
                typeof initiativeSel.initiativeName === 'string' ? initiativeSel.initiativeName : ''
              }
              mbTitle={2}
              mtTitle={2}
              variantTitle="h4"
              variantSubTitle="body1"
            />
          </Box>
          {renderConditionalActionsStatus(
            typeof initiativeSel.status === 'string' ? initiativeSel.status : ''
          )}
          {renderTypeSnackBarStatus(statusFile)}
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            alignItems: 'start',
            columnGap: 2,
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
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>
              {typeof initiativeSel.creationDate === 'object' &&
                initiativeSel.creationDate.toLocaleDateString('fr-BE')}
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>{t('pages.initiativeOverview.info.lastModify')}</Box>
            <Box sx={{ gridColumn: 'span 5', fontWeight: 600 }}>
              {initiativeSel.updateDate
                ? typeof initiativeSel.updateDate === 'object' &&
                  initiativeSel.updateDate.toLocaleDateString('fr-BE')
                : '-'}
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
