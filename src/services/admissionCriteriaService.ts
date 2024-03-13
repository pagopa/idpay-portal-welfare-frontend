import { ConfigBeneficiaryRuleArrayDTO } from '../api/generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { InitiativeApi } from '../api/InitiativeApiClient';

export const fetchAdmissionCriteria = (): Promise<ConfigBeneficiaryRuleArrayDTO> => InitiativeApi.getEligibilityCriteriaForSidebar().then((res) => res);
