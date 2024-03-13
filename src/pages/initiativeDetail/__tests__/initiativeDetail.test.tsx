import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { BeneficiaryTypeEnum } from '../../../api/generated/initiative/InitiativeGeneralDTO';
import { GeneralInfo } from '../../../model/Initiative';
import { setGeneralInfo, setInitiativeId, setStatus } from '../../../redux/slices/initiativeSlice';
import { setPermissionsList } from '../../../redux/slices/permissionsSlice';
import { createStore } from '../../../redux/store';
import InitiativeDetail from '../initiativeDetail';

jest.mock('../../../services/intitativeService');
jest.mock('../../../services/groupsService');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
  withTranslation: jest.fn(),
}));

window.scrollTo = jest.fn();

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<InitiativeDetail />', (injectedStore?: ReturnType<
  typeof createStore
>, injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test Render Initiative Detail component with permission reviewInitiative and Status IN_REVISION, button disabled', async () => {
    store.dispatch(setStatus('IN_REVISION'));
    store.dispatch(
      setPermissionsList([
        { name: 'reviewInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    const mockedGeneralBody: GeneralInfo = {
      beneficiaryType: BeneficiaryTypeEnum.PF,
      beneficiaryKnown: 'true',
      budget: '8515',
      beneficiaryBudget: '801',
      rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
      rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
      startDate: new Date('2022-10-01T00:00:00.000Z'),
      endDate: new Date('2023-01-31T00:00:00.000Z'),
      introductionTextIT: 'it',
      introductionTextEN: 'en',
      introductionTextFR: 'fr',
      introductionTextDE: undefined,
      introductionTextSL: undefined,
      rankingEnabled: 'true',
    };
    store.dispatch(setGeneralInfo(mockedGeneralBody));
    store.dispatch(setInitiativeId('iniID'));
    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeDetail />
        </Router>
      </Provider>
    );

    const backBtnDetail = screen.getByTestId('back-btn-test') as HTMLButtonElement;
    const secondBackButton = screen.getByText(/pages.initiativeDetail.accordion.buttons.back/i);

    const oldLocPathname = history.location.pathname;

    fireEvent.click(backBtnDetail);

    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());

    fireEvent.click(secondBackButton);
    await waitFor(() => expect(oldLocPathname !== history.location.pathname).toBeTruthy());
  });

  it('Test Render Initiative Detail component with permission reviewInitiative and Status IN_REVISION, onclick button test', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'reviewInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    store.dispatch(setStatus('IN_REVISION'));

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeDetail />
        </Router>
      </Provider>
    );

    const reject = screen.getByText(
      'pages.initiativeDetail.accordion.buttons.reject'
    ) as HTMLButtonElement;
    const approve = screen.getByText(
      'pages.initiativeDetail.accordion.buttons.approve'
    ) as HTMLButtonElement;

    expect(reject).toBeDisabled();

    const panel1 = screen.getByTestId('panel1-test') as HTMLButtonElement;
    const panel2 = screen.getByTestId('panel2-test') as HTMLButtonElement;
    const panel3 = screen.getByTestId('panel3-test') as HTMLButtonElement;
    const panel4 = screen.getByTestId('panel4-test') as HTMLButtonElement;
    const panel5 = screen.getByTestId('panel5-test') as HTMLButtonElement;

    fireEvent.click(panel1);
    fireEvent.click(panel2);
    fireEvent.click(panel3);
    fireEvent.click(panel4);
    fireEvent.click(panel5);

    expect(reject).not.toBeDisabled();

    fireEvent.click(reject);
    expect(screen.getByText('components.wizard.stepOne.modal.continueBtn')).toBeInTheDocument();
    fireEvent.click(screen.getByText('components.wizard.stepOne.modal.continueBtn'));

    expect(approve).not.toBeDisabled();
    fireEvent.click(approve);
    await waitFor(() =>
      expect(screen.getByText('pages.initiativeDetail.alert.approved')).toBeInTheDocument()
    );
    fireEvent.keyDown(screen.getByText('pages.initiativeDetail.alert.approved'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
  });

  it('Test Render Initiative Detail component with permission deleteInitiative and Status APPROVED, onclick button', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'deleteInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    store.dispatch(setStatus('APPROVED'));

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeDetail />
        </Router>
      </Provider>
    );

    const deleteBtn = screen.getByText(
      'pages.initiativeDetail.accordion.buttons.delete'
    ) as HTMLButtonElement;

    fireEvent.click(deleteBtn);
  });

  it('Test Render Initiative Detail component with permission updateInitiative and Status APPROVED, onclick button', async () => {
    store.dispatch(
      setPermissionsList([
        { name: 'updateInitiative', description: 'description', mode: 'enabled' },
      ])
    );
    store.dispatch(setStatus('APPROVED'));

    render(
      <Provider store={store}>
        <Router history={history}>
          <InitiativeDetail />
        </Router>
      </Provider>
    );

    const editBtn = screen.getByText(
      'pages.initiativeDetail.accordion.buttons.edit'
    ) as HTMLButtonElement;
    fireEvent.click(editBtn);
  });
});
