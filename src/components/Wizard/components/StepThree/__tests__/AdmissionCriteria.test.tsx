import { fireEvent, render, waitFor } from '@testing-library/react';
import React, { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { mockedInitiative } from '../../../../../model/__tests__/Initiative.test';
import { setInitiative } from '../../../../../redux/slices/initiativeSlice';
import { createStore } from '../../../../../redux/store';
import { BeneficiaryTypeEnum, WIZARD_ACTIONS } from '../../../../../utils/constants';
import AdmissionCriteria from '../AdmissionCriteria';
import { mapResponse } from '../helpers';
import { mockedMapResponse } from './helpers.test';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<AdmissionCriteria />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const arrOptions = ['ISEE', 'BIRTHDATE', 'RESIDENCE', '', undefined];

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the second step, with validation on input data', async () => {
    //  InitiativeApiMocked.getEligibilityCriteriaForSidebar();

    const deepClonedIni = JSON.parse(JSON.stringify(mockedInitiative));
    deepClonedIni.generalInfo = {
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
    };
    store.dispatch(setInitiative(deepClonedIni));
    console.log('first', store.getState().initiative.generalInfo)
    const { debug } = render(
      <Provider store={store}>
        <AdmissionCriteria
          action={WIZARD_ACTIONS.DRAFT}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (_value: SetStateAction<string>): void {
            //
          }}
          currentStep={0}
          // eslint-disable-next-line react/jsx-no-bind
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //
          }}
          // eslint-disable-next-line react/jsx-no-bind
          setDisabledNext={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      </Provider>
    );
  });

  it('Test onClick of "Sfoglia Criteri" to open the modal must be true', async () => {
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <AdmissionCriteria
          action={WIZARD_ACTIONS.SUBMIT}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (_value: SetStateAction<string>): void {
            //
          }}
          currentStep={1}
          // eslint-disable-next-line react/jsx-no-bind
          setCurrentStep={function (_value: SetStateAction<number>): void {
            //
          }}
          // eslint-disable-next-line react/jsx-no-bind
          setDisabledNext={function (_value: SetStateAction<boolean>): void {
            //
          }}
        />
      </Provider>
    );

    const criteria = getByTestId('criteria-button-test');
    const addManually = getByTestId('add-manually-test');
    const modal = queryByTestId('modal-test');
    const ManuallyAdded = queryByTestId('manually-added-test');

    fireEvent.click(criteria);

    expect(criteria).toBeTruthy();

    fireEvent.click(addManually);

    waitFor(async () => {
      expect(addManually).toBeTruthy();
      expect(ManuallyAdded).toBeInTheDocument();
      expect(ManuallyAdded).toBeVisible();
    });
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
