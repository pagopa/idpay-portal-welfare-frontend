import { SetStateAction } from 'react';
import { renderWithProviders } from '../../../../../utils/test-utils';
import UploadServiceIcon from '../UploadServiceIcon';
import React from 'react';
import { fireEvent, screen, act, waitFor } from '@testing-library/react';

window.scrollTo = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<UploadServiceIcon />', () => {
  test('Should render correctly the UploadServiceIcon component', async () => {
    await act(async () => {
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
    });
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
    window.URL.createObjectURL = jest.fn().mockImplementation(() => 'url');
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
});
