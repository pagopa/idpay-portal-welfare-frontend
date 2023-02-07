export interface InitiativeRefund {
  id: string;
  notificationDate: Date;
  typology: string;
  rewardsExported: number;
  rewardsResults: number;
  successPercentage: number;
  status: string;
}

export interface InitiativeRefundToDisplay {
  id: string | undefined;
  notificationDate: string | undefined;
  typology: string | undefined;
  rewardsExported: string | undefined;
  rewardsResults: string | undefined;
  successPercentage: string | undefined;
  status: { status: string | undefined; percentageResulted: string | undefined };
  downloadFileInfo: { initiativeId: string | undefined; filePath: string | undefined };
}

export interface InitiativeRefundImports {
  status: any;
  filePath: string | undefined;
  feedbackDate: any;
  rewardsResulted: string | undefined;
  rewardsAdded: string | undefined;
  downloadFileInfo: { initiativeId: string | undefined; filePath: string | undefined };
  errorsSize: number;
}

export interface InitiativeRefundsResponse {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  list: Array<InitiativeRefund>;
}

export interface InitiativeRefundsDetailsSummary {
  createDate: Date | undefined;
  totalAmount: number | undefined;
  totalRefundedAmount: number | undefined;
  totalRefunds: number | undefined;
  successPercentage: number | undefined;
  status: string | undefined;
}

export interface InitiativeRefundsDetailsListItem {
  id: string | undefined;
  iban: string | undefined;
  amount: number | undefined;
  status: string | undefined;
}
