import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { GroupUpdateDTO } from '../../../../../api/generated/groups/GroupUpdateDTO';
import { StatusGroupDTO } from '../../../../../api/generated/groups/StatusGroupDTO';
import { groupsApiMocked } from '../../../../../api/__mocks__/groupsApiClient';
import { setInitiativeId } from '../../../../../redux/slices/initiativeSlice';
import { store } from '../../../../../redux/store';
import {
  mockedBeneficiaryStatusAndDetails,
  mockedUploadGroupOfBeneficiary,
} from '../../../../../services/__mocks__/groupService';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithProviders } from '../../../../../utils/test-utils';
import FileUpload from '../FileUpload';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

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

  test('File upload rejected and DRAFT case should fail upload', async () => {
    store.dispatch(setInitiativeId('444444'));

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

    expect(screen.getByText('components.wizard.stepThree.upload.changeFile')).toBeInTheDocument();
    fireEvent.click(screen.getByText('components.wizard.stepThree.upload.changeFile'));

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
  });

  test('Test of uploadGroupOfBeneficiary catch case', async () => {
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
