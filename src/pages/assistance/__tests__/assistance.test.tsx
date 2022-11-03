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
    // eslint-disable-next-line functional/immutable-data
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
    const sendBtn = utils.getByTestId('sendAssistenceRequest-test') as HTMLButtonElement;
    const handleClick = jest.fn();
    return {
      assSubject,
      assMessage,
      sendBtn,
      handleClick,
      ...utils,
    };
  };

  it('Test of form fields', async () => {
    const { assSubject, assMessage, sendBtn, handleClick } = setup();

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
      //Send button test
      expect(sendBtn).toBeInTheDocument();
      fireEvent.click(sendBtn);
      handleClick();
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
