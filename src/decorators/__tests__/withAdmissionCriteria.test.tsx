import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '../../redux/store';
import withAdmissionCriteria from '../withAdmissionCriteria';
import { verifyFetchAdmissionCriteriasMockExecution } from '../../services/__mocks__/admissionCriteriaService';

jest.mock('../../services/admissionCriteriaService');

const renderApp = (injectedStore?: any) => {
  const store = injectedStore ? injectedStore : createStore();
  const Component = () => <></>;
  const DecoratedComponent = withAdmissionCriteria(Component);
  render(
    <Provider store={store}>
      <DecoratedComponent />
    </Provider>
  );
  return store;
};

let fetchAdmissionCriteriaSpy: jest.SpyInstance;

beforeEach(() => {
  fetchAdmissionCriteriaSpy = jest.spyOn(
    require('../../services/admissionCriteriaService'),
    'fetchAdmissionCriteria'
  );
});

test('Test', async () => {
  const store = renderApp();
  await waitFor(() =>
    verifyFetchAdmissionCriteriasMockExecution(store.getState().admissionCriteria.list)
  );

  renderApp(store);

  await waitFor(() =>
    verifyFetchAdmissionCriteriasMockExecution(store.getState().admissionCriteria.list)
  );

  expect(fetchAdmissionCriteriaSpy).toBeCalledTimes(1);
});
