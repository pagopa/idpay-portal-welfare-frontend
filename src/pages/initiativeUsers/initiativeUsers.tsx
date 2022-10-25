// import { useEffect } from 'react';
// import { matchPath } from 'react-router';
// import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory } from 'react-router-dom';
import { useInitiative } from '../../hooks/useInitiative';
import { useAppSelector } from '../../redux/hooks';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import ROUTES from '../../routes';
// import { getGroupOfBeneficiaryStatusAndDetail } from '../../services/groupsService';

// interface MatchParams {
//   id: string;
// }

const InitiativeUsers = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useInitiative();
  const initiativeSel = useAppSelector(initiativeSelector);
  // const addError = useErrorDispatcher();

  // const match = matchPath(location.pathname, {
  //   path: [ROUTES.INITIATIVE_USERS],
  //   exact: true,
  //   strict: false,
  // });

  // useEffect(() => {
  //   // eslint-disable-next-line no-prototype-builtins
  //   if (match !== null && match.params.hasOwnProperty('id')) {
  //     const { id } = match.params as MatchParams;
  //     if (
  //       initiativeSel.generalInfo.beneficiaryKnown === 'true' &&
  //       initiativeSel.initiativeId === id &&
  //       initiativeSel.status !== 'DRAFT'
  //     ) {
  //       getGroupOfBeneficiaryStatusAndDetail(initiativeSel.initiativeId)
  //         .then((res) => {
  //           console.log(res);
  //         })
  //         .catch((error) => {
  //           addError({
  //             id: 'GET_UPLOADED_FILE_DATA_ERROR',
  //             blocking: false,
  //             error,
  //             techDescription: 'An error occurred getting groups file info',
  //             displayableTitle: t('errors.title'),
  //             displayableDescription: t('errors.getFileDataDescription'),
  //             toNotify: true,
  //             component: 'Toast',
  //             showCloseIcon: true,
  //           });
  //         });
  //     }
  //   }
  // }, [
  //   JSON.stringify(match),
  //   initiativeSel.initiativeId,
  //   JSON.stringify(initiativeSel.generalInfo),
  // ]);

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
              sx={{ color: 'primary.main' }}
              weight="default"
            >
              {t('breadcrumbs.exit')}
            </ButtonNaked>
            <Typography color="text.primary" variant="body2">
              {t('breadcrumbs.initiatives')}
            </Typography>
            <Typography color="text.primary" variant="body2">
              {initiativeSel.initiativeName}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 12' }}>
          <TitleBox
            title={t('pages.initiativeUsers.title')}
            subTitle={t('pages.initiativeUsers.subtitle')}
            mbTitle={2}
            mtTitle={2}
            mbSubTitle={5}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InitiativeUsers;
