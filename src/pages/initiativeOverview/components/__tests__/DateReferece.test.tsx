/* eslint-disable react/jsx-no-bind */
import { fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from '../../../../redux/store';
import DateReference from '../DateReference';
import React from 'react';
import { BeneficiaryTypeEnum } from '../../../../api/generated/initiative/InitiativeGeneralDTO';
import { mockedInitiative } from '../../../../model/__tests__/Initiative.test';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<DataReference />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const initiative = store.getState().initiative;
  const handleViewDetails = jest.fn();

  it('renders without crashing', () => {
    //  eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should display the DateReference component with his functions', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <DateReference initiative={mockedInitiative} handleViewDetails={undefined} />
        </Provider>
      );
    });
  });

  it('test handleViewDetails', async () => {
    const clonedMockedInitiative = { ...initiative, status: 'APPROVED' };
    await act(async () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <DateReference
            initiative={clonedMockedInitiative}
            handleViewDetails={handleViewDetails}
          />
        </Provider>
      );

      await waitFor(async () => {
        const details = queryByTestId('view-datails-test') as HTMLButtonElement;
        fireEvent.click(details);
        handleViewDetails(initiative.initiativeId);
        expect(handleViewDetails).toHaveBeenCalled();
      });
    });
  });

  test('status message date case Approved', async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 11);
    const clonedMockedInitiative2 = {
      ...mockedInitiative,
      status: 'APPROVED',
      generalInfo: {
        beneficiaryType: BeneficiaryTypeEnum.PF,
        beneficiaryKnown: 'false',
        budget: '8515',
        beneficiaryBudget: '801',
        rankingStartDate: undefined,
        rankingEndDate: '',
        startDate: today,
        endDate: tomorrow,
        rankingEnabled: 'true',
        introductionTextIT: '',
        introductionTextEN: '',
        introductionTextFR: '',
        introductionTextDE: '',
        introductionTextSL: '',
      },
    };

    await act(async () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <DateReference initiative={clonedMockedInitiative2} handleViewDetails={undefined} />
        </Provider>
      );

      const message = queryByTestId('date-message-status');
      expect(message).toBeInTheDocument();
    });
  });

  test('status message date case empty string', async () => {
    const clonedMockedInitiativeDate3 = {
      ...mockedInitiative,
      status: 'DRAFT',
      generalInfo: {
        beneficiaryType: BeneficiaryTypeEnum.PF,
        beneficiaryKnown: 'false',
        budget: '8515',
        beneficiaryBudget: '801',
        rankingStartDate: '',
        rankingEndDate: '',
        startDate: '',
        endDate: '',
        rankingEnabled: 'true',
        introductionTextIT: '',
        introductionTextEN: '',
        introductionTextFR: '',
        introductionTextDE: '',
        introductionTextSL: '',
      },
    };
    render(
      <Provider store={store}>
        <DateReference initiative={clonedMockedInitiativeDate3} handleViewDetails={undefined} />
      </Provider>
    );
  });
});
