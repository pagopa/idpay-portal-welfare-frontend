import { renderInitiativeStatus } from '../helpers';

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
});
