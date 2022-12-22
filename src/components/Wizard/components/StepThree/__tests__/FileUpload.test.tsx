import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { setInitiativeId } from '../../../../../redux/slices/initiativeSlice';
import { store } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithProviders } from '../../../../../utils/test-utils';
import FileUpload from '../FileUpload';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<FileUpload />', () => {
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the FileUpload succes case', async () => {
    store.dispatch(setInitiativeId('444444'));
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

    render(
      <Provider store={store}>
        <FileUpload
          action={WIZARD_ACTIONS.DRAFT}
          setAction={jest.fn()}
          currentStep={3}
          setCurrentStep={jest.fn()}
          setDisabledNext={jest.fn()}
        />
      </Provider>
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
    render(
      <Provider store={store}>
        <FileUpload
          action={WIZARD_ACTIONS.BACK}
          setAction={jest.fn()}
          currentStep={3}
          setCurrentStep={jest.fn()}
          setDisabledNext={jest.fn()}
        />
      </Provider>
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
      <Provider store={store}>
        <FileUpload
          action={''}
          setAction={jest.fn()}
          currentStep={3}
          setCurrentStep={jest.fn()}
          setDisabledNext={jest.fn()}
        />
      </Provider>
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
});
