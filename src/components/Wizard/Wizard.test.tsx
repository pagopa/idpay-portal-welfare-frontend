import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../redux/store';
import Wizard from './Wizard';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<RefundRules />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the Wizard component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <Wizard
            handleOpenExitModal={(_event: React.MouseEvent<Element>) => {
              /*  */
            }}
          />
        </Provider>
      );
    });
  });
});
