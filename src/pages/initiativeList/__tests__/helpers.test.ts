import { descendingComparator, getComparator, stableSort } from '../helpers';

type Row = {
  creationDate: string;
  updateDate: string;
  initiativeId: string;
};

describe('initiativeList helpers', () => {
  const rowA: Row = {
    creationDate: '08/11/2022',
    updateDate: '10/11/2022',
    initiativeId: 'initiative_1',
  };
  const rowB: Row = {
    creationDate: '07/11/2022',
    updateDate: '09/11/2022',
    initiativeId: 'initiative_2',
  };
  const rowC: Row = {
    creationDate: '09/11/2022',
    updateDate: '11/11/2022',
    initiativeId: 'initiative_3',
  };

  test('descendingComparator handles creationDate branch', () => {
    expect(descendingComparator(rowA, rowA, 'creationDate')).toBe(0);
    expect(descendingComparator(rowA, rowC, 'creationDate')).toBe(1);
    expect(descendingComparator(rowA, rowB, 'creationDate')).toBe(-1);
  });

  test('descendingComparator handles updateDate branch', () => {
    expect(descendingComparator(rowA, rowA, 'updateDate')).toBe(0);
    expect(descendingComparator(rowA, rowC, 'updateDate')).toBe(1);
    expect(descendingComparator(rowA, rowB, 'updateDate')).toBe(-1);
  });

  test('descendingComparator handles non-date branch case-insensitively', () => {
    expect(descendingComparator(rowA, rowA, 'initiativeId')).toBe(0);
    expect(descendingComparator(rowA, rowB, 'initiativeId')).toBe(1);
    expect(descendingComparator(rowB, rowA, 'initiativeId')).toBe(-1);
    expect(descendingComparator(rowA, rowC, 'initiativeId')).toBe(1);
  });

  test('getComparator returns different behavior for desc and asc', () => {
    const descComparator = getComparator('desc', 'creationDate');
    const ascComparator = getComparator('asc', 'creationDate');

    expect(descComparator(rowA, rowB)).toBe(-1);
    expect(ascComparator(rowA, rowB)).toBe(1);
  });

  test('stableSort keeps stable order when comparator returns 0', () => {
    const input = [{ id: 'first' }, { id: 'second' }, { id: 'third' }];
    const sorted = stableSort(input, () => 0);

    expect(sorted).toEqual(input);
  });

  test('stableSort sorts values using the provided comparator', () => {
    const input = [rowA, rowB, rowC];
    const sortedAsc = stableSort(input, getComparator('asc', 'creationDate'));
    const sortedDesc = stableSort(input, getComparator('desc', 'creationDate'));

    expect(sortedAsc.map((r) => r.creationDate)).toEqual(['07/11/2022', '08/11/2022', '09/11/2022']);
    expect(sortedDesc.map((r) => r.creationDate)).toEqual(['09/11/2022', '08/11/2022', '07/11/2022']);
  });
});