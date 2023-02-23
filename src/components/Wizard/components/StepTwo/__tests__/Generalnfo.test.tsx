import React from 'react';
import { act, fireEvent, render, waitFor, screen, cleanup } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { date } from 'yup';
import { isDate, parse } from 'date-fns';
import { BeneficiaryTypeEnum, WIZARD_ACTIONS } from '../../../../../utils/constants';
import Generalnfo from '../Generalnfo';
import { createStore } from '../../../../../redux/store';
import { setGeneralInfo, setInitiativeId } from '../../../../../redux/slices/initiativeSlice';
import { renderWithContext, renderWithHistoryAndStore } from '../../../../../utils/test-utils';
import { GeneralInfo } from '../../../../../model/Initiative';
import { InitiativeApiMocked } from '../../../../../api/__mocks__/InitiativeApiClient';
import { InitiativeGeneralDTO } from '../../../../../api/generated/initiative/InitiativeGeneralDTO';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<Genaralnfo />', (injectedStore?: ReturnType<typeof createStore>) => {
  window.scrollTo = jest.fn();

  const store = injectedStore ? injectedStore : createStore();

  it('call the submit event when form is submitted', async () => {
    store.dispatch(setInitiativeId('initativeId231'));
    renderWithHistoryAndStore(
      <Generalnfo
        action={WIZARD_ACTIONS.DRAFT}
        setAction={jest.fn()}
        currentStep={2}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );
    const itText = screen.getByTestId('introductionTextIT-test') as HTMLInputElement;
    fireEvent.change(itText, { target: { value: 'it text' } });
    expect(itText).toBeInTheDocument();

    fireEvent.click(screen.getByText('components.wizard.common.languages.english'));
    const enText = screen.getByTestId('introductionTextEN-test') as HTMLInputElement;
    fireEvent.change(enText, { target: { value: 'en text' } });
    expect(enText).toBeInTheDocument();

    fireEvent.click(screen.getByText('components.wizard.common.languages.french'));
    const frText = screen.getByTestId('introductionTextFR-test') as HTMLInputElement;
    fireEvent.change(frText, { target: { value: 'fr text' } });
    expect(frText).toBeInTheDocument();

    fireEvent.click(screen.getByText('components.wizard.common.languages.german'));
    const deText = screen.getByTestId('introductionTextDE-test') as HTMLInputElement;
    fireEvent.change(deText, { target: { value: 'de text' } });
    expect(deText).toBeInTheDocument();

    fireEvent.click(screen.getByText('components.wizard.common.languages.slovenian'));
    const slText = screen.getByTestId('introductionTextSL-test') as HTMLInputElement;
    fireEvent.change(slText, { target: { value: 'sl text' } });
    expect(slText).toBeInTheDocument();
  });

  it('BeneficiaryTypes / BeneficiaryKnowns have the correct values', async () => {
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

    await act(async () => {
      expect(beneficiaryType1).toBeChecked();
    });
    await act(async () => {
      expect(beneficiaryType2).toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(beneficiaryKnown1);
      expect(beneficiaryKnown1.checked).toEqual(false);
      expect(beneficiaryKnown2.checked).toEqual(false);
      fireEvent.click(beneficiaryKnown2);
      expect(beneficiaryKnown2.checked).toEqual(false);
      expect(beneficiaryKnown1.checked).toEqual(false);
    });
  });

  it('Total Budget / Budget per Person Test', async () => {
    renderWithHistoryAndStore(
      <Generalnfo
        action={WIZARD_ACTIONS.DRAFT}
        setAction={jest.fn()}
        currentStep={2}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    type TestElement = Document | Element | Window | Node;

    /* check if the field are required */

    function hasInputValueTot(e: TestElement, budgetTot: string) {
      return screen.getByDisplayValue(budgetTot) === e;
    }
    const budget = screen.getByLabelText(/components.wizard.stepTwo.form.budget/);
    fireEvent.change(budget, { target: { value: '1000' } });
    await act(async () => {
      expect(hasInputValueTot(budget, '1000')).toBe(true);
      expect(budget).toBeRequired();
    });

    function hasInputValuePerPerson(e: TestElement, budgetPerPerson: string) {
      return screen.getByDisplayValue(budgetPerPerson) === e;
    }
    const beneficiaryBudget = screen.getByLabelText(
      /components.wizard.stepTwo.form.beneficiaryBudget/
    );
    fireEvent.change(beneficiaryBudget, { target: { value: '100' } });

    await act(async () => {
      expect(hasInputValuePerPerson(beneficiaryBudget, '100')).toBe(true);
      expect(beneficiaryBudget).toBeRequired();
    });
  });

  it('Date Join / Spend Test', async () => {
    renderWithHistoryAndStore(
      <Generalnfo
        action={''}
        setAction={jest.fn()}
        currentStep={2}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    function parseDateString(_value: any, originalValue: string) {
      return isDate(originalValue) ? originalValue : parse(originalValue, 'dd-MM-yyyy', new Date());
    }

    function isValidDate(date: any): date is Date {
      return date instanceof Date && !isNaN(date.getTime());
    }

    const rankingStartDate = screen.getByLabelText(
      /components.wizard.stepTwo.form.rankingStartDate/
    );
    const rankingEndDate = screen.getByLabelText(/components.wizard.stepTwo.form.rankingEndDate/);
    const startDate = screen.getByLabelText(/components.wizard.stepTwo.form.startDate/);
    const endDate = screen.getByLabelText(/components.wizard.stepTwo.form.endDate/);

    const d = date().transform(parseDateString);
    /* check if the fields are required */
    await act(async () => {
      expect(startDate).toBeRequired();
    });
    await act(async () => {
      expect(endDate).toBeRequired();
    });

    fireEvent.click(endDate);
    fireEvent.change(endDate, { target: { value: '19/07/2022' } });
    await act(async () => {
      expect(
        d
          .cast('19-07-2022')
          ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
      ).toBe('19/07/2022');
    });

    // expect to throw  formik error wrong type
    fireEvent.change(endDate, { target: { value: 2022 } });

    /* Checking if invalid cast return invalid date */
    await act(async () => {
      expect(isValidDate(d.cast(null, { assert: false }))).toBe(false);
    });
    await act(async () => {
      expect(isValidDate(d.cast('', { assert: false }))).toBe(false);
    });
    /* Casting */
    await act(async () => {
      expect(d.cast(new Date())).toBeInstanceOf(Date);
    });
    /* join-from */

    fireEvent.click(rankingStartDate);
    fireEvent.change(rankingStartDate, { target: { value: '19/07/2022' } });
    await act(async () => {
      expect(
        d
          .cast('19-07-2022')
          ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
      ).toBe('19/07/2022');
    });

    // expect to throw error formik error wrong type
    fireEvent.change(rankingStartDate, { target: { value: 2022 } });
    /* join-to */

    fireEvent.mouseOver(rankingEndDate);
    fireEvent.change(rankingEndDate, { target: { value: '20/07/2022' } });
    await act(async () => {
      expect(
        d
          .cast('20-07-2022')
          ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
      ).toBe('20/07/2022');
    });

    /* spend-from */

    fireEvent.mouseOver(startDate);
    fireEvent.change(startDate, { target: { value: '21/07/2022' } });
    await act(async () => {
      expect(
        d
          .cast('21-07-2022')
          ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
      ).toBe('21/07/2022');
    });
    /* spend-to */

    fireEvent.mouseOver(endDate);
    fireEvent.change(endDate, { target: { value: '22/07/2022' } });
    await act(async () => {
      expect(
        d
          .cast('22-07-2022')
          ?.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
      ).toBe('22/07/2022');
    });
  });

  it('Test beneficiary type onChange', async () => {
    await waitFor(async () => {
      renderWithHistoryAndStore(
        <Generalnfo
          action={WIZARD_ACTIONS.SUBMIT}
          setAction={jest.fn()}
          currentStep={2}
          setCurrentStep={jest.fn()}
          setDisabledNext={jest.fn()}
        />
      );

      const beneficiaryType = screen.queryByTestId('beneficiary-radio-test') as HTMLInputElement;
      const beneficiaryType1 = screen.getByLabelText(
        /components.wizard.stepTwo.form.person/
      ) as HTMLInputElement;
      const beneficiaryType2 = screen.getByLabelText(
        /components.wizard.stepTwo.form.family/
      ) as HTMLInputElement;

      waitFor(async () => {
        fireEvent.click(beneficiaryType1);
        expect(beneficiaryType1).toBeChecked();
        expect(beneficiaryType1.value).toBe('true');
        expect(beneficiaryType2).not.toBeChecked();
        fireEvent.click(beneficiaryType2);
        expect(beneficiaryType2).toBeChecked();
        expect(beneficiaryType2.value).toBe('true');
        expect(beneficiaryType1).not.toBeChecked();

        fireEvent.change(beneficiaryType, { target: { value: BeneficiaryTypeEnum.PF } });
        expect(beneficiaryType.value).toBe('PF');
        fireEvent.change(beneficiaryType, { target: { value: BeneficiaryTypeEnum.PG } });
        expect(beneficiaryType.value).toBe('PG');
      });
    });
  });

  test('precompiled form from redux', async () => {
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
    render(
      <Provider store={store}>
        <Generalnfo
          action={WIZARD_ACTIONS.DRAFT}
          // eslint-disable-next-line react/jsx-no-bind
          setAction={function (_value: SetStateAction<string>): void {
            //
          }}
          currentStep={2}
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
});
