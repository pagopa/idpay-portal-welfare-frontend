import i18n from 'i18next';
import { BeneficiaryTypeEnum } from '../../utils/constants';
import { GeneralInfo } from '../../model/Initiative';

export interface Data {
  initiativeId: string;
  initiativeName: string;
  creationDate: string;
  updateDate: string;
  status: string;
  id: number;
}

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type Order = 'asc' | 'desc';

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: ReadonlyArray<T>, comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  // eslint-disable-next-line functional/immutable-data
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

export const headCells: ReadonlyArray<HeadCell> = [
  {
    id: 'initiativeName',
    numeric: false,
    disablePadding: false,
    label: i18n.t('pages.initiativeList.tableColumns.initiativeName'),
  },
  {
    id: 'initiativeId',
    numeric: false,
    disablePadding: true,
    label: i18n.t('pages.initiativeList.tableColumns.initiativeId'),
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: i18n.t('pages.initiativeList.tableColumns.initiativeStatus'),
  },
  {
    id: 'id',
    numeric: true,
    disablePadding: false,
    label: '',
  },
];

export interface EnhancedTableProps {
  order: Order;
  orderBy: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
}

export const parseGeneralInfo = (data: any): GeneralInfo => {
  const dataT = {
    beneficiaryType: BeneficiaryTypeEnum.PF,
    beneficiaryKnown: 'false',
    budget: '',
    beneficiaryBudget: '',
    startDate: '',
    endDate: '',
    rankingStartDate: '',
    rankingEndDate: '',
  };
  if (typeof data.beneficiaryType !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.beneficiaryType =
      data.beneficiaryType === 'PF' ? BeneficiaryTypeEnum.PF : BeneficiaryTypeEnum.PG;
  }
  if (typeof data.beneficiaryKnown !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.beneficiaryKnown = data.beneficiaryKnown === true ? 'true' : 'false';
  }
  if (typeof data.budget !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.budget = data.budget.toString();
  }
  if (typeof data.beneficiaryBudget !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.beneficiaryBudget = data.beneficiaryBudget.toString();
  }
  if (typeof data.startDate !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.startDate = data.startDate;
  }
  if (typeof data.endDate !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.endDate = data.endDate;
  }
  if (typeof data.rankingStartDate !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.rankingStartDate = data.rankingStartDate;
  }
  if (typeof data.rankingEndDate !== undefined) {
    // eslint-disable-next-line functional/immutable-data
    dataT.rankingEndDate = data.rankingEndDate;
  }
  return dataT;
};
