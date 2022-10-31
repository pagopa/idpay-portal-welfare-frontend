import { checkThresholdChecked } from '../helpers';

describe('testing helper of step four', () => {
  test('Test checkThresholdChecked', () => {
    expect(checkThresholdChecked(undefined)).not.toBeNull();
  });
});
