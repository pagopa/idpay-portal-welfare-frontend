import i18n from 'i18next';

export interface Data {
  initiativeId: string;
  initiativeName: string;
  creationDate: string;
  updateDate: string;
  status: string;
  id: number;
}

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const dA = a[orderBy] as unknown as string;
  const dB = b[orderBy] as unknown as string;
  if (orderBy === 'creationDate' || orderBy === 'updateDate') {
    const dAArr = dA.split('/');
    const dBArr = dB.split('/');
    const dateA = new Date(
      parseInt(dAArr[2], 10),
      parseInt(dAArr[1], 10) - 1,
      parseInt(dAArr[0], 10)
    );
    const dateB = new Date(
      parseInt(dBArr[2], 10),
      parseInt(dBArr[1], 10) - 1,
      parseInt(dBArr[0], 10)
    );
    if (dateB.getTime() < dateA.getTime()) {
      return -1;
    }
    if (dateB.getTime() > dateA.getTime()) {
      return 1;
    }
    return 0;
  } else {
    if (dB.toLowerCase() < dA.toLowerCase()) {
      return -1;
    }
    if (dB.toLowerCase() > dA.toLowerCase()) {
      return 1;
    }
    return 0;
  }
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
