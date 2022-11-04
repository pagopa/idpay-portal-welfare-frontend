import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import Assistance from '../assistance';
import { createStore } from '../../../redux/store';

jest.mock('react-router-dom', () => Function());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/portale-enti',
  }),
}));

jest.mock('@pagopa/selfcare-common-frontend', () => ({
  useLoading: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<InitiativeDetail />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    window.scrollTo = jest.fn();
  });

  test('Should render the Assistance component', async () => {
    render(
      <Provider store={store}>
        <Assistance />
      </Provider>
    );
  });

  const setup = () => {
    const utils = render(
      <Provider store={store}>
        <Assistance />
      </Provider>
    );
    const assSubject = utils.getByLabelText('pages.assistance.form.subject') as HTMLInputElement;
    const assMessage = utils.getByLabelText('pages.assistance.form.message') as HTMLInputElement;
    const sendBtn = utils.queryByTestId('sendAssistenceRequest-test') as HTMLButtonElement;
    const exitBtn = utils.queryByTestId('open-exit-test') as HTMLButtonElement;
    const handleSubmit = jest.fn();
    const closeWithoutSaving = jest.fn();
    const thxPage = utils.queryByTestId('thx-page-test') as HTMLElement;
    return {
      assSubject,
      assMessage,
      sendBtn,
      exitBtn,
      handleSubmit,
      closeWithoutSaving,
      thxPage,
      ...utils,
    };
  };

  test('Test of form fields', async () => {
    const { assSubject, assMessage, sendBtn, exitBtn, handleSubmit, closeWithoutSaving, thxPage } =
      setup();

    await waitFor(async () => {
      //Assistance subject test
      fireEvent.change(assSubject, { target: { value: 'assistance subject' } });
      expect(assSubject.value).toBe('assistance subject');
      fireEvent.change(assSubject, { target: { value: '' } });
      expect(assSubject.value).toBe('');
      //Assistance message test
      fireEvent.change(assMessage, { target: { value: 'assistance message' } });
      expect(assMessage.value).toBe('assistance message');
      fireEvent.change(assMessage, { target: { value: '' } });
      expect(assMessage.value).toBe('');
    });

    const initialValues = {
      assistanceSubject: '',
      assistanceEmailFrom: '',
      assistanceMessage: '',
    };

    await waitFor(async () => {
      //Send button test
      fireEvent.click(sendBtn);
      expect(handleSubmit).toBeDefined();
      handleSubmit(initialValues);
      expect(sendBtn).toBeInTheDocument();
      expect(handleSubmit).toHaveBeenCalledWith(initialValues);
      //Exit button test
      fireEvent.click(exitBtn);
      expect(closeWithoutSaving).toBeDefined();
      expect(exitBtn).toBeInTheDocument();
      closeWithoutSaving();
      expect(closeWithoutSaving).toHaveBeenCalled();
    });

    const setThxPage = jest.fn();
    const useStateMock: any = (viewThxPage: boolean) => [viewThxPage, setThxPage];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    expect(setThxPage).toBeDefined();

    expect(thxPage).not.toBeInTheDocument();
  });
});
