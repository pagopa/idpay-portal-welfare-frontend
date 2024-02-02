import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../../../../redux/store';
import { mockedServiceInfoData } from '../../../../../services/__mocks__/intitativeService';
import InitiativeNotOnIoModal from '../InitiativeNotOnIOModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<InitiativeNotOnIoModal />', () => {
  window.scrollTo = jest.fn();

  test('should render the InitiativeNotOnIoModal component', async () => {
    render(
      <Provider store={store}>
        <InitiativeNotOnIoModal
          openInitiativeNotOnIOModal={false}
          handleCloseInitiativeNotOnIOModal={jest.fn()}
          values={mockedServiceInfoData}
          sendValues={jest.fn()}
          currentStep={0}
          setCurrentStep={jest.fn()}
        />
      </Provider>
    );
  });

  it('the functions should be defined', async () => {
    render(
      <Provider store={store}>
        <InitiativeNotOnIoModal
          openInitiativeNotOnIOModal={true}
          handleCloseInitiativeNotOnIOModal={jest.fn()}
          values={mockedServiceInfoData}
          sendValues={jest.fn()}
          currentStep={0}
          setCurrentStep={jest.fn()}
        />
      </Provider>
    );

    const cancelBtn = screen.getByTestId('cancel-button-test') as HTMLButtonElement;
    fireEvent.click(cancelBtn);

    const exitBtn = screen.getByTestId('exit-button-test') as HTMLButtonElement;
    fireEvent.click(exitBtn);
  });
});
