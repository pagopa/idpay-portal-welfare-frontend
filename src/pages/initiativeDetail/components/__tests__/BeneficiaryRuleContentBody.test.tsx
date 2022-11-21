/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { mockedInitiative } from '../../../../model/__tests__/Initiative.test';
import { createStore } from '../../../../redux/store';
import BeneficiaryRuleContentBody from '../StepThree/BeneficiaryRuleContentBody';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<BeneficiaryRuleContentBody />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should render with props', async () => {
    render(
      <Provider store={store}>
        <BeneficiaryRuleContentBody initiativeDetail={mockedInitiative} />
      </Provider>
    );
  });
});
