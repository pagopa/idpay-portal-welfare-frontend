import { formatCurrencyFromCents, formatDate, getFileNameFromAzureUrl } from '../formatters';

describe('refund merchants formatters', () => {
  test('formatCurrencyFromCents returns dash for missing value', () => {
    expect(formatCurrencyFromCents(undefined)).toBe('-');
    expect(formatCurrencyFromCents(null as unknown as number)).toBe('-');
  });

  test('formatCurrencyFromCents formats euro amount', () => {
    expect(formatCurrencyFromCents(12345)).toContain('123');
  });

  test('formatDate formats date and time', () => {
    expect(formatDate('2026-03-27T10:05:00.000Z')).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/);
    expect(formatDate()).toBe('-');
  });

  test('getFileNameFromAzureUrl extracts file name', () => {
    const url = 'https://example.blob.core.windows.net/path/my%20file.csv?sig=abc';
    expect(getFileNameFromAzureUrl(url)).toBe('my file.csv');
    expect(getFileNameFromAzureUrl('%')).toBe('');
  });
});
