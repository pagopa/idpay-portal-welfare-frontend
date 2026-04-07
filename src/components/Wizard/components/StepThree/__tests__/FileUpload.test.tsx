import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { GroupUpdateDTO } from '../../../../../api/generated/groups/GroupUpdateDTO';
import { StatusGroupDTO } from '../../../../../api/generated/groups/StatusGroupDTO';
import { groupsApiMocked } from '../../../../../api/__mocks__/groupsApiClient';
import { resetInitiative, setInitiativeId } from '../../../../../redux/slices/initiativeSlice';
import { store } from '../../../../../redux/store';
import {
  mockedBeneficiaryStatusAndDetails,
  mockedUploadGroupOfBeneficiary,
} from '../../../../../services/__mocks__/groupsService';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithProviders } from '../../../../../utils/test-utils';
import FileUpload from '../FileUpload';

jest.mock('../../../../../services/groupsService');
const mockAddError = jest.fn();

jest.mock('@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher', () => () => mockAddError);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

const originalGetGroupOfBeneficiaryStatusAndDetails =
  groupsApiMocked.getGroupOfBeneficiaryStatusAndDetails;
const originalUploadGroupOfBeneficiary = groupsApiMocked.uploadGroupOfBeneficiary;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  mockAddError.mockClear();
  store.dispatch(resetInitiative());
});

afterEach(() => {
  groupsApiMocked.getGroupOfBeneficiaryStatusAndDetails = originalGetGroupOfBeneficiaryStatusAndDetails;
  groupsApiMocked.uploadGroupOfBeneficiary = originalUploadGroupOfBeneficiary;
  cleanup();
});

describe('<FileUpload />', () => {
  window.scrollTo = jest.fn();

  const mockedUploadGroupOfBeneficiaryStatusKOFormat = {
    elabTimeStamp: new Date('2018-10-13T00:00:00.000Z'),
    errorKey: 'group.groups.invalid.file.format',
    errorRow: 0,
    status: 'KO',
  };

  const mockedUploadGroupOfBeneficiaryStatusKOEmpty = {
    elabTimeStamp: new Date('2018-10-13T00:00:00.000Z'),
    errorKey: 'group.groups.invalid.file.empty',
    errorRow: 0,
    status: 'KO',
  };

  const mockedUploadGroupOfBeneficiaryStatusKOSize = {
    elabTimeStamp: new Date('2018-10-13T00:00:00.000Z'),
    errorKey: 'group.groups.invalid.file.size',
    errorRow: 0,
    status: 'KO',
  };

  const mockedUploadGroupOfBeneficiaryStatusKOFileAndBudget = {
    elabTimeStamp: new Date('2018-10-13T00:00:00.000Z'),
    errorKey: 'group.groups.invalid.fiIe',
    errorRow: 0,
    status: 'KO',
  };

  const mockedUploadGroupOfBeneficiaryStatusKOWrong = {
    elabTimeStamp: new Date('2018-10-13T00:00:00.000Z'),
    errorKey: 'group.groups.invalid.file.cf.wrong',
    errorRow: 0,
    status: 'KO',
  };

  const mockedUploadGroupOfBeneficiaryStatusKOBudget = {
    elabTimeStamp: new Date('2018-10-13T00:00:00.000Z'),
    errorKey: 'group.groups.invalid.file.beneficiary.number.budget',
    errorRow: 0,
    status: 'KO',
  };

  const mockedUploadGroupOfBeneficiaryStatusKOUnknown = {
    elabTimeStamp: new Date('2018-10-13T00:00:00.000Z'),
    errorKey: 'group.groups.invalid.file.unknown',
    errorRow: 0,
    status: 'KO',
  };

  test('should display the FileUpload succes case', async () => {
    store.dispatch(setInitiativeId('444444'));

    groupsApiMocked.uploadGroupOfBeneficiary = async (
      _id: string,
      _file: File
    ): Promise<GroupUpdateDTO> => new Promise((resolve) => resolve(mockedUploadGroupOfBeneficiary));

    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });
  });

  test('FileUpload should keep loading when a valid file is dropped without initiative id', async () => {
    renderWithProviders(
      <FileUpload
        action={''}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });

    await waitFor(() =>
      expect(screen.getByText('components.wizard.stepThree.upload.fileIsLoading')).toBeInTheDocument()
    );
  });

  test('FileUpload should use the fallback date when elabTimeStamp is not a Date', async () => {
    store.dispatch(setInitiativeId('444444'));
    groupsApiMocked.getGroupOfBeneficiaryStatusAndDetails = async (
      _id: string
    ): Promise<StatusGroupDTO> => Promise.reject({});

    groupsApiMocked.uploadGroupOfBeneficiary = async (
      _id: string,
      _file: File
    ): Promise<GroupUpdateDTO> =>
      new Promise((resolve) =>
        resolve({
          elabTimeStamp: '2018-10-13T00:00:00.000Z' as any,
          errorKey: 'errorKey',
          errorRow: 0,
          status: 'APPROVED',
        })
      );

    renderWithProviders(
      <FileUpload
        action={''}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });

    await waitFor(() => expect(screen.getByText('text.csv')).toBeInTheDocument());
    expect(screen.getByText('components.wizard.stepThree.upload.validFile')).toBeInTheDocument();
  });

  test('FileUpload Reject File status KO error key group.groups.invalid.file.format', async () => {
    store.dispatch(setInitiativeId('444444'));

    groupsApiMocked.uploadGroupOfBeneficiary = async (
      _id: string,
      _file: File
    ): Promise<GroupUpdateDTO> =>
      new Promise((resolve) => resolve(mockedUploadGroupOfBeneficiaryStatusKOFormat));

    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });
  });

  test('FileUpload Reject File status KO error key group.groups.invalid.file.empty', async () => {
    store.dispatch(setInitiativeId('444444'));

    groupsApiMocked.uploadGroupOfBeneficiary = async (
      _id: string,
      _file: File
    ): Promise<GroupUpdateDTO> =>
      new Promise((resolve) => resolve(mockedUploadGroupOfBeneficiaryStatusKOEmpty));

    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });
  });

  test('FileUpload Reject File status KO error key group.groups.invalid.file.size', async () => {
    store.dispatch(setInitiativeId('444444'));

    groupsApiMocked.uploadGroupOfBeneficiary = async (
      _id: string,
      _file: File
    ): Promise<GroupUpdateDTO> =>
      new Promise((resolve) => resolve(mockedUploadGroupOfBeneficiaryStatusKOSize));

    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });
  });

  test('FileUpload Reject File status KO error key group.groups.invalid.fiIe', async () => {
    store.dispatch(setInitiativeId('444444'));

    groupsApiMocked.uploadGroupOfBeneficiary = async (
      _id: string,
      _file: File
    ): Promise<GroupUpdateDTO> =>
      new Promise((resolve) => resolve(mockedUploadGroupOfBeneficiaryStatusKOFileAndBudget));

    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });
  });

  test('FileUpload Reject File status KO error key group.groups.invalid.file.cf.wrong', async () => {
    store.dispatch(setInitiativeId('444444'));

    groupsApiMocked.uploadGroupOfBeneficiary = async (
      _id: string,
      _file: File
    ): Promise<GroupUpdateDTO> =>
      new Promise((resolve) => resolve(mockedUploadGroupOfBeneficiaryStatusKOWrong));

    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });
  });

  test('FileUpload Reject File status KO error key group.groups.invalid.file.beneficiary.number.budget', async () => {
    store.dispatch(setInitiativeId('444444'));
    groupsApiMocked.getGroupOfBeneficiaryStatusAndDetails = async (
      _id: string
    ): Promise<StatusGroupDTO> => Promise.reject({});

    groupsApiMocked.uploadGroupOfBeneficiary = async (
      _id: string,
      _file: File
    ): Promise<GroupUpdateDTO> =>
      new Promise((resolve) => resolve(mockedUploadGroupOfBeneficiaryStatusKOBudget));

    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });

    await waitFor(() =>
      expect(screen.getByText('components.wizard.stepThree.upload.invalidBeneficiaryNumberTitle')).toBeInTheDocument()
    );
    expect(
      screen.getByText('components.wizard.stepThree.upload.invalidBeneficiaryNumberDescription')
    ).toBeInTheDocument();
  });

  test('FileUpload Reject File status KO default branch', async () => {
    store.dispatch(setInitiativeId('444444'));
    groupsApiMocked.getGroupOfBeneficiaryStatusAndDetails = async (
      _id: string
    ): Promise<StatusGroupDTO> => Promise.reject({});

    groupsApiMocked.uploadGroupOfBeneficiary = async (
      _id: string,
      _file: File
    ): Promise<GroupUpdateDTO> =>
      new Promise((resolve) => resolve(mockedUploadGroupOfBeneficiaryStatusKOUnknown));

    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  test('File upload rejected and DRAFT case should fail upload', async () => {
    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.DRAFT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );
    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'img.png', {
      type: 'image/png',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });
    await waitFor(() =>
      expect(
        screen.getByText('components.wizard.stepThree.upload.invalidFileTitle')
      ).toBeInTheDocument()
    );

    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('close-icon'));

    const draftSavedAlert = await waitFor(() => {
      return screen.getByText('components.wizard.common.draftSaved');
    });

    expect(draftSavedAlert).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('CloseIcon'));
  });

  test('File upload rejected and DRAFT case should fail upload beacuse of multiple files', async () => {
    store.dispatch(setInitiativeId('444444'));
    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );
    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    const file2 = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file, file2],
    });

    fireEvent.drop(inputEl, { file, file2 });
  });

  test('File upload rejected and should fail upload for wrong size', async () => {
    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );
    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(file, 'size', { value: 2197152 });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });

    await waitFor(() => {
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('close-icon'));
    });
  });

  test('File upload rejected and should fail upload for wrong size', async () => {
    groupsApiMocked.getGroupOfBeneficiaryStatusAndDetails = async (
      _id: string
    ): Promise<StatusGroupDTO> =>
      new Promise((resolve) => resolve(mockedBeneficiaryStatusAndDetails));

    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(file, 'size', { value: 2197152 });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });

    await waitFor(() => {
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('close-icon'));
    });
  });

  test('Test of getGroupOfBeneficiaryStatusAndDetails catch case', async () => {
    store.dispatch(setInitiativeId('444444'));
    groupsApiMocked.getGroupOfBeneficiaryStatusAndDetails = async (
      _id: string
    ): Promise<StatusGroupDTO> => Promise.reject('rejected promise for test catch case');

    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    await waitFor(() => expect(mockAddError).toHaveBeenCalledTimes(1));
  });

  test('Test of getGroupOfBeneficiaryStatusAndDetails catch case with empty error', async () => {
    store.dispatch(setInitiativeId('444444'));
    const setDisabledNext = jest.fn();

    groupsApiMocked.getGroupOfBeneficiaryStatusAndDetails = async (
      _id: string
    ): Promise<StatusGroupDTO> => Promise.reject({});

    renderWithProviders(
      <FileUpload
        action={''}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={setDisabledNext}
      />
    );

    await waitFor(() => expect(setDisabledNext).toHaveBeenCalledTimes(2));
    expect(mockAddError).not.toHaveBeenCalled();
  });

  test('Test of uploadGroupOfBeneficiary catch case', async () => {
    store.dispatch(setInitiativeId('444444'));
    groupsApiMocked.getGroupOfBeneficiaryStatusAndDetails = async (
      _id: string
    ): Promise<StatusGroupDTO> => Promise.reject({});
    groupsApiMocked.uploadGroupOfBeneficiary = async (
      _id: string,
      _file: File
    ): Promise<GroupUpdateDTO> => Promise.reject('rejected promise for test catch case');

    renderWithProviders(
      <FileUpload
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );

    const inputEl = screen.getByTestId('drop-input-step3') as HTMLInputElement;
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl, { file });

    await waitFor(() => expect(mockAddError).toHaveBeenCalledTimes(1));
  });

  test('Test of render component with no action', async () => {
    renderWithProviders(
      <FileUpload
        action={''}
        setAction={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
        setDisabledNext={jest.fn()}
      />
    );
  });
});
