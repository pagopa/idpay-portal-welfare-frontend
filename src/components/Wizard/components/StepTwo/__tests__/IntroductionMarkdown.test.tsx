import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import IntroductionMarkdown from '../IntroductionMarkdown';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));
describe('<IntroductionMarkdown />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const setValue = jest.fn();
  const useStateMock: any = (value: 'string') => [value, setValue];
  jest.spyOn(React, 'useState').mockImplementation(useStateMock);
  expect(useStateMock).toBeDefined();

  test('should render correctly the IntroductionMarkdown component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <IntroductionMarkdown
            textToRender={[
              { label: 'IT', formikValue: 'formikValue' },
              { label: 'EN', formikValue: 'formikValue' },
              { label: 'FR', formikValue: 'formikValue' },
              { label: 'DE', formikValue: 'formikValue' },
              { label: 'SL', formikValue: 'formikValue' },
            ]}
            serviceName="serviceName"
            selectedParty="selectedParty"
          />
        </Provider>
      );
    });
  });

  test('should render correctly the IntroductionMarkdown component with one or less textToRender', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <IntroductionMarkdown
            textToRender={[]}
            serviceName={undefined}
            selectedParty={undefined}
          />
        </Provider>
      );
    });
  });
});
