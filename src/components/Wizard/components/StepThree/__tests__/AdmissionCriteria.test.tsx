import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import {
  saveApiKeyClientAssertion,
  saveApiKeyClientId,
  saveAutomatedCriteria,
  saveManualCriteria,
  setGeneralInfo,
  setInitiativeId,
} from '../../../../../redux/slices/initiativeSlice';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import AdmissionCriteria from '../AdmissionCriteria';
import { IseeTypologyEnum, mapResponse } from '../helpers';
import { mockedMapResponse } from './helpers.test';
import { BeneficiaryTypeEnum } from '../../../../../api/generated/initiative/InitiativeGeneralDTO';
import { OrderDirectionEnum } from '../../../../../api/generated/initiative/AutomatedCriteriaDTO';
import { InitiativeApi } from '../../../../../api/InitiativeApiClient';
import { mockedAdmissionCriteria } from '../../../../../services/__mocks__/admissionCriteriaService';

jest.mock('../../../../../services/intitativeService');
jest.mock('../../../../../services/admissionCriteriaService');

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AdmissionCriteria />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const arrOptions = ['ISEE', 'BIRTHDATE', 'RESIDENCE', '', undefined];

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the  step 3, with validation on input data', async () => {
    store.dispatch(setInitiativeId('2333333'));
    store.dispatch(
      setGeneralInfo({
        beneficiaryType: BeneficiaryTypeEnum.PF,
        beneficiaryKnown: 'false',
        budget: '8515',
        beneficiaryBudget: '801',
        rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
        rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
        startDate: new Date('2022-10-01T00:00:00.000Z'),
        endDate: new Date('2023-01-31T00:00:00.000Z'),
        introductionTextIT: 'string',
        introductionTextEN: 'string',
        introductionTextFR: 'string',
        introductionTextDE: 'string',
        introductionTextSL: 'string',
        rankingEnabled: 'true',
      })
    );
    store.dispatch(
      saveAutomatedCriteria([
        {
          authority: 'AUTH1',
          code: 'BIRTHDATE',
          field: 'year',
          operator: 'GT',
          value: '18',
        },
        {
          authority: 'INPS',
          code: 'ISEE',
          field: 'ISEE',
          operator: 'GT',
          value: '40000',
          iseeTypes: [IseeTypologyEnum.Dottorato, IseeTypologyEnum.Ordinario],
        },
      ])
    );
    store.dispatch(
      saveManualCriteria([
        {
          _type: 'boolean',
          description: 'string',
          code: 'string',
        },
        {
          _type: 'multi',
          description: 'string',
          code: 'string',
          multiValue: [],
        },
      ])
    );
    render(
      <Provider store={store}>
        <AdmissionCriteria
          action={WIZARD_ACTIONS.DRAFT}
          setAction={jest.fn()}
          currentStep={3}
          setCurrentStep={jest.fn()}
          setDisabledNext={jest.fn()}
        />
      </Provider>
    );

    const draft = await waitFor(() => {
      return screen.getByText('components.wizard.common.draftSaved');
    });
    expect(draft).toBeInTheDocument();
    // click the close icon on toast. id is from MUI
    fireEvent.click(screen.getAllByTestId('CloseIcon')[0]);
  });

  it('Test onClick of "Sfoglia Criteri" to open the modal must be true', async () => {
    store.dispatch(setInitiativeId('2333333'));
    store.dispatch(
      setGeneralInfo({
        beneficiaryType: BeneficiaryTypeEnum.PF,
        beneficiaryKnown: 'false',
        budget: '8515',
        beneficiaryBudget: '801',
        rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
        rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
        startDate: new Date('2022-10-01T00:00:00.000Z'),
        endDate: new Date('2023-01-31T00:00:00.000Z'),
        introductionTextIT: 'string',
        introductionTextEN: 'string',
        introductionTextFR: 'string',
        introductionTextDE: 'string',
        introductionTextSL: 'string',
        rankingEnabled: 'true',
      })
    );

    store.dispatch(
      saveAutomatedCriteria([
        {
          authority: 'AUTH1',
          code: 'BIRTHDATE',
          field: 'year',
          operator: 'GT',
          value: '18',
        },
        {
          authority: 'AUTH1',
          code: 'BIRTHDATE',
          field: 'year',
          operator: 'EQ',
          value: '18',
        },
        {
          authority: 'INPS',
          code: 'ISEE',
          field: 'ISEE',
          operator: 'GT',
          value: '40000',
        },
        {
          authority: 'INPS',
          code: 'RESIDENCE',
          field: 'ISEE',
          operator: 'GT',
          value: '40000',
        },
      ])
    );

    const { getByTestId } = render(
      <Provider store={store}>
        <AdmissionCriteria
          action={WIZARD_ACTIONS.SUBMIT}
          setAction={jest.fn()}
          currentStep={3}
          setCurrentStep={jest.fn()}
          setDisabledNext={jest.fn()}
        />
      </Provider>
    );

    const criteria = getByTestId('criteria-button-test');
    const addManually = getByTestId('add-manually-test');

    fireEvent.click(criteria);

    expect(criteria).toBeTruthy();

    fireEvent.click(addManually);
    expect(screen.getByTestId('delete-button-test')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('delete-button-test'));
  });

  it('Test Submit with no ISEE', async () => {
    store.dispatch(setInitiativeId('2333333'));
    store.dispatch(
      setGeneralInfo({
        beneficiaryType: BeneficiaryTypeEnum.PF,
        beneficiaryKnown: 'false',
        budget: '8515',
        beneficiaryBudget: '801',
        rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
        rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
        startDate: new Date('2022-10-01T00:00:00.000Z'),
        endDate: new Date('2025-06-31T00:00:00.000Z'),
        introductionTextIT: 'string',
        introductionTextEN: 'string',
        introductionTextFR: 'string',
        introductionTextDE: 'string',
        introductionTextSL: 'string',
        rankingEnabled: 'true',
      })
    );

    store.dispatch(
      saveAutomatedCriteria([
        {
          authority: "INPS",
          code: "BIRTHDAY",
          operator: "GT",
          value: "1",
          value2: "",
          orderDirection: OrderDirectionEnum.ASC,
          iseeTypes: [
              "ORDINARIO",
              "MINORENNE",
              "UNIVERSITARIO",
              "SOCIOSANITARIO",
              "DOTTORATO",
              "RESIDENZIALE",
              "CORRENTE"
          ]
        }
      ])
    );
    store.dispatch(saveApiKeyClientId('api key'));
    store.dispatch(saveApiKeyClientAssertion('api client assertion'));
    const { getByTestId } = render(
      <Provider store={store}>
        <AdmissionCriteria
          action={WIZARD_ACTIONS.SUBMIT}
          setAction={jest.fn()}
          currentStep={3}
          setCurrentStep={jest.fn()}
          setDisabledNext={jest.fn()}
        />
      </Provider>
    );

    const criteria = getByTestId('criteria-button-test');
    const addManually = getByTestId('add-manually-test');

    fireEvent.click(criteria);

    expect(criteria).toBeTruthy();

    fireEvent.click(addManually);
    const noISEEToat = await waitFor(() => {
      return screen.getByText(
        'components.wizard.stepThree.chooseCriteria.iseeNotPopulatedOnRankingErrorTitle'
      );
    });

    expect(noISEEToat).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('CloseIcon'));
  });

  it('Test on mapResponse', () => {
    arrOptions.forEach((item) => {
      //@ts-expect-error
      expect(mapResponse(mockedMapResponse(item))).not.toBeNull();
    });
    expect(
      mapResponse([
        {
          authority: 'string',
          checked: true,
          field: 'string',
          operator: 'string',
        },
      ])
    ).toBeDefined();
  });
});
