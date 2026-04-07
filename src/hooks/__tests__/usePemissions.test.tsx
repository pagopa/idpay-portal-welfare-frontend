import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { usePermissions } from '../usePermissions';
import { USER_PERMISSIONS } from '../../utils/constants';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

let tempHook: boolean;
function HookWrapper({ action }: { action: USER_PERMISSIONS }): null {
  tempHook = usePermissions(action);
  return null;
}

describe('usePermissions', () => {
  const mockUseSelector = useSelector as jest.Mock;

  beforeEach(() => {
    mockUseSelector.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns false when permissions selector does not provide an array', () => {
    mockUseSelector.mockReturnValueOnce(undefined);

    render(<HookWrapper action={USER_PERMISSIONS.CREATE_INITIATIVE} />);

    expect(tempHook).toBe(false);
  });

  test('returns true when the matching permission is enabled', () => {
    mockUseSelector.mockReturnValueOnce([
      {
        name: USER_PERMISSIONS.CREATE_INITIATIVE,
        description: 'Create initiative',
        mode: 'enabled',
      },
    ]);

    render(<HookWrapper action={USER_PERMISSIONS.CREATE_INITIATIVE} />);

    expect(tempHook).toBe(true);
  });

  test('returns false when the permission is missing from the list', () => {
    mockUseSelector.mockReturnValueOnce([
      {
        name: USER_PERMISSIONS.UPDATE_INITIATIVE,
        description: 'Update initiative',
        mode: 'enabled',
      },
    ]);

    render(<HookWrapper action={USER_PERMISSIONS.CREATE_INITIATIVE} />);

    expect(tempHook).toBe(false);
  });

  test('returns false when the matching permission is disabled or missing', () => {
    mockUseSelector.mockReturnValueOnce([
      {
        name: USER_PERMISSIONS.CREATE_INITIATIVE,
        description: 'Create initiative',
        mode: 'disabled',
      },
      {
        name: USER_PERMISSIONS.UPDATE_INITIATIVE,
        description: 'Update initiative',
        mode: 'enabled',
      },
    ]);

    render(<HookWrapper action={USER_PERMISSIONS.CREATE_INITIATIVE} />);

    expect(tempHook).toBe(false);
  });
});
