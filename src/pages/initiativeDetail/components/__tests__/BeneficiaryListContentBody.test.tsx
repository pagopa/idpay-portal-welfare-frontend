/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import BeneficiaryListContentBody from '../StepThree/BeneficiaryListContentBody';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<BeneficiaryListContentBody />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const initiative = store.getState().initiative;

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  const fileStatusOptions = ['OK', 'PROC_KO', ''];

  test('should render the BeneficiaryListContentBody component with undefined props', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <BeneficiaryListContentBody
            fileProcessingOutcomeStatus={undefined}
            fileBeneficiaryReached={undefined}
          />
        </Provider>
      );
    });
  });

  test('should render the BeneficiaryListContentBody component with string props', async () => {
    await act(async () => {
      fileStatusOptions.forEach(async (item) => {
        render(
          <Provider store={store}>
            <BeneficiaryListContentBody
              fileProcessingOutcomeStatus={item}
              fileBeneficiaryReached={2}
            />
          </Provider>
        );
      });
    });
  });
});
