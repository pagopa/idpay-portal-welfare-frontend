import { ConfigBeneficiaryRuleArrayDTO } from '../api/generated/initiative/apiClient';
import { InitiativeApi } from '../api/InitiativeApiClient';

export const fetchAdmissionCriteria = (): Promise<ConfigBeneficiaryRuleArrayDTO> => InitiativeApi.getEligibilityCriteriaForSidebar().then((res) => res);
