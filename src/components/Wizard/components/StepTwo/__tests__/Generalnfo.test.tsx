import React from 'react';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BeneficiaryTypeEnum, WIZARD_ACTIONS } from '../../../../../utils/constants';
import Generalnfo from '../Generalnfo';
import { store } from '../../../../../redux/store';
import { setGeneralInfo, setInitiativeId } from '../../../../../redux/slices/initiativeSlice';
import { renderWithHistoryAndStore } from '../../../../../utils/test-utils';
import { GeneralInfo } from '../../../../../model/Initiative';
import { InitiativeApiMocked } from '../../../../../api/__mocks__/InitiativeApiClient';
import { InitiativeGeneralDTO } from '../../../../../api/generated/initiative/InitiativeGeneralDTO';
import { mockedInitiativeId } from '../../../../../services/__mocks__/groupService';
import { BASE_ROUTE } from '../../../../../routes';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  //@ts-expect-error
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    ancestorOrigins: ['string'] as unknown as DOMStringList,
    hash: 'hash',
    host: 'localhost',
    port: '3000',
    protocol: 'http:',
    hostname: 'localhost:3000/portale-enti',
    href: 'https://localhost:3000/portale-enti/nuova-iniziativa',
    origin: 'https://localhost:3000/portale-enti',
    pathname: `${BASE_ROUTE}/nuova-iniziativa`,
    search: '',
    assign: () => {},
    reload: () => {},
    replace: () => {},
  };
});

afterEach(cleanup);

describe('<Genaralnfo />', () => {
  window.scrollTo = jest.fn();
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
    introductionTextDE: '',
    introductionTextSL: '',
    rankingEnabled: 'true',
  };

  it('BeneficiaryTypes / BeneficiaryKnowns have the correct values', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    renderWithHistoryAndStore(
      <Generalnfo
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={2}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    /* Test of value of radio button */
    const beneficiaryType = screen.getByLabelText(/components.wizard.stepTwo.form.beneficiaryType/);
    const beneficiaryType1 = screen.getByLabelText(/components.wizard.stepTwo.form.person/);
    const beneficiaryType2 = screen.getByLabelText(/components.wizard.stepTwo.form.family/);
    // const beneficiaryKnown = getByLabelText(/components.wizard.stepTwo.form.beneficiaryKnown/);
    const beneficiaryKnown1 = screen.getByLabelText(
      /components.wizard.stepTwo.form.taxCodeList/
    ) as HTMLInputElement;
    const beneficiaryKnown2 = screen.getByLabelText(
      /components.wizard.stepTwo.form.manualSelection/
    ) as HTMLInputElement;

    fireEvent.click(beneficiaryType);

    expect(beneficiaryType1).toBeChecked();
    expect(beneficiaryType2).toBeDisabled();

    fireEvent.click(beneficiaryKnown1);
    expect(beneficiaryKnown1).toBeChecked();
    expect(beneficiaryKnown2).not.toBeChecked();

    fireEvent.click(beneficiaryKnown2);
    expect(beneficiaryKnown1).not.toBeChecked();
    expect(beneficiaryKnown2).toBeChecked();

    const rankingEnabledYes = screen.getByLabelText('components.wizard.stepTwo.form.yes');
    const rankingEnabledNo = screen.getByLabelText('components.wizard.stepTwo.form.no');

    fireEvent.click(rankingEnabledYes);
    expect(rankingEnabledYes).toBeChecked();
    expect(rankingEnabledNo).not.toBeChecked();

    fireEvent.click(rankingEnabledNo);
    expect(rankingEnabledYes).not.toBeChecked();
    expect(rankingEnabledNo).toBeChecked();
  });

  it('Total Budget / Budget per Person Test', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    renderWithHistoryAndStore(
      <Generalnfo
        action={WIZARD_ACTIONS.DRAFT}
        setAction={jest.fn()}
        currentStep={2}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const budget = screen.getByLabelText('components.wizard.stepTwo.form.budget');
    fireEvent.change(budget, { target: { value: '1000' } });

    const beneficiaryBudget = screen.getByLabelText(
      'components.wizard.stepTwo.form.beneficiaryBudget'
    );
    fireEvent.change(beneficiaryBudget, { target: { value: '100' } });
  });

  it('Date Join / Spend Test', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    renderWithHistoryAndStore(
      <Generalnfo
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={2}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const rankingStartDate = screen.getByLabelText(
      'components.wizard.stepTwo.form.rankingStartDate'
    );
    const rankingEndDate = screen.getByLabelText('components.wizard.stepTwo.form.rankingEndDate');
    const startDate = screen.getByLabelText('components.wizard.stepTwo.form.startDate');
    const endDate = screen.getByLabelText('components.wizard.stepTwo.form.endDate');

    fireEvent.click(endDate);
    fireEvent.change(endDate, { target: { value: 2022 } });
    fireEvent.change(endDate, { target: { value: '21/07/2022' } });

    fireEvent.click(rankingStartDate);
    fireEvent.change(rankingStartDate, { target: { value: 2022 } });
    fireEvent.change(rankingStartDate, { target: { value: '19/07/2022' } });

    fireEvent.click(rankingEndDate);
    fireEvent.change(rankingStartDate, { target: { value: 2022 } });
    fireEvent.change(rankingEndDate, { target: { value: '20/07/2022' } });

    fireEvent.click(startDate);
    fireEvent.change(rankingStartDate, { target: { value: 2022 } });
    fireEvent.change(startDate, { target: { value: '19/07/2022' } });
  });

  it('Test markdown with different language', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    renderWithHistoryAndStore(
      <Generalnfo
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={2}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );
    const itText = screen.getByTestId('introductionTextIT-test') as HTMLInputElement;
    fireEvent.change(itText, { target: { value: 'it text' } });

    fireEvent.click(screen.getByText('components.wizard.common.languages.english'));
    const enText = screen.getByTestId('introductionTextEN-test') as HTMLInputElement;
    fireEvent.change(enText, { target: { value: 'en text' } });

    fireEvent.click(screen.getByText('components.wizard.common.languages.french'));
    const frText = screen.getByTestId('introductionTextFR-test') as HTMLInputElement;
    fireEvent.change(frText, { target: { value: 'fr text' } });

    fireEvent.click(screen.getByText('components.wizard.common.languages.german'));
    const deText = screen.getByTestId('introductionTextDE-test') as HTMLInputElement;
    fireEvent.change(deText, { target: { value: 'de text' } });

    fireEvent.click(screen.getByText('components.wizard.common.languages.slovenian'));
    const slText = screen.getByTestId('introductionTextSL-test') as HTMLInputElement;
    fireEvent.change(slText, { target: { value: 'sl text' } });
  });

  test('test submit data', () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    InitiativeApiMocked.updateInitiativeGeneralInfo = async (
      _id: string,
      _data: InitiativeGeneralDTO
    ): Promise<void> => new Promise((resolve) => resolve());
    render(
      <Provider store={store}>
        <Generalnfo
          action={WIZARD_ACTIONS.SUBMIT}
          setAction={jest.fn()}
          currentStep={2}
          setCurrentStep={jest.fn()}
          setDisabledNext={jest.fn()}
        />
      </Provider>
    );
  });

  test('precompiled form from redux and DRAFT action with API call', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    store.dispatch(setGeneralInfo(mockedGeneralBody));
    InitiativeApiMocked.updateInitiativeGeneralInfoDraft = async (
      _id: string,
      _data: InitiativeGeneralDTO
    ): Promise<void> => new Promise((resolve) => resolve());
    render(
      <Provider store={store}>
        <Generalnfo
          action={WIZARD_ACTIONS.DRAFT}
          setAction={jest.fn()}
          currentStep={2}
          setCurrentStep={jest.fn()}
          setDisabledNext={jest.fn()}
        />
      </Provider>
    );
  });

  test('precompiled form from reux and no action with API call', () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    store.dispatch(setGeneralInfo(mockedGeneralBody));
    InitiativeApiMocked.updateInitiativeGeneralInfo = async (
      _id: string,
      _data: InitiativeGeneralDTO
    ): Promise<void> => new Promise((resolve) => resolve());

    render(
      <Provider store={store}>
        <Generalnfo
          action={''}
          setAction={jest.fn()}
          currentStep={2}
          setCurrentStep={jest.fn()}
          setDisabledNext={jest.fn()}
        />
      </Provider>
    );
  });

  test('test catch case of updateInitiativeGeneralInfo api call', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    store.dispatch(setGeneralInfo(mockedGeneralBody));
    InitiativeApiMocked.updateInitiativeGeneralInfo = async (): Promise<void> =>
      Promise.reject('reject case of api call');
    render(
      <Provider store={store}>
        <Generalnfo
          action={WIZARD_ACTIONS.DRAFT}
          setAction={jest.fn()}
          currentStep={2}
          setCurrentStep={jest.fn()}
          setDisabledNext={jest.fn()}
        />
      </Provider>
    );
  });

  test('test catch case of updateInitiativeGeneralInfoDraft api call', async () => {
    store.dispatch(setInitiativeId(mockedInitiativeId));
    store.dispatch(setGeneralInfo(mockedGeneralBody));
    InitiativeApiMocked.updateInitiativeGeneralInfoDraft = async (): Promise<void> =>
      Promise.reject('reject case of api call');
    render(
      <Provider store={store}>
        <Generalnfo
          action={WIZARD_ACTIONS.DRAFT}
          setAction={jest.fn()}
          currentStep={2}
          setCurrentStep={jest.fn()}
          setDisabledNext={jest.fn()}
        />
      </Provider>
    );
  });
});
