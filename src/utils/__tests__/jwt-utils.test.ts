import { parseJwt } from '../jwt-utils';

describe('parseJwt', () => {
  test('parses the payload when the token is valid', () => {
    const payload = {
      uid: 'user-id',
      name: 'Test User',
      org_name: 'Org',
    };

    const token = `header.${btoa(JSON.stringify(payload))}.signature`;

    expect(parseJwt(token)).toEqual(payload);
  });

  test('returns null when the token cannot be decoded', () => {
    expect(parseJwt('not-a-valid-token')).toBeNull();
  });
});
