/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import StatusSnackBar from '../StatusSnackBar';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<StatusSnacBar />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const initiative = store.getState().initiative;
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the SnackBar component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <StatusSnackBar
            openSnackBar={false}
            setOpenSnackBar={function (_value: SetStateAction<boolean>): void {
              //
            }}
            fileStatus={undefined}
            initiative={initiative}
          />
        </Provider>
      );
    });
  });
});
