import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
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

describe('<FileUpload />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the FileUpload component Submit case', async () => {
    render(
      <Provider store={store}>
        <FileUpload
          action={WIZARD_ACTIONS.SUBMIT}
          setAction={function (_value: SetStateAction<string>): void {
            //
          }}
          currentStep={3}
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
    const inputEl = screen.getByTestId('drop-input-step3');
    const file = new File(['file'], 'img.png', {
      type: 'image/png',
    });

    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    /*
      second method of upload
      const file2 = new File(["(⌐□_□)"], "chucknorris.jpg", { type: "image/jpg" });
      
      await waitFor(() =>
      fireEvent.change(inputEl, {
        target: { files: [file2] },
      }))
      */

    fireEvent.drop(inputEl);
    waitFor(() => expect(screen.getByText('img.png')).toBeInTheDocument());
  });

  test('File upload rejected and DRAFT case', async () => {
    await waitFor(() => {
      render(
        <Provider store={store}>
          <FileUpload
            action={WIZARD_ACTIONS.DRAFT}
            setAction={function (_value: SetStateAction<string>): void {
              //
            }}
            currentStep={3}
            setCurrentStep={function (_value: SetStateAction<number>): void {
              //
            }}
            setDisabledNext={function (_value: SetStateAction<boolean>): void {
              //
            }}
          />
        </Provider>
      );
    });
  });
});
