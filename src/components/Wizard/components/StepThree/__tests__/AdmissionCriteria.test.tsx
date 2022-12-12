import { fireEvent, render, waitFor } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import AdmissionCriteria from '../AdmissionCriteria';
import React from 'react';
import { mapResponse } from '../helpers';
import { mockedMapResponse } from './helpers.test';
import { InitiativeApiMocked } from '../../../../../api/__mocks__/InitiativeApiClient';
import { setInitiativeId, setInitiative } from '../../../../../redux/slices/initiativeSlice';
import { mockedInitiative } from '../../../../../model/__tests__/Initiative.test';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));
/*
beforeEach(() => {
  jest.mock('../../../../../api/__mocks__/InitiativeApiClient');
});
*/
describe('<AdmissionCriteria />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const arrOptions = ['ISEE', 'BIRTHDATE', 'RESIDENCE', '', undefined];

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the second step, with validation on input data', async () => {
    // InitiativeApiMocked.getEligibilityCriteriaForSidebar();

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
    /*
    store.dispatch(setInitiative(mockedInitiative));
    if (process.env.REACT_APP_API_MOCK_INITIATIVE === 'true') {
      console.log('  true case');
    } else {
      console.log('  false case');
    }
    debug();
    */
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
    const handleOpenModal = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(modal).not.toBeInTheDocument();
      expect(modal).not.toBeVisible();
    });

    // eslint-disable-next-line @typescript-eslint/await-thenable
    fireEvent.click(criteria);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(handleOpenModal).toBeDefined();
      expect(handleOpenModal).toHaveBeenCalledTimes(0);
      expect(criteria).toBeTruthy();
      expect(modal).toBeInTheDocument();
      expect(modal).toBeVisible();
      expect(ManuallyAdded).not.toBeInTheDocument();
      expect(ManuallyAdded).not.toBeVisible();
    });

    fireEvent.click(addManually);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
