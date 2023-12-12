import * as React from 'react';
import { USER_PERMISSIONS } from '../../utils/constants';
import { usePermissions } from '../usePermissions';
import { render } from '@testing-library/react';
import { createStore } from '../../redux/store';
import { Provider } from 'react-redux';
import { permissionsSelector } from '../../redux/slices/permissionsSlice';
import { useAppSelector } from '../../redux/hooks';
import * as redux from 'react-redux';



let tempHook: boolean;
let tempSelector: any;
function HookWrapper(): null {
  tempHook = usePermissions(USER_PERMISSIONS.CREATE_INITIATIVE);
  tempSelector = useAppSelector(permissionsSelector);
  return null;
}

describe('usePermissions', (injectedStore?: ReturnType<typeof createStore>) => {
  let spyOnUseSelector: jest.SpyInstance<unknown, [selector: (state: unknown) => unknown, equalityFn?: ((left: unknown, right: unknown) => boolean) | undefined]>;
  let spyOnUseDispatch;
  let mockDispatch: jest.Mock<any, any>;

  beforeEach(() => {
    // Mock useSelector hook
    spyOnUseSelector = jest.spyOn(redux, 'useSelector');
    spyOnUseSelector.mockReturnValue([{ id: 1, text: 'Old Item' }]);

    // Mock useDispatch hook
    spyOnUseDispatch = jest.spyOn(redux, 'useDispatch');
    // Mock dispatch function returned from useDispatch
    mockDispatch = jest.fn();
    spyOnUseDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  //const {result} = renderHook(() => usePermissions(USER_PERMISSIONS.CREATE_INITIATIVE))
 // permissionsSelector.mockReturnValue(false);
  const store = injectedStore ? injectedStore : createStore();
  

  test('use permisions enum', () => {
    render(
      <Provider store={store}>
        <HookWrapper />
      </Provider>
    );

    
    expect(tempHook).toBe(false);
    expect(tempHook).toBeFalsy();
   
  });
});
