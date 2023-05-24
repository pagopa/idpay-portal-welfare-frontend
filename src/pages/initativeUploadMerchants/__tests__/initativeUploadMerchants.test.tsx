import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { merchantsApiMocked } from '../../../api/__mocks__/merchantsApiClient';
import { MerchantUpdateDTO } from '../../../api/generated/merchants/MerchantUpdateDTO';
import ROUTES from '../../../routes';
import { renderWithContext } from '../../../utils/test-utils';
import InitativeUploadMerchants from '../initativeUploadMerchants';

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
    renderWithContext(<InitativeUploadMerchants />);
  });

  test('render of InitativeUploadMerchants component', () => {
    renderWithContext(<InitativeUploadMerchants />);
  });

  test('upload succes of csv file type', async () => {
    renderWithContext(<InitativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
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
    renderWithContext(<InitativeUploadMerchants />);

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'img.png', {
      type: 'image/png',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);

    expect(
      await screen.findByText(
        'pages.initiativeRefundsOutcome.uploadPaper.invalidFileTypeDescription'
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-icon'));
  });

  test('upload error with multiple files', () => {
    renderWithContext(<InitativeUploadMerchants />);

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
    renderWithContext(<InitativeUploadMerchants />);

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
      await screen.findByText('pages.initiativeRefundsOutcome.uploadPaper.overMaxUploadDescription')
    ).toBeInTheDocument();
  });

  test('upload catch case of uploadMerchantList', async () => {
    merchantsApiMocked.uploadMerchantList = async (
      _id: string,
      _file: File
    ): Promise<MerchantUpdateDTO> =>
      await Promise.reject('test reject uploadMerchantList addError');

    renderWithContext(<InitativeUploadMerchants />);

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
