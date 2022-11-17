import { Paper, Box, Typography, Button, Breadcrumbs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UpdateIcon from '@mui/icons-material/Update';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArticleIcon from '@mui/icons-material/Article';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { matchPath } from 'react-router';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES, { BASE_ROUTE } from '../../routes';
import { getGroupOfBeneficiaryStatusAndDetail } from '../../services/groupsService';
import {
  initiativeStatistics,
  updateInitiativePublishedStatus,
} from '../../services/intitativeService';
import ConfirmPublishInitiativeModal from '../components/ConfirmPublishInitiativeModal';
import DeleteInitiativeModal from '../components/DeleteInitiativeModal';
import { USER_PERMISSIONS } from '../../utils/constants';
import { usePermissions } from '../../hooks/usePermissions';
import { numberWithCommas, renderInitiativeStatus } from '../../helpers';
import { Initiative } from '../../model/Initiative';
import StatusSnackBar from './components/StatusSnackBar';
import DateReference from './components/DateReference';

interface MatchParams {
  id: string;
}

const InitiativeOverview = () => {
  const { t } = useTranslation();

  const initiativeSel = useAppSelector(initiativeSelector);
  const history = useHistory();
  const [openInitiativeOverviewDeleteModal, setOpenInitiativeOverviewDeleteModal] = useState(false);
  const [openSnackbar, setOpenSnackBar] = useState(true);
  const [statusFile, setStatusFile] = useState('');
  const [beneficiaryReached, setBeneficiaryReached] = useState<number | undefined>(undefined);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [accruedRewards, setAccruedRewards] = useState('');
  const [onboardedCitizenCount, setOnboardedCitizenCount] = useState(0);
  const [lastUpdatedDateTime, setLastUpdatedDateTime] = useState('');

  const addError = useErrorDispatcher();
  const setLoading = useLoading('PUBLISH_INITIATIVE');

  const userCanReviewInitiative = usePermissions(USER_PERMISSIONS.REVIEW_INITIATIVE);
  const userCanUpdateInitiative = usePermissions(USER_PERMISSIONS.UPDATE_INITIATIVE);
  const userCanPublishInitiative = usePermissions(USER_PERMISSIONS.PUBLISH_INITIATIVE);
  const userCanDeleteInitiative = usePermissions(USER_PERMISSIONS.DELETE_INITIATIVE);
  const userCanSuspendInitiative = usePermissions(USER_PERMISSIONS.SUSPEND_INITIATIVE);

  const match = matchPath(location.pathname, {
    path: [ROUTES.INITIATIVE_OVERVIEW],
    exact: true,
    strict: false,
  });

  useInitiative();

  const handleCloseSnackBar = () => setOpenSnackBar(false);

  const handleOpenSnackBar = () => setOpenSnackBar(true);

  useEffect(() => {
    // eslint-disable-next-line no-prototype-builtins
    if (match !== null && match.params.hasOwnProperty('id')) {
      const { id } = match.params as MatchParams;
      if (
        initiativeSel.generalInfo.beneficiaryKnown === 'true' &&
        initiativeSel.initiativeId === id &&
        initiativeSel.status !== 'DRAFT'
      ) {
        setLoading(true);
        getGroupOfBeneficiaryStatusAndDetail(initiativeSel.initiativeId)
          .then((res) => {
            const statusFileRes = res.status || '';
            const beneficiaryReachedRes = res.beneficiariesReached || undefined;
            setStatusFile(statusFileRes);
            setBeneficiaryReached(beneficiaryReachedRes);
            handleOpenSnackBar();
          })
          .catch((error) => {
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
          })
          .finally(() => setLoading(false));
      } else if (initiativeSel.generalInfo.beneficiaryKnown === 'false') {
        handleCloseSnackBar();
      }
    }
  }, [
    JSON.stringify(match),
    initiativeSel.initiativeId,
    JSON.stringify(initiativeSel.generalInfo),
  ]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    // eslint-disable-next-line no-prototype-builtins
    if (match !== null && match.params.hasOwnProperty('id')) {
      const { id } = match.params as MatchParams;
      if (initiativeSel.initiativeId === id && initiativeSel.status === 'PUBLISHED') {
        setLoading(true);
        initiativeStatistics(id)
          .then((res) => {
            if (typeof res.accruedRewards === 'string') {
              setAccruedRewards(res.accruedRewards);
            }
            if (typeof res.onboardedCitizenCount === 'number') {
              setOnboardedCitizenCount(res.onboardedCitizenCount);
            }
            if (typeof res.lastUpdatedDateTime === 'object') {
              const lastUpdateDateTimeStr = res.lastUpdatedDateTime.toLocaleString('fr-BE');
              const lastUpdateDateTimeNoSec = lastUpdateDateTimeStr.substring(
                0,
                lastUpdateDateTimeStr.length - 3
              );
              setLastUpdatedDateTime(lastUpdateDateTimeNoSec);
            }
          })
          .catch((error) => {
            if (Object.keys(error).length > 0) {
              addError({
                id: 'GET_GROUP_OF_BENEFICIARY_STATUS_AND_DETAIL_ERROR',
                blocking: false,
                error,
                techDescription:
                  'An error occurred getting groups of beneficiary status and detail',
                displayableTitle: t('errors.title'),
                displayableDescription: t('errors.getDataDescription'),
                toNotify: true,
                component: 'Toast',
                showCloseIcon: true,
              });
            }
          })
          .finally(() => setLoading(false));
      }
    }
  }, [JSON.stringify(match), initiativeSel.initiativeId, initiativeSel.status]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [initiativeSel.initiativeId]);

  const publishInitiative = (id: string | undefined, userCanPublishInitiative: boolean) => {
    if (userCanPublishInitiative && initiativeSel.status === 'APPROVED' && typeof id === 'string') {
      setLoading(true);
      updateInitiativePublishedStatus(id)
        .then((_res) => {
          history.replace(ROUTES.HOME);
        })
        .catch((error) => {
          setPublishModalOpen(false);
          addError({
            id: 'UPDATE_INITIATIVE_TO_PUBLISHED_STATUS_ERROR',
            blocking: false,
            error,
            techDescription: 'An error occurred publishing initiative',
            displayableDescription: t('errors.cantPublishInitiative'),
            toNotify: true,
            component: 'Toast',
            showCloseIcon: true,
          });
        })
        .finally(() => setLoading(false));
    }
  };

  const handleCloseInitiativeOverviewDeleteModal = () =>
    setOpenInitiativeOverviewDeleteModal(false);

  const handleOpenInitiativeOverviewDeleteModal = () => setOpenInitiativeOverviewDeleteModal(true);

  const handleUpdateInitiative = (id: string | undefined) => {
    if (userCanUpdateInitiative) {
      history.replace(`${BASE_ROUTE}/iniziativa/${id}`);
    }
  };

  const handleViewDetails = (id: string | undefined) => {
    history.replace(`${BASE_ROUTE}/dettagli-iniziativa/${id}`);
  };

  const renderConditionalInfoStatus = (status: string | undefined) => {
    switch (status) {
      case 'IN_REVISION':
        if (!userCanReviewInitiative) {
          return (
            <Box sx={{ gridColumn: 'span 4' }}>
              <ButtonNaked
                size="small"
                onClick={() => handleViewDetails(initiativeSel.initiativeId)}
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
        } else {
          return;
        }
      case 'APPROVED':
      case 'PUBLISHED':
        return <DateReference initiative={initiativeSel} handleViewDetails={handleViewDetails} />;
      case 'DRAFT':
      case 'TO_CHECK':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  const conditionalSubtitleRendering = (status: string | undefined) => {
    switch (status) {
      case 'DRAFT':
        return userCanUpdateInitiative
          ? t('pages.initiativeOverview.next.status.subtitleDraft')
          : null;
      case 'IN_REVISION':
        return userCanReviewInitiative
          ? t('pages.initiativeOverview.next.status.reviewInitiative')
          : t('pages.initiativeOverview.next.status.subtitleReview');
      case 'TO_CHECK':
        return userCanReviewInitiative
          ? t('pages.initiativeOverview.next.status.waitForReview')
          : t('pages.initiativeOverview.next.status.subtitleModify');
      case 'APPROVED':
        return userCanPublishInitiative
          ? t('pages.initiativeOverview.next.status.subtitleApproved')
          : t('pages.initiativeOverview.next.status.waitForPublish');
      case 'PUBLISHED':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  const conditionalStartIconRendering = (status: string | undefined) => {
    switch (status) {
      case 'DRAFT':
        return <EditIcon />;
      case 'IN_REVISION':
        return userCanReviewInitiative ? null : <UpdateIcon color="disabled" />;
      case 'TO_CHECK':
        return userCanReviewInitiative ? null : <ArticleIcon />;
      case 'APPROVED':
        return <PublishIcon />;
      case 'PUBLISHED':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  const conditionalOnClickRendering = (status: string | undefined) => {
    switch (status) {
      case 'DRAFT':
        return handleUpdateInitiative(initiativeSel.initiativeId);
      case 'IN_REVISION':
        return handleViewDetails(initiativeSel.initiativeId);
      case 'TO_CHECK':
        return handleUpdateInitiative(initiativeSel.initiativeId);
      case 'APPROVED':
        return setPublishModalOpen(true);
      case 'PUBLISHED':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  const conditionaButtonNameRendering = (status: string | undefined) => {
    switch (status) {
      case 'DRAFT':
        return t('pages.initiativeOverview.next.status.draft');
      case 'IN_REVISION':
        return userCanReviewInitiative
          ? t('pages.initiativeOverview.next.status.checkInitiative')
          : t('pages.initiativeOverview.next.status.review');
      case 'TO_CHECK':
        return userCanReviewInitiative
          ? t('pages.initiativeOverview.next.status.checkInitiative')
          : t('pages.initiativeOverview.next.status.modify');
      case 'APPROVED':
        return t('pages.initiativeOverview.next.status.approved');
      case 'PUBLISHED':
      case 'CLOSED':
      case 'SUSPENDED':
      default:
        return null;
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const renderNextStatus = (status: string, beneficiaryReached: number | undefined) => (
    <>
      <Box sx={{ gridColumn: 'span 12' }}>
        <Typography variant="body2">
          {conditionalSubtitleRendering(initiativeSel.status)}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 12' }}>
        {status === 'IN_REVISION' && (
          <Button
            disabled={!userCanReviewInitiative && status === 'IN_REVISION' ? true : false}
            variant="contained"
            startIcon={conditionalStartIconRendering(initiativeSel.status)}
            onClick={() => conditionalOnClickRendering(initiativeSel.status)}
            data-testid="contion-onclick-test"
          >
            {conditionaButtonNameRendering(initiativeSel.status)}
          </Button>
        )}
        {status === 'DRAFT' && userCanUpdateInitiative && (
          <Button
            variant="contained"
            startIcon={conditionalStartIconRendering(initiativeSel.status)}
            onClick={() => conditionalOnClickRendering(initiativeSel.status)}
            data-testid="contion-onclick-test"
          >
            {conditionaButtonNameRendering(initiativeSel.status)}
          </Button>
        )}

        {status === 'TO_CHECK' && (
          <Button
            disabled={userCanReviewInitiative ? true : false}
            variant="contained"
            startIcon={conditionalStartIconRendering(initiativeSel.status)}
            onClick={() => conditionalOnClickRendering(initiativeSel.status)}
            data-testid="contion-onclick-test"
          >
            {conditionaButtonNameRendering(initiativeSel.status)}
          </Button>
        )}
        {userCanPublishInitiative && status === 'APPROVED' && (
          <>
            <Button
              variant="contained"
              startIcon={conditionalStartIconRendering(initiativeSel.status)}
              onClick={() => conditionalOnClickRendering(initiativeSel.status)}
              data-testid="contion-onclick-test"
            >
              {conditionaButtonNameRendering(initiativeSel.status)}
            </Button>
            <ConfirmPublishInitiativeModal
              publishModalOpen={publishModalOpen}
              setPublishModalOpen={setPublishModalOpen}
              initiative={initiativeSel}
              beneficiaryReached={beneficiaryReached}
              handlePusblishInitiative={publishInitiative}
              userCanPublishInitiative={userCanPublishInitiative}
            />
          </>
        )}
      </Box>
    </>
  );

  const renderConditionalStatusPublished = (
    initiative: Initiative,
    beneficiariesReached: number | undefined
  ) =>
    initiative.status === 'PUBLISHED' && (
      <>
        <Box sx={{ gridColumn: 'span 12', display: 'inline-flex' }}>
          <Typography variant="body2" sx={{ color: '#5C6F82' }}>
            {t('pages.initiativeOverview.next.lastUpdate')}
          </Typography>
          &nbsp;
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {lastUpdatedDateTime}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="body2">{t('pages.initiativeOverview.next.join')} </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 9', display: 'inline-flex' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {numberWithCommas(onboardedCitizenCount)}
          </Typography>
          &nbsp;
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {initiativeSel.generalInfo.beneficiaryKnown === 'true' &&
              ` /  ${numberWithCommas(beneficiariesReached)}`}
          </Typography>
        </Box>

        <Box sx={{ gridColumn: 'span 3' }}>
          <Typography variant="body2">
            {t('pages.initiativeOverview.next.budgetExhausted')}
          </Typography>
        </Box>
        <Box sx={{ gridColumn: 'span 9', display: 'inline-flex' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {`${numberWithCommas(accruedRewards)} € `}
          </Typography>
          &nbsp;
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {` /  ${numberWithCommas(initiativeSel.generalInfo.budget)} €`}
          </Typography>
        </Box>

        <Box sx={{ gridColumn: 'span 12' }}>
          <Button
            variant="contained"
            startIcon={<FactCheckIcon />}
            onClick={() =>
              history.replace(`${BASE_ROUTE}/utenti-iniziativa/${initiative.initiativeId}`)
            }
          >
            {t('pages.initiativeOverview.next.ViewUsers')}
          </Button>
        </Box>
      </>
    );

  const renderConditionalActions = (id: string | undefined, status: string | undefined) => (
    <Box
      sx={{
        gridColumn: 'span 2',
        textAlign: 'end',
        gridTemplateColumns: 'repeat(2, 1fr)',
        display: 'grid',
        alignItems: 'center',
      }}
    >
      {userCanUpdateInitiative && status === 'APPROVED' ? (
        <Box sx={{ gridColumn: 'span 1', textAlign: 'end' }}>
          <ButtonNaked
            size="small"
            startIcon={<EditIcon />}
            sx={{ color: 'primary.main', padding: 0, fontWeight: 700 }}
            weight="default"
            variant="contained"
            data-testid="view-custom-test"
            onClick={() => handleUpdateInitiative(initiativeSel.initiativeId)}
          >
            {t('pages.initiativeList.actions.update')}
          </ButtonNaked>
        </Box>
      ) : null}

      {userCanDeleteInitiative && status !== 'PUBLISHED' && status !== 'IN_REVISION' ? (
        <Box sx={{ gridColumn: status === 'APPROVED' ? 'span 1' : 'span 2', textAlign: 'end' }}>
          <ButtonNaked
            size="small"
            onClick={handleOpenInitiativeOverviewDeleteModal}
            startIcon={<DeleteOutlineIcon />}
            sx={{ padding: 0, color: 'error.main', fontWeight: 700 }}
            weight="default"
            variant="naked"
            data-testid="view-action-button-test"
          >
            {t('pages.initiativeList.actions.delete')}
          </ButtonNaked>
          <DeleteInitiativeModal
            initiativeId={id}
            initiativeStatus={status}
            openInitiativeDeleteModal={openInitiativeOverviewDeleteModal}
            handleCloseInitiativeDeleteModal={handleCloseInitiativeOverviewDeleteModal}
          />
        </Box>
      ) : userCanSuspendInitiative && status === 'PUBLISHED' ? (
        <Box sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
          <ButtonNaked
            disabled
            size="small"
            onClick={null} // TODO IN NEXT SPRINT
            startIcon={<HighlightOffIcon color="disabled" />}
            sx={{ padding: 0, color: 'error.main', fontWeight: 700 }}
            weight="default"
            variant="naked"
            data-testid="view-action-button-test"
          >
            {t('pages.initiativeList.actions.suspend')}
          </ButtonNaked>
        </Box>
      ) : null}
    </Box>
  );

  const renderTypeSnackBarStatus = (
    status: string,
    beneficiaryReached: number | undefined,
    initiativeStatus: string | undefined,
    initiativeId: string | undefined
  ) => {
    if (userCanReviewInitiative) {
      switch (initiativeStatus) {
        case 'IN_REVISION':
        case 'APPROVED':
          return (
            <StatusSnackBar
              openSnackBar={openSnackbar}
              setOpenSnackBar={setOpenSnackBar}
              fileStatus={status}
              beneficiaryReached={beneficiaryReached}
              initiativeId={initiativeId}
            />
          );
        case 'DRAFT':
        case 'TO_CHECK':
        case 'PUBLISHED':
        case 'CLOSED':
        case 'SUSPENDED':
        default:
          return null;
      }
    } else {
      switch (initiativeStatus) {
        case 'IN_REVISION':
        case 'APPROVED':
        case 'PUBLISHED':
          return (
            <StatusSnackBar
              openSnackBar={openSnackbar}
              setOpenSnackBar={setOpenSnackBar}
              fileStatus={status}
              beneficiaryReached={beneficiaryReached}
              initiativeId={initiativeId}
            />
          );
        case 'DRAFT':
        case 'TO_CHECK':
        case 'CLOSED':
        case 'SUSPENDED':
        default:
          return null;
      }
    }
  };

  return (
    <Box sx={{ width: '100%', px: 2 }}>
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
              onClick={() => history.replace(ROUTES.HOME)}
              startIcon={<ArrowBackIcon />}
              sx={{ color: 'primary.main', fontSize: '1rem', marginBottom: '3px' }}
              weight="default"
            >
              {t('breadcrumbs.back')}
            </ButtonNaked>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbs.initiatives')}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {initiativeSel.initiativeName}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ gridColumn: 'span 10' }}>
          <TitleBox
            title={
              typeof initiativeSel.initiativeName === 'string' ? initiativeSel.initiativeName : ''
            }
            mbTitle={3}
            mtTitle={3}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
        {renderConditionalActions(initiativeSel.initiativeId, initiativeSel.status)}
        {renderTypeSnackBarStatus(
          statusFile,
          beneficiaryReached,
          initiativeSel.status,
          initiativeSel.initiativeId
        )}
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
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignContent: 'start',
            rowGap: 3,
          }}
        >
          <Box sx={{ pt: 3, gridColumn: 'span 12' }}>
            <Typography variant="h6">{t('pages.initiativeOverview.info.title')}</Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 4' }}>
            <Typography variant="body2">{t('pages.initiativeOverview.info.idCode')}</Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 8' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {initiativeSel.initiativeId}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 4' }}>
            <Typography variant="body2">
              {t('pages.initiativeOverview.info.creationData')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 8' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {typeof initiativeSel.creationDate === 'object' &&
                initiativeSel.creationDate.toLocaleDateString('fr-BE')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 4' }}>
            <Typography variant="body2">{t('pages.initiativeOverview.info.lastModify')}</Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 8' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {initiativeSel.updateDate
                ? typeof initiativeSel.updateDate === 'object' &&
                  initiativeSel.updateDate.toLocaleDateString('fr-BE')
                : '-'}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 4' }}>
            <Typography variant="body2">
              {t('pages.initiativeOverview.info.initiativeState')}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: 'span 8' }}>{renderInitiativeStatus(initiativeSel.status)}</Box>
          <Box sx={{ gridColumn: 'span 12' }}>
            {renderConditionalInfoStatus(initiativeSel.status)}
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
            gridTemplateColumns: 'repeat(12, 1fr)',
            alignContent: 'start',
            rowGap: 3,
          }}
        >
          <Box
            sx={{
              pt: 3,
              gridColumn: 'span 12',
            }}
          >
            {initiativeSel.status === 'PUBLISHED' ? (
              <Typography variant="h6">{t('pages.initiativeOverview.next.stats')}</Typography>
            ) : (
              <Typography variant="h6">{t('pages.initiativeOverview.next.title')}</Typography>
            )}
          </Box>
          {initiativeSel.status === 'DRAFT' ||
          initiativeSel.status === 'IN_REVISION' ||
          initiativeSel.status === 'TO_CHECK' ||
          initiativeSel.status === 'APPROVED'
            ? renderNextStatus(initiativeSel.status, beneficiaryReached)
            : renderConditionalStatusPublished(initiativeSel, beneficiaryReached)}
        </Paper>
      </Box>
    </Box>
  );
};

export default InitiativeOverview;
