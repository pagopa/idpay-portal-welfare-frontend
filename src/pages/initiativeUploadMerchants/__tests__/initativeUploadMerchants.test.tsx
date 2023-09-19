import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { merchantsApiMocked } from '../../../api/__mocks__/merchantsApiClient';
import { MerchantUpdateDTO } from '../../../api/generated/merchants/MerchantUpdateDTO';
import ROUTES from '../../../routes';
import { renderWithContext } from '../../../utils/test-utils';
import InitiativeUploadMerchants from '../initiativeUploadMerchants';

const oldWindowLocation = global.window.location;

const mockedLocation = {
  assign: jest.fn(),
  pathname: ROUTES.INITIATIVE_MERCHANT_UPLOAD,
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});

afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('test suite for InitativeUploadMerchants component', () => {
  test('render of InitativeUploadMerchants component', () => {
    renderWithContext(<InitiativeUploadMerchants />);
  });

  test('render of InitativeUploadMerchants component', () => {
    renderWithContext(<InitiativeUploadMerchants />);
  });

  test('upload succes of csv file type', async () => {
    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(file, 'size', { value: 184500 });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });

    fireEvent.drop(inputEl);

    expect(
      await screen.findByText('components.wizard.stepThree.upload.validFile')
    ).toBeInTheDocument();

    fireEvent.click(await screen.findByText('components.wizard.stepThree.upload.changeFile'));
  });

  test('upload error with wrong file type (png)', async () => {
    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'img.png', {
      type: 'image/png',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);

    expect(
      await screen.findByText('pages.initiativeMerchantUpload.uploadPaper.wrongFileType')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-icon'));
  });

  test('upload error with multiple files', () => {
    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input') as HTMLInputElement;
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

  test('upload error with file size to large', async () => {
    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(file, 'size', { value: 184500800 });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);

    expect(
      await screen.findByText('pages.initiativeMerchantUpload.uploadPaper.fileTooLarge')
    ).toBeInTheDocument();
  });

  test('upload catch case of uploadMerchantList', async () => {
    merchantsApiMocked.uploadMerchantList = async (
      _id: string,
      _file: File
    ): Promise<MerchantUpdateDTO> =>
      await Promise.reject('test reject uploadMerchantList addError');

    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('upload catch case of uploadMerchantList status merchant.invalid.file.empty', async () => {
    const mockedResponse = {
      elabTimeStamp: new Date(),
      errorKey: 'merchant.invalid.file.empty',
      errorRow: 0,
      status: 'REJECTED',
    };

    merchantsApiMocked.uploadMerchantList = async (
      _id: string,
      _file: File
    ): Promise<MerchantUpdateDTO> => await Promise.resolve(mockedResponse);

    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('upload catch case of uploadMerchantList status merchant.invalid.file.format', async () => {
    const mockedResponse = {
      elabTimeStamp: new Date(),
      errorKey: 'merchant.invalid.file.format',
      errorRow: 0,
      status: 'REJECTED',
    };

    merchantsApiMocked.uploadMerchantList = async (
      _id: string,
      _file: File
    ): Promise<MerchantUpdateDTO> => await Promise.resolve(mockedResponse);

    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('upload catch case of uploadMerchantList status merchant.invalid.file.name', async () => {
    const mockedResponse = {
      elabTimeStamp: new Date(),
      errorKey: 'merchant.invalid.file.name',
      errorRow: 0,
      status: 'REJECTED',
    };

    merchantsApiMocked.uploadMerchantList = async (
      _id: string,
      _file: File
    ): Promise<MerchantUpdateDTO> => await Promise.resolve(mockedResponse);

    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('upload catch case of uploadMerchantList status merchant.invalid.file.size', async () => {
    const mockedResponse = {
      elabTimeStamp: new Date(),
      errorKey: 'merchant.invalid.file.size',
      errorRow: 0,
      status: 'REJECTED',
    };

    merchantsApiMocked.uploadMerchantList = async (
      _id: string,
      _file: File
    ): Promise<MerchantUpdateDTO> => await Promise.resolve(mockedResponse);

    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('upload catch case of uploadMerchantList status merchant.missing.required.fields', async () => {
    const mockedResponse = {
      elabTimeStamp: new Date(),
      errorKey: 'merchant.missing.required.fields',
      errorRow: 1,
      status: 'REJECTED',
    };

    merchantsApiMocked.uploadMerchantList = async (
      _id: string,
      _file: File
    ): Promise<MerchantUpdateDTO> => await Promise.resolve(mockedResponse);

    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('upload catch case of uploadMerchantList status merchant.invalid.file.cf.wrong', async () => {
    const mockedResponse = {
      elabTimeStamp: new Date(),
      errorKey: 'merchant.invalid.file.cf.wrong',
      errorRow: 1,
      status: 'REJECTED',
    };

    merchantsApiMocked.uploadMerchantList = async (
      _id: string,
      _file: File
    ): Promise<MerchantUpdateDTO> => await Promise.resolve(mockedResponse);

    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('upload catch case of uploadMerchantList status merchant.invalid.file.iban.wrong', async () => {
    const mockedResponse = {
      elabTimeStamp: new Date(),
      errorKey: 'merchant.invalid.file.iban.wrong',
      errorRow: 1,
      status: 'REJECTED',
    };

    merchantsApiMocked.uploadMerchantList = async (
      _id: string,
      _file: File
    ): Promise<MerchantUpdateDTO> => await Promise.resolve(mockedResponse);

    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('upload catch case of uploadMerchantList status merchant.invalid.file.email.wrong', async () => {
    const mockedResponse = {
      elabTimeStamp: new Date(),
      errorKey: 'merchant.invalid.file.email.wrong',
      errorRow: 1,
      status: 'REJECTED',
    };

    merchantsApiMocked.uploadMerchantList = async (
      _id: string,
      _file: File
    ): Promise<MerchantUpdateDTO> => await Promise.resolve(mockedResponse);

    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('upload catch case of uploadMerchantList status merchant.invalid.file.acquirer.wrong', async () => {
    const mockedResponse = {
      elabTimeStamp: new Date(),
      errorKey: 'merchant.invalid.file.acquirer.wrong',
      errorRow: 1,
      status: 'REJECTED',
    };

    merchantsApiMocked.uploadMerchantList = async (
      _id: string,
      _file: File
    ): Promise<MerchantUpdateDTO> => await Promise.resolve(mockedResponse);

    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  test('upload catch case of uploadMerchantList status unexpected', async () => {
    const mockedResponse = {
      elabTimeStamp: new Date(),
      errorKey: 'unexpected',
      errorRow: 1,
      status: 'REJECTED',
    };

    merchantsApiMocked.uploadMerchantList = async (
      _id: string,
      _file: File
    ): Promise<MerchantUpdateDTO> => await Promise.resolve(mockedResponse);

    renderWithContext(<InitiativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });
});
