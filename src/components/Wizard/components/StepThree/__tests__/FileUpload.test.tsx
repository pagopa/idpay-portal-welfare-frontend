import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { SetStateAction } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import FileUpload from '../FileUpload';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

let dropCallback = null;
let onDragEnterCallback = null;
let onDragLeaveCallback = null;

jest.mock('react-dropzone', () => ({
  ...jest.requireActual('react-dropzone'),
  useDropzone: (options) => {
    dropCallback = options.onDrop;
    onDragEnterCallback = options.onDragEnter;
    onDragLeaveCallback = options.onDragLeave;

    return {
      acceptedFiles: [
        {
          path: 'sample4.png',
        },
        {
          path: 'sample3.png',
        },
      ],
      fileRejections: [
        {
          file: {
            path: 'FileSelector.docx',
          },
          errors: [
            {
              code: 'file-invalid-type',
              message: 'File type must be image/*',
            },
          ],
        },
      ],
      getRootProps: jest.fn(),
      getInputProps: jest.fn(),
      open: jest.fn(),
    };
  },
}));

describe('<FileUpload />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the FileUpload component', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <FileUpload
            action={WIZARD_ACTIONS.SUBMIT}
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={0}
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            setDisabledNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );
      window.URL.createObjectURL = jest.fn().mockImplementation(() => 'url');
      const inputEl = screen.getByText('components.wizard.stepThree.upload.dragAreaText');
      /*  const file = new File(['file'], 'ping.json', {
        type: 'application/json',
      });

      Object.defineProperty(inputEl, 'files', {
        value: [file],
      });
      */
      fireEvent.click(inputEl);
      // expect(open).toHaveBeenCalled();
      // expect(await screen.findByText('ping.json')).toBeInTheDocument();
    });
  });
});
