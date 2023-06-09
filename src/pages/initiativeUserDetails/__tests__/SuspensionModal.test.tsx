import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { StatusEnum as OnboardingStatusEnum } from '../../../api/generated/initiative/OnboardingStatusDTO';
import { renderWithContext } from '../../../utils/test-utils';
import SuspensionModal from '../SuspensionModal';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('test suite for suspension modal', () => {
  test('render SuspensionModal with empty props', async () => {
    renderWithContext(
      <SuspensionModal
        suspensionModalOpen={false}
        setSuspensionModalOpen={jest.fn()}
        statusOnb={undefined}
        buttonType={''}
        setStatusOnb={function (
          value: React.SetStateAction<OnboardingStatusEnum | undefined>
        ): void {
          throw new Error('Function not implemented.');
        }}
        id={''}
        cf={''}
      />
    );
  });

  test('render SuspensionModal on click of SUSPEND button and test click on back button', async () => {
    renderWithContext(
      <SuspensionModal
        suspensionModalOpen={true}
        setSuspensionModalOpen={jest.fn()}
        statusOnb={OnboardingStatusEnum.ONBOARDING_OK}
        buttonType={'SUSPEND'}
        setStatusOnb={function (
          value: React.SetStateAction<OnboardingStatusEnum | undefined>
        ): void {
          throw new Error('Function not implemented.');
        }}
        id={'mockId'}
        cf={'mockCF'}
      />
    );

    const backBtn = screen.getByText('pages.initiativeUserDetails.suspendModal.backBtn');
    fireEvent.click(backBtn);

    const suspendBtn = screen.getByText('pages.initiativeUserDetails.suspendModal.suspendBtn');
    fireEvent.click(suspendBtn);
  });

  test('render SuspensionModal on click of READMIT button and test on press of escape key', async () => {
    renderWithContext(
      <SuspensionModal
        suspensionModalOpen={true}
        setSuspensionModalOpen={jest.fn()}
        statusOnb={OnboardingStatusEnum.SUSPENDED}
        buttonType={'READMIT'}
        setStatusOnb={function (
          value: React.SetStateAction<OnboardingStatusEnum | undefined>
        ): void {
          throw new Error('Function not implemented.');
        }}
        id={'mockId'}
        cf={'mockCF'}
      />
    );

    const readmitBtn = screen.getByText('pages.initiativeUserDetails.suspendModal.readmitBtn');

    fireEvent.click(readmitBtn);

    fireEvent.keyDown(
      screen.getByText('pages.initiativeUserDetails.suspendModal.readmitUserTitle'),
      {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        charCode: 27,
      }
    );
  });

  test('render SuspensionModal on click of EXCLUDE button and test click of  confirm exclude button', async () => {
    renderWithContext(
      <SuspensionModal
        suspensionModalOpen={true}
        setSuspensionModalOpen={jest.fn()}
        statusOnb={OnboardingStatusEnum.SUSPENDED}
        buttonType={'EXCLUDE'}
        setStatusOnb={function (
          value: React.SetStateAction<OnboardingStatusEnum | undefined>
        ): void {
          throw new Error('Function not implemented.');
        }}
        id={'mockId'}
        cf={'mockCF'}
      />
    );

    const excludeBtn = screen.getByText('pages.initiativeUserDetails.suspendModal.excludeBtn');
    fireEvent.click(excludeBtn);
  });
});
