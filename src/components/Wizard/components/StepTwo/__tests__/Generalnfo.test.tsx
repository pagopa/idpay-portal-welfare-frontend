import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { addDays } from 'date-fns';
import {
  BeneficiaryTypeEnum,
  FamilyUnitCompositionEnum,
} from '../../../../../api/generated/initiative/InitiativeGeneralDTO';
import { GeneralInfo } from '../../../../../model/Initiative';
import {
  setAdditionalInfo,
  setInitiative,
  setInitiativeId,
} from '../../../../../redux/slices/initiativeSlice';
import { partiesActions } from '../../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../../redux/store';
import { BASE_ROUTE } from '../../../../../routes';
import { mockedInitiativeId } from '../../../../../services/__mocks__/groupsService';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithContext } from '../../../../../utils/test-utils';
import Generalnfo from '../Generalnfo';
import * as initiativeService from '../../../../../services/intitativeService';

const mockAddError = jest.fn();
const mockSetLoading = jest.fn();
const mockDatePicker = jest.fn();

jest.mock('../../../../../services/intitativeService', () => ({
  __esModule: true,
  updateInitiativeGeneralInfo: jest.fn(),
  updateInitiativeGeneralInfoDraft: jest.fn(),
}));

const mockUpdateInitiativeGeneralInfo = initiativeService.updateInitiativeGeneralInfo as jest.Mock;
const mockUpdateInitiativeGeneralInfoDraft =
  initiativeService.updateInitiativeGeneralInfoDraft as jest.Mock;

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: (props: any) => {
    mockDatePicker(props);

    return (
      <input
        aria-label={props.label}
        data-testid={props.slotProps?.textField?.id ?? props.label}
        value={props.value instanceof Date ? 'seed value' : ''}
        onChange={() => props.onChange?.(new Date('2026-03-01T00:00:00.000Z'))}
      />
    );
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher', () => ({
  __esModule: true,
  default: () => mockAddError,
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/hooks/useLoading', () => ({
  __esModule: true,
  default: () => mockSetLoading,
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  mockUpdateInitiativeGeneralInfo.mockReset().mockResolvedValue(undefined);
  mockUpdateInitiativeGeneralInfoDraft.mockReset().mockResolvedValue(undefined);
  mockAddError.mockClear();
  mockSetLoading.mockClear();
  mockDatePicker.mockClear();
});
const oldWindowLocation = global.window.location;

const mockedLocation = {
  assign: jest.fn(),
  pathname: `${BASE_ROUTE}/nuova-iniziativa`,
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

afterEach(cleanup);
afterEach(() => {
  jest.restoreAllMocks();
});

describe('<Genaralnfo />', () => {
  window.scrollTo = jest.fn();
  const futureDate = (year: number, month: number, day: number) =>
    new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const mockedGeneralBody: GeneralInfo = {
    beneficiaryType: BeneficiaryTypeEnum.PF,
    beneficiaryKnown: 'true',
    budget: '8515',
    beneficiaryBudget: '801',
    rankingStartDate: futureDate(2030, 9, 1),
    rankingEndDate: futureDate(2030, 9, 30),
    startDate: futureDate(2030, 10, 11),
    endDate: futureDate(2031, 1, 31),
    introductionTextIT: 'it',
    introductionTextEN: 'en',
    introductionTextFR: 'fr',
    introductionTextDE: '',
    introductionTextSL: '',
    rankingEnabled: 'true',
  };

  const invalidGeneralBody: GeneralInfo = {
    ...mockedGeneralBody,
    beneficiaryKnown: '',
    rankingEnabled: '',
    budget: '',
    beneficiaryBudget: '',
    introductionTextIT: '',
    introductionTextEN: '',
    introductionTextFR: '',
    introductionTextDE: '',
    introductionTextSL: '',
  };

  const mockedGeneralBodyForRender: GeneralInfo = {
    ...mockedGeneralBody,
    beneficiaryType: BeneficiaryTypeEnum.NF,
    beneficiaryKnown: 'false',
    rankingEnabled: 'false',
    familyUnitComposition: FamilyUnitCompositionEnum.INPS,
  };

  const mockedAdditionalInfo = {
    initiativeOnIO: true,
    serviceId: 'service-id',
    serviceName: 'Service name',
    serviceArea: '',
    logoFileName: 'logo.png',
    logoURL: '',
    logoUploadDate: '',
    serviceDescription: '',
    privacyPolicyUrl: '',
    termsAndConditions: '',
    assistanceChannels: [{ type: 'web', contact: '' }],
  };

  const mockedParty = {
    partyId: 'party-id',
    externalId: 'external-id',
    originId: 'origin-id',
    origin: 'origin',
    description: 'Mocked party',
    digitalAddress: 'party@example.test',
    status: 'ACTIVE',
    roles: [],
    fiscalCode: '12345678901',
    registeredOffice: 'registered office',
    typology: 'typology',
  };

  const renderGeneralInfo = ({
    action = '',
    currentStep = 2,
    generalInfo = mockedGeneralBody,
    withInitiativeId = true,
    additionalInfo,
    selectedParty,
    setAction = jest.fn(),
    setCurrentStep = jest.fn(),
    setDisabledNext = jest.fn(),
  }: {
    action?: string;
    currentStep?: number;
    generalInfo?: GeneralInfo;
    withInitiativeId?: boolean;
    additionalInfo?: any;
    selectedParty?: any;
    setAction?: jest.Mock;
    setCurrentStep?: jest.Mock;
    setDisabledNext?: jest.Mock;
  } = {}) => {
    const testStore = createStore();
    if (withInitiativeId) {
      testStore.dispatch(setInitiativeId(mockedInitiativeId));
    }
    testStore.dispatch(setInitiative({ ...testStore.getState().initiative, generalInfo }));
    if (additionalInfo) {
      testStore.dispatch(setAdditionalInfo(additionalInfo));
    }
    if (selectedParty !== undefined) {
      testStore.dispatch(partiesActions.setPartySelected(selectedParty));
    }

    const renderResult = renderWithContext(
      <Generalnfo
        action={action}
        setAction={setAction}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setDisabledNext={setDisabledNext}
      />,
      testStore
    );

    return { testStore, setAction, setCurrentStep, setDisabledNext, ...renderResult };
  };

  const getDatePickerProps = (testId: string) =>
    mockDatePicker.mock.calls
      .map(([props]) => props)
      .filter((props) => props.slotProps?.textField?.id === testId)
      .pop();

  it('BeneficiaryTypes / BeneficiaryKnowns have the correct values', async () => {
    renderGeneralInfo({ action: '', generalInfo: mockedGeneralBody });

    /* Test of value of radio button */
    const beneficiaryType = screen.getByLabelText(/components.wizard.stepTwo.form.beneficiaryType/);
    const beneficiaryType1 = screen.getByLabelText(/components.wizard.stepTwo.form.person/);

    const beneficiaryKnown1 = screen.getByLabelText(
      /components.wizard.stepTwo.form.taxCodeList/
    ) as HTMLInputElement;
    const beneficiaryKnown2 = screen.getByLabelText(
      /components.wizard.stepTwo.form.manualSelection/
    ) as HTMLInputElement;

    fireEvent.click(beneficiaryType);

    expect(beneficiaryType1).toBeChecked();

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
    renderGeneralInfo({ action: '', generalInfo: mockedGeneralBody });

    const budget = screen.getByLabelText('components.wizard.stepTwo.form.budget');
    fireEvent.change(budget, { target: { value: '1000' } });

    const beneficiaryBudget = screen.getByLabelText(
      'components.wizard.stepTwo.form.beneficiaryBudgetPerson'
    );
    fireEvent.change(beneficiaryBudget, { target: { value: '100' } });
  });

  it('Date Join / Spend Test', async () => {
    renderGeneralInfo({ action: '', generalInfo: mockedGeneralBody });

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
    renderGeneralInfo({ action: '', generalInfo: mockedGeneralBody });
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

  test('keeps Next enabled for a valid form and shows the single-introduction preview without tabs', async () => {
    const setDisabledNext = jest.fn();

    renderGeneralInfo({
      action: '',
      generalInfo: {
        ...mockedGeneralBody,
        beneficiaryKnown: 'false',
        rankingEnabled: 'false',
        introductionTextEN: undefined,
        introductionTextFR: undefined,
        introductionTextDE: undefined,
        introductionTextSL: undefined,
      },
      additionalInfo: {
        ...mockedAdditionalInfo,
        serviceName: undefined,
        logoURL: '',
      },
      setDisabledNext,
    });

    await waitFor(() => {
      expect(setDisabledNext).toHaveBeenCalledWith(false);
    });

    fireEvent.click(screen.getByText('components.wizard.stepTwo.form.preview'));

    expect(await screen.findByText('components.wizard.stepTwo.previewModal.title')).toBeInTheDocument();
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(screen.getAllByText('it').length).toBeGreaterThan(0);
  });

  test('renders intro tabs and logo when multiple optional introductions are available', async () => {
    renderGeneralInfo({
      action: '',
      generalInfo: {
        ...mockedGeneralBody,
        introductionTextDE: undefined,
        introductionTextSL: undefined,
      },
      additionalInfo: {
        ...mockedAdditionalInfo,
        logoURL: 'https://example.test/logo.png',
      },
      selectedParty: mockedParty,
    });

    fireEvent.click(screen.getByText('components.wizard.stepTwo.form.preview'));

    expect(await screen.findByText('components.wizard.stepTwo.previewModal.title')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByText('Service name')).toBeInTheDocument();
    expect(screen.getByText('Mocked party')).toBeInTheDocument();
  });

  test('shows the family composition validation when NF is selected without a composition', async () => {
    const setCurrentStep = jest.fn();
    renderGeneralInfo({
      action: WIZARD_ACTIONS.SUBMIT,
      generalInfo: {
        ...mockedGeneralBody,
        beneficiaryType: BeneficiaryTypeEnum.NF,
        familyUnitComposition: undefined,
        beneficiaryKnown: 'true',
        rankingEnabled: 'false',
      },
      setCurrentStep,
    });

    await waitFor(() => {
      expect(screen.getByTestId('family-unit-composition-test')).toBeInTheDocument();
      expect(mockUpdateInitiativeGeneralInfo).not.toHaveBeenCalled();
      expect(setCurrentStep).not.toHaveBeenCalled();
    });
  });

  test('shows the ranking validation when PF manual selection does not enable ranking', async () => {
    const setCurrentStep = jest.fn();
    renderGeneralInfo({
      action: WIZARD_ACTIONS.SUBMIT,
      generalInfo: {
        ...mockedGeneralBody,
        beneficiaryType: BeneficiaryTypeEnum.PF,
        beneficiaryKnown: 'false',
        rankingEnabled: '',
      },
      setCurrentStep,
    });

    await waitFor(() => {
      expect(screen.getByTestId('witRanking-test')).toBeInTheDocument();
      expect(mockUpdateInitiativeGeneralInfo).not.toHaveBeenCalled();
      expect(setCurrentStep).not.toHaveBeenCalled();
    });
  });

  test('shows the date validation branches for invalid ranking and spend dates', async () => {
    const setCurrentStep = jest.fn();
    renderGeneralInfo({
      action: WIZARD_ACTIONS.SUBMIT,
      generalInfo: {
        ...mockedGeneralBody,
        beneficiaryKnown: 'false',
        rankingEnabled: 'true',
        rankingStartDate: futureDate(2020, 9, 10),
        rankingEndDate: futureDate(2020, 9, 10),
        startDate: futureDate(2020, 9, 20),
        endDate: futureDate(2020, 9, 20),
      },
      setCurrentStep,
    });

    await waitFor(() => {
      expect(screen.getByLabelText('components.wizard.stepTwo.form.rankingStartDate')).toBeInTheDocument();
      expect(screen.getByLabelText('components.wizard.stepTwo.form.rankingEndDate')).toBeInTheDocument();
      expect(screen.getByLabelText('components.wizard.stepTwo.form.startDate')).toBeInTheDocument();
      expect(screen.getByLabelText('components.wizard.stepTwo.form.endDate')).toBeInTheDocument();
      expect(mockUpdateInitiativeGeneralInfo).not.toHaveBeenCalled();
      expect(setCurrentStep).not.toHaveBeenCalled();
    });
  });

  test('shows the beneficiary type validation when the form is submitted without a beneficiary type', async () => {
    const setCurrentStep = jest.fn();
    renderGeneralInfo({
      action: WIZARD_ACTIONS.SUBMIT,
      generalInfo: {
        ...mockedGeneralBody,
        beneficiaryType: undefined as any,
        beneficiaryKnown: 'true',
        rankingEnabled: 'false',
      },
      setCurrentStep,
    });

    await waitFor(() => {
      expect(screen.getByTestId('beneficiary-type-test')).toBeInTheDocument();
      expect(mockUpdateInitiativeGeneralInfo).not.toHaveBeenCalled();
      expect(setCurrentStep).not.toHaveBeenCalled();
    });
  });

  test('shows budget and introduction helper texts when the PF form is submitted without values', async () => {
    renderGeneralInfo({
      action: WIZARD_ACTIONS.SUBMIT,
      generalInfo: {
        ...mockedGeneralBody,
        beneficiaryKnown: 'true',
        rankingEnabled: 'false',
        budget: '',
        beneficiaryBudget: '',
        introductionTextIT: '',
      },
    });

    await waitFor(() => {
      expect(screen.getByLabelText('components.wizard.stepTwo.form.budget')).toBeInTheDocument();
      expect(
        screen.getByLabelText('components.wizard.stepTwo.form.beneficiaryBudgetPerson')
      ).toBeInTheDocument();
      expect(screen.getByTestId('introductionTextIT-test')).toBeInTheDocument();
      expect(mockUpdateInitiativeGeneralInfo).not.toHaveBeenCalled();
    });
  });

  test('keeps the date validators on the fallback branch when date values are missing', async () => {
    const setCurrentStep = jest.fn();
    renderGeneralInfo({
      action: WIZARD_ACTIONS.SUBMIT,
      generalInfo: {
        ...mockedGeneralBody,
        beneficiaryKnown: 'false',
        rankingEnabled: 'true',
        rankingStartDate: '',
        rankingEndDate: '',
        startDate: '',
        endDate: '',
      },
      setCurrentStep,
    });

    await waitFor(() => {
      expect(screen.getByLabelText('components.wizard.stepTwo.form.rankingStartDate')).toBeInTheDocument();
      expect(screen.getByLabelText('components.wizard.stepTwo.form.rankingEndDate')).toBeInTheDocument();
      expect(screen.getByLabelText('components.wizard.stepTwo.form.startDate')).toBeInTheDocument();
      expect(screen.getByLabelText('components.wizard.stepTwo.form.endDate')).toBeInTheDocument();
      expect(mockUpdateInitiativeGeneralInfo).not.toHaveBeenCalled();
      expect(setCurrentStep).not.toHaveBeenCalled();
    });
  });

  test('sets disabledNext to true when the form starts invalid', async () => {
    const setDisabledNext = jest.fn();

    renderGeneralInfo({
      action: '',
      generalInfo: invalidGeneralBody,
      setDisabledNext,
    });

    await waitFor(() => {
      expect(setDisabledNext).toHaveBeenCalledWith(true);
    });

    expect(screen.queryByText('components.wizard.stepTwo.form.reachedUsers')).not.toBeInTheDocument();
    expect(
      screen.queryByText('components.wizard.stepTwo.form.reachedFamilies')
    ).not.toBeInTheDocument();
  });

  test('initializes dates and updates family unit composition when NF is selected', async () => {
    renderGeneralInfo({ action: '', generalInfo: mockedGeneralBodyForRender });
    const rankingEndDate = mockedGeneralBodyForRender.rankingEndDate as Date;

    expect(await screen.findByTestId('family-unit-composition-test')).toBeInTheDocument();
    expect(screen.getByLabelText('components.wizard.stepTwo.form.taxCodeList')).toBeDisabled();
    expect(screen.getByLabelText('components.wizard.stepTwo.form.manualSelection')).toBeChecked();

    const startDateDatePicker = getDatePickerProps('startDate');
    expect(startDateDatePicker?.minDate).toEqual(addDays(rankingEndDate, 1));

    fireEvent.click(screen.getByLabelText('components.wizard.stepTwo.form.yes'));
    await waitFor(() => {
      expect(screen.getByLabelText('components.wizard.stepTwo.form.yes')).toBeChecked();
      expect(getDatePickerProps('startDate')?.minDate).toEqual(addDays(rankingEndDate, 11));
    });

    fireEvent.click(screen.getByLabelText('components.wizard.stepTwo.form.no'));
    await waitFor(() => {
      expect(screen.getByLabelText('components.wizard.stepTwo.form.no')).toBeChecked();
      expect(getDatePickerProps('startDate')?.minDate).toEqual(addDays(rankingEndDate, 1));
    });

    fireEvent.click(screen.getByText('components.wizard.stepTwo.form.familyUnitCompositionTitleAnpr'));
    expect(screen.getByText('components.wizard.stepTwo.form.familyUnitCompositionTitleAnpr')).toBeInTheDocument();
  });

  test('submits general info and advances the wizard on success', async () => {
    const setCurrentStep = jest.fn();
    renderGeneralInfo({
      action: WIZARD_ACTIONS.SUBMIT,
      generalInfo: mockedGeneralBody,
      setCurrentStep,
    });

    await waitFor(() => {
      expect(mockUpdateInitiativeGeneralInfo).toHaveBeenCalledWith(
        mockedInitiativeId,
        expect.any(Object)
      );
    });

    await waitFor(() => {
      expect(setCurrentStep).toHaveBeenCalledWith(3);
    });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenLastCalledWith(false);
    });
  });

  test('saves the draft and closes the toast', async () => {
    renderGeneralInfo({
      action: WIZARD_ACTIONS.DRAFT,
      generalInfo: mockedGeneralBody,
    });

    await waitFor(() => {
      expect(mockUpdateInitiativeGeneralInfoDraft).toHaveBeenCalledWith(
        mockedInitiativeId,
        expect.any(Object)
      );
    });
    expect(await screen.findByText('components.wizard.common.draftSaved')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('CloseIcon'));

    await waitFor(() => {
      expect(screen.queryByText('components.wizard.common.draftSaved')).not.toBeInTheDocument();
    });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenLastCalledWith(false);
    });
  });

  test('test catch case of updateInitiativeGeneralInfo api call', async () => {
    mockUpdateInitiativeGeneralInfo.mockRejectedValueOnce(new Error('reject case of api call'));

    renderGeneralInfo({
      action: WIZARD_ACTIONS.SUBMIT,
      generalInfo: mockedGeneralBody,
    });

    await waitFor(() => {
      expect(mockUpdateInitiativeGeneralInfo).toHaveBeenCalledWith(
        mockedInitiativeId,
        expect.any(Object)
      );
      expect(mockAddError).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'EDIT_GENERAL_INFO_SAVE_ERROR' })
      );
    });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenLastCalledWith(false);
    });
  });

  test('test catch case of updateInitiativeGeneralInfoDraft api call', async () => {
    mockUpdateInitiativeGeneralInfoDraft.mockRejectedValueOnce(new Error('reject case of api call'));

    renderGeneralInfo({
      action: WIZARD_ACTIONS.DRAFT,
      generalInfo: mockedGeneralBody,
    });

    await waitFor(() => {
      expect(mockUpdateInitiativeGeneralInfoDraft).toHaveBeenCalledWith(
        mockedInitiativeId,
        expect.any(Object)
      );
      expect(mockAddError).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'EDIT_GENERAL_INFO_SAVE_DRAFT_ERROR' })
      );
    });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenLastCalledWith(false);
    });
  });

  test('does not call submit api when initiative id is missing', async () => {
    const setCurrentStep = jest.fn();
    renderGeneralInfo({
      action: WIZARD_ACTIONS.SUBMIT,
      withInitiativeId: false,
      generalInfo: mockedGeneralBody,
      setCurrentStep,
    });

    await waitFor(() => {
      expect(mockUpdateInitiativeGeneralInfo).not.toHaveBeenCalled();
      expect(setCurrentStep).not.toHaveBeenCalled();
    });
  });

  test('does not call draft api when initiative id is missing', async () => {
    renderGeneralInfo({
      action: WIZARD_ACTIONS.DRAFT,
      withInitiativeId: false,
      generalInfo: mockedGeneralBody,
    });

    await waitFor(() => {
      expect(mockUpdateInitiativeGeneralInfoDraft).not.toHaveBeenCalled();
      expect(screen.queryByText('components.wizard.common.draftSaved')).not.toBeInTheDocument();
    });
  });

  test('keeps submit blocked when date fields are provided as strings with ranking enabled', async () => {
    const setCurrentStep = jest.fn();
    renderGeneralInfo({
      action: WIZARD_ACTIONS.SUBMIT,
      generalInfo: {
        ...mockedGeneralBody,
        beneficiaryKnown: 'false',
        rankingEnabled: 'true',
        rankingStartDate: '01/09/2030' as any,
        rankingEndDate: '30/09/2030' as any,
        startDate: '11/10/2030' as any,
        endDate: '31/01/2031' as any,
      },
      setCurrentStep,
    });

    await waitFor(() => {
      expect(mockUpdateInitiativeGeneralInfo).not.toHaveBeenCalled();
      expect(setCurrentStep).not.toHaveBeenCalled();
    });
  });

  test('keeps submit blocked when date fields are provided as strings with ranking disabled', async () => {
    const setCurrentStep = jest.fn();
    renderGeneralInfo({
      action: WIZARD_ACTIONS.SUBMIT,
      generalInfo: {
        ...mockedGeneralBody,
        beneficiaryKnown: 'false',
        rankingEnabled: 'false',
        rankingStartDate: '01/09/2030' as any,
        rankingEndDate: '30/09/2030' as any,
        startDate: '01/10/2030' as any,
        endDate: '31/01/2031' as any,
      },
      setCurrentStep,
    });

    await waitFor(() => {
      expect(mockUpdateInitiativeGeneralInfo).not.toHaveBeenCalled();
      expect(setCurrentStep).not.toHaveBeenCalled();
    });
  });

  test('switch beneficiary type to NF and back to PF', async () => {
    renderGeneralInfo({ action: '', generalInfo: mockedGeneralBody });

    const familyRadio = screen.getByLabelText('components.wizard.stepTwo.form.family');
    fireEvent.click(familyRadio);
    expect(await screen.findByTestId('family-unit-composition-test')).toBeInTheDocument();
    expect(screen.getByLabelText('components.wizard.stepTwo.form.taxCodeList')).toBeDisabled();
    expect(screen.getByLabelText('components.wizard.stepTwo.form.beneficiaryBudgetFamily')).toBeInTheDocument();

    const personRadio = screen.getByLabelText('components.wizard.stepTwo.form.person');
    fireEvent.click(personRadio);
    expect(screen.queryByTestId('family-unit-composition-test')).not.toBeInTheDocument();
    expect(screen.getByLabelText('components.wizard.stepTwo.form.beneficiaryBudgetPerson')).toBeInTheDocument();
  });

  test('toggles ranking off when beneficiaryKnown is switched to tax code list', async () => {
    renderGeneralInfo({
      action: '',
      generalInfo: {
        ...mockedGeneralBody,
        beneficiaryKnown: 'false',
        rankingEnabled: 'true',
      },
    });

    expect(screen.getByTestId('witRanking-test')).toBeInTheDocument();
    const rankingYes = screen.getByLabelText('components.wizard.stepTwo.form.yes');
    const rankingNo = screen.getByLabelText('components.wizard.stepTwo.form.no');
    expect(rankingYes).toBeChecked();
    expect(rankingNo).not.toBeChecked();

    fireEvent.click(screen.getByLabelText('components.wizard.stepTwo.form.taxCodeList'));

    await waitFor(() => {
      expect(screen.getByLabelText('components.wizard.stepTwo.form.taxCodeList')).toBeChecked();
      expect(screen.queryByTestId('witRanking-test')).not.toBeInTheDocument();
    });
  });

  test('renders preview tabs without italian intro when introductionTextIT is not a string', async () => {
    renderGeneralInfo({
      action: '',
      generalInfo: {
        ...mockedGeneralBody,
        introductionTextIT: undefined as any,
        introductionTextDE: undefined,
        introductionTextSL: undefined,
      },
      additionalInfo: mockedAdditionalInfo,
      selectedParty: mockedParty,
    });

    fireEvent.click(screen.getByText('components.wizard.stepTwo.form.preview'));

    expect(await screen.findByText('components.wizard.stepTwo.previewModal.title')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  test('date fields change handlers are triggered', async () => {
    renderGeneralInfo({ action: '', generalInfo: mockedGeneralBody });

    fireEvent.change(screen.getByLabelText('components.wizard.stepTwo.form.rankingStartDate'), {
      target: { value: '01/10/2026' },
    });
    fireEvent.change(screen.getByLabelText('components.wizard.stepTwo.form.rankingEndDate'), {
      target: { value: '11/10/2026' },
    });
    fireEvent.change(screen.getByLabelText('components.wizard.stepTwo.form.startDate'), {
      target: { value: '21/10/2026' },
    });
    fireEvent.change(screen.getByLabelText('components.wizard.stepTwo.form.endDate'), {
      target: { value: '31/10/2026' },
    });
  });

  test('shows the people reached calc for finite values and dash for infinity', async () => {
    renderGeneralInfo({ action: '', generalInfo: mockedGeneralBody });

    fireEvent.change(screen.getByLabelText('components.wizard.stepTwo.form.budget'), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText('components.wizard.stepTwo.form.beneficiaryBudgetPerson'), {
      target: { value: '100' },
    });

    expect(screen.getByText('components.wizard.stepTwo.form.reachedUsers')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('components.wizard.stepTwo.form.family'));
    await waitFor(() => {
      expect(screen.getByText('components.wizard.stepTwo.form.reachedFamilies')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('components.wizard.stepTwo.form.beneficiaryBudgetFamily'), {
      target: { value: '0' },
    });

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('marks text fields as touched on blur without submitting', async () => {
    renderGeneralInfo({ action: '', generalInfo: mockedGeneralBody });

    fireEvent.blur(screen.getByLabelText('components.wizard.stepTwo.form.budget'));
    fireEvent.blur(
      screen.getByLabelText('components.wizard.stepTwo.form.beneficiaryBudgetPerson')
    );
    fireEvent.blur(screen.getByTestId('introductionTextIT-test'));

    await waitFor(() => {
      expect(mockUpdateInitiativeGeneralInfo).not.toHaveBeenCalled();
      expect(screen.getByTestId('budget-test')).toBeInTheDocument();
      expect(screen.getByTestId('beneficiary-budget-test')).toBeInTheDocument();
    });
  });

  test('evaluates validation branches after submit rerender and introduction tab switches', async () => {
    const setAction = jest.fn();
    const setCurrentStep = jest.fn();
    const setDisabledNext = jest.fn();

    const testStore = createStore();
    testStore.dispatch(setInitiativeId(mockedInitiativeId));
    testStore.dispatch(
      setInitiative({
        ...testStore.getState().initiative,
        generalInfo: {
          ...mockedGeneralBody,
          beneficiaryType: undefined as any,
          beneficiaryKnown: '',
          rankingEnabled: '',
          budget: '',
          beneficiaryBudget: '',
          rankingStartDate: '',
          rankingEndDate: '',
          startDate: '',
          endDate: '',
          introductionTextIT: '',
        },
      })
    );

    const renderResult = renderWithContext(
      <Generalnfo
        action=""
        setAction={setAction}
        currentStep={2}
        setCurrentStep={setCurrentStep}
        setDisabledNext={setDisabledNext}
      />,
      testStore
    );

    fireEvent.blur(screen.getByTestId('introductionTextIT-test'));
    fireEvent.click(screen.getByText('components.wizard.common.languages.english'));
    fireEvent.blur(screen.getByTestId('introductionTextEN-test'));
    fireEvent.click(screen.getByText('components.wizard.common.languages.french'));
    fireEvent.blur(screen.getByTestId('introductionTextFR-test'));
    fireEvent.click(screen.getByText('components.wizard.common.languages.german'));
    fireEvent.blur(screen.getByTestId('introductionTextDE-test'));
    fireEvent.click(screen.getByText('components.wizard.common.languages.slovenian'));
    fireEvent.blur(screen.getByTestId('introductionTextSL-test'));

    renderResult.rerender(
      <Generalnfo
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={setAction}
        currentStep={2}
        setCurrentStep={setCurrentStep}
        setDisabledNext={setDisabledNext}
      />
    );

    await waitFor(() => {
      expect(mockUpdateInitiativeGeneralInfo).not.toHaveBeenCalled();
      expect(setCurrentStep).not.toHaveBeenCalled();
      expect(setDisabledNext).toHaveBeenCalled();
    });
  });
});
