import { USER_PERMISSIONS } from '../utils/constants';
import { permissionsSelector } from '../redux/slices/permissionsSlice';
import { useAppSelector } from '../redux/hooks';
import { Permission } from '../model/Permission';

export const usePermissions = (action: USER_PERMISSIONS): boolean => {
  const permissionsList = useAppSelector(permissionsSelector);
  if (Array.isArray(permissionsList)) {
    // eslint-disable-next-line functional/no-let
    let selectedPermission: Permission = {
      name: '',
      description: '',
      mode: '',
    };
    permissionsList.forEach((p) => {
      if (p.name === action) {
        selectedPermission = { ...p };
      }
    });
    return selectedPermission.mode === 'enabled';
  } else {
    // TODO? handle error
    return false;
  }
};
