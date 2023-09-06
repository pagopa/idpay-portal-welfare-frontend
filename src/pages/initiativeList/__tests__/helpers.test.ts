import { descendingComparator, getComparator, Order, stableSort } from '../helpers';

describe('helper.ts of initiativeList', () => {
  const orderByC: any = 'creationDate';
  const orderByU: any = 'updateDate';
  const orderByInitiativeId: any = 'initiativeId';

  const orderAsc: Order = 'asc';
  const orderDesc: Order = 'desc';

  const mockedCompA = {
    creationDate: '08/11/2022',
    initiativeId: '2',
  };
  const mockedCompB = {
    creationDate: '07/11/2022',
    initiativeId: '1',
  };
  const mockedCompC = {
    creationDate: '09/11/2022',
    initiativeId: '3',
  };

  const arr: any = ['1', '2'];
  const comp: any = {
    a: 1,
    b: 0,
  };

  //   const mockedParam = (a: string | number, b: string | number) =>
  //     descendingComparator(a, b, orderByC);

  test('descendingComparator', () => {
    expect(descendingComparator(mockedCompA, mockedCompA, orderByC)).toBe(0);
    expect(descendingComparator(mockedCompA, mockedCompC, orderByC)).toBe(1);
    expect(descendingComparator(mockedCompA, mockedCompB, orderByC)).toBe(-1);
    expect(descendingComparator(mockedCompA, mockedCompA, orderByInitiativeId)).toBe(0);
    expect(descendingComparator(mockedCompA, mockedCompB, orderByInitiativeId)).toBe(-1);
    expect(descendingComparator(mockedCompA, mockedCompC, orderByInitiativeId)).toBe(1);
  });

  test('getComparator', () => {
    // expect(getComparator(orderAsc, orderByU)).toReturn(mockedParam);
    // expect(getComparator(orderDesc, orderByU)).toReturn;
  });

  test('stableSortw', () => {
    expect(stableSort(arr, getComparator(comp.a, comp.b))).toEqual(['1', '2']);
  });
});
