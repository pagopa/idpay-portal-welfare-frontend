import { cleanup, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { renderWithHistoryAndStore } from '../../../utils/test-utils';
import SuspensionModal from '../SuspensionModal';
import { StatusEnum as OnboardingStatusEnum } from '../../../api/generated/initiative/OnboardingStatusDTO';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('test suite for suspension modal', () => {
  test('render SuspensionModal with empty props', async () => {
    renderWithHistoryAndStore(
      <SuspensionModal
        suspensionModalOpen={false}
        setSuspensionModalOpen={jest.fn()}
        statusOnb={undefined}
        buttonType={''}
      />
    );
  });

  test('render SuspensionModal on click of SUSPEND button and test click on back button', async () => {
    renderWithHistoryAndStore(
      <SuspensionModal
        suspensionModalOpen={true}
        setSuspensionModalOpen={jest.fn()}
        statusOnb={OnboardingStatusEnum.ONBOARDING_OK}
        buttonType={'SUSPEND'}
      />
    );

    const backBtn = screen.getByText('pages.initiativeUserDetails.suspendModal.backBtn');
    fireEvent.click(backBtn);
  });

  test('render SuspensionModal on click of READMIT button and test on press of escape key', async () => {
    renderWithHistoryAndStore(
      <SuspensionModal
        suspensionModalOpen={true}
        setSuspensionModalOpen={jest.fn()}
        statusOnb={OnboardingStatusEnum.SUSPENDED}
        buttonType={'READMIT'}
      />
    );

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
    renderWithHistoryAndStore(
      <SuspensionModal
        suspensionModalOpen={true}
        setSuspensionModalOpen={jest.fn()}
        statusOnb={OnboardingStatusEnum.SUSPENDED}
        buttonType={'EXCLUDE'}
      />
    );

    const excludeBtn = screen.getByText('pages.initiativeUserDetails.suspendModal.excludeBtn');
    fireEvent.click(excludeBtn);
  });
});
