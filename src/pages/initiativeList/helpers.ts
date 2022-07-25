import i18n from 'i18next';

export interface Data {
  initiativeId: string;
  initiativeName: string;
  status: string;
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
    numeric: true,
    disablePadding: false,
    label: i18n.t('pages.initiativeList.tableColumns.initiativeStatus'),
  },
];

export interface EnhancedTableProps {
  order: Order;
  orderBy: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
}
