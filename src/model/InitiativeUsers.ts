export interface InitiativeUser {
  beneficiary: string;
  updateStatusDate: Date | string;
  beneficiaryState: string;
}

export interface InitiativeUserToDisplay {
  id: number | undefined;
  beneficiary: string | undefined;
  updateStatusDate: string | undefined;
  beneficiaryState: string | undefined;
}

export interface InitiativeUsersResponse {
  pageNo?: number | undefined;
  pageSize?: number | undefined;
  totalElements?: number | undefined;
  totalPages?: number | undefined;
  content: Array<InitiativeUser>;
}
