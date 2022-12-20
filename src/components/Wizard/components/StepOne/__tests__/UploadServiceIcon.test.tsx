import { SetStateAction } from 'react';
import { renderWithProviders } from '../../../../../utils/test-utils';
import UploadServiceIcon from '../UploadServiceIcon';
import React from 'react';
import { fireEvent, screen, waitFor, cleanup } from '@testing-library/react';

window.scrollTo = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<UploadServiceIcon />', () => {
  it('should render with ok props', async () => {
    renderWithProviders(
      <UploadServiceIcon
        setUploadFile={function (_value: SetStateAction<File | undefined>): void {
          //
        }}
        setFileUploadedOk={function (_value: SetStateAction<boolean>): void {
          //
        }}
        fileUplodedOk={true}
        fileUplodedKo={false}
        fileName={'fileName'}
        fileUploadDate={'20-11'}
        setFileName={function (_value: SetStateAction<string>): void {
          //
        }}
        setUploadDate={function (_value: SetStateAction<string>): void {
          //
        }}
      />
    );
  });
  it('should drop the icon correctly', async () => {
    renderWithProviders(
      <UploadServiceIcon
        setUploadFile={function (_value: SetStateAction<File | undefined>): void {
          //
        }}
        setFileUploadedOk={function (_value: SetStateAction<boolean>): void {
          //
        }}
        fileUplodedOk={false}
        fileUplodedKo={false}
        fileName={undefined}
        fileUploadDate={undefined}
        setFileName={function (_value: SetStateAction<string>): void {
          //
        }}
        setUploadDate={function (_value: SetStateAction<string>): void {
          //
        }}
      />
    );

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'img.png', {
      type: 'image/png',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
    waitFor(() => expect(screen.getByText('img.png')).toBeInTheDocument());
  });

  test('Should render correctly the UploadServiceIcon component and fail upload for multiple files', async () => {
    renderWithProviders(
      <UploadServiceIcon
        setUploadFile={function (_value: SetStateAction<File | undefined>): void {
          //
        }}
        setFileUploadedOk={function (_value: SetStateAction<boolean>): void {
          //
        }}
        fileUplodedOk={false}
        fileUplodedKo={false}
        fileName={undefined}
        fileUploadDate={undefined}
        setFileName={function (_value: SetStateAction<string>): void {
          //
        }}
        setUploadDate={function (_value: SetStateAction<string>): void {
          //
        }}
      />
    );

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'img.png', {
      type: 'image/png',
    });
    const file2 = new File(['file'], 'img.png', {
      type: 'image/png',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file, file2],
    });
    fireEvent.drop(inputEl, { file, file2 });
  });

  it('should fail upload for wrong type of file', async () => {
    renderWithProviders(
      <UploadServiceIcon
        setUploadFile={function (_value: SetStateAction<File | undefined>): void {
          //
        }}
        setFileUploadedOk={function (_value: SetStateAction<boolean>): void {
          //
        }}
        fileUplodedOk={false}
        fileUplodedKo={false}
        fileName={undefined}
        fileUploadDate={undefined}
        setFileName={function (_value: SetStateAction<string>): void {
          //
        }}
        setUploadDate={function (_value: SetStateAction<string>): void {
          //
        }}
      />
    );

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });

  it('should fail upload for wrong size of file', async () => {
    renderWithProviders(
      <UploadServiceIcon
        setUploadFile={function (_value: SetStateAction<File | undefined>): void {
          //
        }}
        setFileUploadedOk={function (_value: SetStateAction<boolean>): void {
          //
        }}
        fileUplodedOk={false}
        fileUplodedKo={true}
        fileName={undefined}
        fileUploadDate={undefined}
        setFileName={function (_value: SetStateAction<string>): void {
          //
        }}
        setUploadDate={function (_value: SetStateAction<string>): void {
          //
        }}
      />
    );

    const inputEl = screen.getByTestId('drop-input');
    const file = new File(['file'], 'text.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1000 });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });
});
