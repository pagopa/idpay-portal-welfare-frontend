import { USER_PERMISSIONS } from '../utils/constants';
import { permissionsSelector } from '../redux/slices/permissionsSlice';
import { useAppSelector } from '../redux/hooks';
import { Permission } from '../model/Permission';

export const usePermissions = (action: USER_PERMISSIONS): boolean => {
  const permissionsList = useAppSelector(permissionsSelector);
  if (Array.isArray(permissionsList)) {
    const selectedPermission: Permission | undefined = permissionsList.find(
      (p) => p.name === action
    );
    return typeof selectedPermission === 'object' ? selectedPermission.mode === 'enabled' : false;
  } else {
    return false;
  }
};
