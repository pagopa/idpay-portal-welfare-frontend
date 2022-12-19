import { numberWithCommas, peopleReached, renderInitiativeStatus } from '../helpers';

describe('switch initiative status', () => {
  const arrOptions = [
    'DRAFT',
    'IN_REVISION',
    'TO_CHECK',
    'APPROVED',
    'PUBLISHED',
    'CLOSED',
    'SUSPENDED',
  ];

  test('switch case test renderInitiativeStatus', () => {
    expect(renderInitiativeStatus('')).toBeNull();
    arrOptions.forEach((option) => {
      expect(renderInitiativeStatus(option)).not.toBeNull();
    });
  });

  test('test numberWithCommas with undefined ', () => {
    expect(numberWithCommas(undefined)).toEqual('0');
  });

  test('test numberWithCommas with number type ', () => {
    expect(numberWithCommas(2)).toEqual('2');
  });

  test('test numberWithCommas string type ', () => {
    expect(numberWithCommas('2')).toEqual('2');
  });

  test('test numberWithCommas string type ', () => {
    expect(peopleReached('20', '2')).toBeDefined();
  });
});
