import { Box } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
// import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import { useHistory } from 'react-router-dom';
import Wizard from '../../components/Wizard/Wizard';
// import { GeneralInfo } from '../../model/Initiative';

// import {
//   setInitiativeId,
//   setOrganizationId,
//   setStatus,
//   setGeneralInfo,
// } from '../../redux/slices/initiativeSlice';
// import { BeneficiaryTypeEnum } from '../../utils/constants';
// import { getInitiativeDetail } from '../../services/intitativeService';
// import ROUTES from '../../routes';
// import { useAppDispatch } from '../../redux/hooks';
// type Props = {
//   initiativeId: string | undefined;
// };

const NewInitiative = () => {
  const { t } = useTranslation();
  // const dispatch = useAppDispatch();
  // const history = useHistory();

  // const parseGeneralInfo = (data: any): GeneralInfo => {
  //   const dataT = {
  //     beneficiaryType: BeneficiaryTypeEnum.PF,
  //     beneficiaryKnown: 'false',
  //     budget: '',
  //     beneficiaryBudget: '',
  //     startDate: '',
  //     endDate: '',
  //     rankingStartDate: '',
  //     rankingEndDate: '',
  //   };
  //   if (typeof data.beneficiaryType !== undefined) {
  //     // eslint-disable-next-line functional/immutable-data
  //     dataT.beneficiaryType =
  //       data.beneficiaryType === 'PF' ? BeneficiaryTypeEnum.PF : BeneficiaryTypeEnum.PG;
  //   }
  //   if (typeof data.beneficiaryKnown !== undefined) {
  //     // eslint-disable-next-line functional/immutable-data
  //     dataT.beneficiaryKnown = data.beneficiaryKnown === true ? 'true' : 'false';
  //   }
  //   if (typeof data.budget !== undefined) {
  //     // eslint-disable-next-line functional/immutable-data
  //     dataT.budget = data.budget.toString();
  //   }
  //   if (typeof data.beneficiaryBudget !== undefined) {
  //     // eslint-disable-next-line functional/immutable-data
  //     dataT.beneficiaryBudget = data.beneficiaryBudget.toString();
  //   }
  //   if (typeof data.startDate !== undefined) {
  //     // eslint-disable-next-line functional/immutable-data
  //     dataT.startDate = data.startDate;
  //   }
  //   if (typeof data.endDate !== undefined) {
  //     // eslint-disable-next-line functional/immutable-data
  //     dataT.endDate = data.endDate;
  //   }
  //   if (typeof data.rankingStartDate !== undefined) {
  //     // eslint-disable-next-line functional/immutable-data
  //     dataT.rankingStartDate = data.rankingStartDate;
  //   }
  //   if (typeof data.rankingEndDate !== undefined) {
  //     // eslint-disable-next-line functional/immutable-data
  //     dataT.rankingEndDate = data.rankingEndDate;
  //   }
  //   return dataT;
  // };

  // useEffect(() => {
  //   if (
  //     history.location.pathname !== ROUTES.NEW_INITIATIVE &&
  //     initiativeId &&
  //     initiativeId?.length > 0
  //   ) {
  //     getInitiativeDetail(initiativeId)
  //       .then((response) => {
  //         dispatch(setInitiativeId(response.initiativeId));
  //         dispatch(setOrganizationId(response.organizationId));
  //         dispatch(setStatus(response.status));
  //         const generalInfo = parseGeneralInfo(response.general);
  //         dispatch(setGeneralInfo(generalInfo));
  //       })
  //       .catch((error) => console.log(error));
  //   } else {
  //     dispatch(setInitiativeId(''));
  //     dispatch(setOrganizationId(''));
  //     dispatch(setStatus(''));
  //   }
  // }, []);

  return (
    <Box width="100%" px={2}>
      <TitleBox
        title={t('pages.newInitiative.title')}
        subTitle={t('pages.newInitiative.subtitle')}
        mbTitle={2}
        mtTitle={2}
        mbSubTitle={5}
        variantTitle="h4"
        variantSubTitle="body1"
      />
      <Wizard />
    </Box>
  );
};
export default NewInitiative;
