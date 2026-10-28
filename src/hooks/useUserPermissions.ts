import { useMemo } from 'react';
import { useIDPayUser } from './useIDPayUser';

export const PERMISSION_KEYS = {
  BATCH_VALIDATE: 'batch.validate',
  BATCH_CHECK: 'batch.check',
  BATCH_APPROVE: 'batch.approve',
  TRANSACTION_EDIT_CHECKS: 'transaction.editChecks',
  TRANSACTION_APPROVE: 'transaction.approve',
  TRANSACTION_SUSPEND: 'transaction.suspend',
  TRANSACTION_REJECT: 'transaction.reject',
  REPORT_GENERATE: 'report.generate',
} as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[keyof typeof PERMISSION_KEYS];

const DISABLED_ACTIONS_BY_ROLE: Partial<Record<string, Array<PermissionKey>>> = {
  support: [
    PERMISSION_KEYS.BATCH_VALIDATE,
    PERMISSION_KEYS.BATCH_CHECK,
    PERMISSION_KEYS.BATCH_APPROVE,
    PERMISSION_KEYS.TRANSACTION_EDIT_CHECKS,
    PERMISSION_KEYS.TRANSACTION_APPROVE,
    PERMISSION_KEYS.TRANSACTION_SUSPEND,
    PERMISSION_KEYS.TRANSACTION_REJECT,
    PERMISSION_KEYS.REPORT_GENERATE,
  ],
};

export const useUserPermissions = () => {
  const user = useIDPayUser();
  const role = user?.org_role;

  return useMemo(() => {
    const normalizedRole = (role ?? '').toLowerCase();
    const disabledActions = new Set(DISABLED_ACTIONS_BY_ROLE[normalizedRole] ?? []);

    return {
      role,
      isSupportUser: normalizedRole === 'support',
      isActionDisabled: (action: PermissionKey) => disabledActions.has(action),
    };
  }, [role]);
};
