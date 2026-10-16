import { render } from '@testing-library/react';
import { PERMISSION_KEYS, useUserPermissions } from '../useUserPermissions';

const mockUseIDPayUser = jest.fn();

jest.mock('../useIDPayUser', () => ({
  useIDPayUser: () => mockUseIDPayUser(),
}));

let hookResult: ReturnType<typeof useUserPermissions>;

const HookWrapper = () => {
  hookResult = useUserPermissions();
  return null;
};

describe('useUserPermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIDPayUser.mockReturnValue(undefined);
  });

  test('returns no disabled actions when the role is missing', () => {
    render(<HookWrapper />);

    expect(hookResult.role).toBeUndefined();
    expect(hookResult.isSupportUser).toBe(false);
    expect(hookResult.isActionDisabled(PERMISSION_KEYS.REPORT_GENERATE)).toBe(false);
  });

  test('disables configured actions for support users', () => {
    mockUseIDPayUser.mockReturnValue({ org_role: 'support' });

    render(<HookWrapper />);

    expect(hookResult.role).toBe('support');
    expect(hookResult.isSupportUser).toBe(true);
    expect(hookResult.isActionDisabled(PERMISSION_KEYS.BATCH_VALIDATE)).toBe(true);
    expect(hookResult.isActionDisabled(PERMISSION_KEYS.TRANSACTION_EDIT_CHECKS)).toBe(true);
    expect(hookResult.isActionDisabled(PERMISSION_KEYS.REPORT_GENERATE)).toBe(true);
  });

  test('keeps actions enabled for non-support users', () => {
    mockUseIDPayUser.mockReturnValue({ org_role: 'operator_l1' });

    render(<HookWrapper />);

    expect(hookResult.isSupportUser).toBe(false);
    expect(hookResult.isActionDisabled(PERMISSION_KEYS.BATCH_VALIDATE)).toBe(false);
    expect(hookResult.isActionDisabled(PERMISSION_KEYS.TRANSACTION_APPROVE)).toBe(false);
  });
});
