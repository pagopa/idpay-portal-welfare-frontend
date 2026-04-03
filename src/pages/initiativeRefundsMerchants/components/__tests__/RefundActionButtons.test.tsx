import { fireEvent, render, screen } from '@testing-library/react';
import { RewardBatchTrxStatusEnum } from '../../../../api/generated/merchants/RewardBatchTrxStatus';
import { RefundActionButtons } from '../RefundActionButtons';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@pagopa/mui-italia', () => ({
  ButtonNaked: (props: any) => (
    <button onClick={props.onClick} data-testid="button-naked">
      {props.children}
    </button>
  ),
}));

describe('RefundActionButtons', () => {
  type RefundAction = 'approve' | 'suspend' | 'reject';
  const onApprove = jest.fn();
  const onSuspend = jest.fn();
  const onReject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    {
      title: 'TO_CHECK in row mode',
      status: RewardBatchTrxStatusEnum.TO_CHECK,
      direction: 'row' as const,
      buttons: [
        'pages.initiativeMerchantsTransactions.modal.reject',
        'pages.initiativeMerchantsTransactions.modal.suspend',
        'pages.initiativeMerchantsTransactions.modal.approve',
      ],
      clickOrder: ['reject', 'suspend', 'approve'] as const,
    },
    {
      title: 'CONSULTABLE in column mode',
      status: RewardBatchTrxStatusEnum.CONSULTABLE,
      direction: 'column' as const,
      buttons: [
        'pages.initiativeMerchantsTransactions.modal.approve',
        'pages.initiativeMerchantsTransactions.modal.suspend',
        'pages.initiativeMerchantsTransactions.modal.reject',
      ],
      clickOrder: ['approve', 'suspend', 'reject'] as const,
    },
    {
      title: 'REJECTED in row mode',
      status: RewardBatchTrxStatusEnum.REJECTED,
      direction: 'row' as const,
      buttons: [
        'pages.initiativeMerchantsTransactions.modal.suspend',
        'pages.initiativeMerchantsTransactions.modal.approve',
      ],
      clickOrder: ['suspend', 'approve'] as const,
    },
    {
      title: 'REJECTED in column mode',
      status: RewardBatchTrxStatusEnum.REJECTED,
      direction: 'column' as const,
      buttons: [
        'pages.initiativeMerchantsTransactions.modal.approve',
        'pages.initiativeMerchantsTransactions.modal.suspend',
      ],
      clickOrder: ['approve', 'suspend'] as const,
    },
    {
      title: 'SUSPENDED in column mode',
      status: RewardBatchTrxStatusEnum.SUSPENDED,
      direction: 'column' as const,
      buttons: [
        'pages.initiativeMerchantsTransactions.modal.approve',
        'pages.initiativeMerchantsTransactions.modal.reject',
      ],
      clickOrder: ['approve', 'reject'] as const,
    },
    {
      title: 'SUSPENDED in row mode',
      status: RewardBatchTrxStatusEnum.SUSPENDED,
      direction: 'row' as const,
      buttons: [
        'pages.initiativeMerchantsTransactions.modal.reject',
        'pages.initiativeMerchantsTransactions.modal.approve',
      ],
      clickOrder: ['reject', 'approve'] as const,
    },
    {
      title: 'APPROVED in row mode',
      status: RewardBatchTrxStatusEnum.APPROVED,
      direction: 'row' as const,
      buttons: [
        'pages.initiativeMerchantsTransactions.modal.reject',
        'pages.initiativeMerchantsTransactions.modal.suspend',
      ],
      clickOrder: ['reject', 'suspend'] as const,
    },
    {
      title: 'APPROVED in column mode',
      status: RewardBatchTrxStatusEnum.APPROVED,
      direction: 'column' as const,
      buttons: [
        'pages.initiativeMerchantsTransactions.modal.suspend',
        'pages.initiativeMerchantsTransactions.modal.reject',
      ],
      clickOrder: ['suspend', 'reject'] as const,
    },
  ])('$title', ({ status, direction, buttons, clickOrder }) => {
    const clickedActions = clickOrder as ReadonlyArray<RefundAction>;

    render(
      <RefundActionButtons
        direction={direction}
        status={status}
        onApprove={onApprove}
        onSuspend={onSuspend}
        onReject={onReject}
      />
    );

    buttons.forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });

    clickOrder.forEach((action) => {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(action, 'i') }));
    });

    if (clickedActions.includes('approve')) {
      expect(onApprove).toHaveBeenCalled();
    }
    if (clickedActions.includes('suspend')) {
      expect(onSuspend).toHaveBeenCalled();
    }
    if (clickedActions.includes('reject')) {
      expect(onReject).toHaveBeenCalled();
    }
  });

  test('renders the naked button with size in column mode', () => {
    render(
      <RefundActionButtons
        direction="column"
        status={RewardBatchTrxStatusEnum.TO_CHECK}
        onApprove={onApprove}
        onSuspend={onSuspend}
        onReject={onReject}
        size={2}
      />
    );

    expect(screen.getByTestId('button-naked')).toHaveTextContent('pages.initiativeMerchantsTransactions.modal.reject (2)');
    fireEvent.click(screen.getByTestId('button-naked'));
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  test('renders the naked button without size in column mode', () => {
    render(
      <RefundActionButtons
        direction="column"
        status={RewardBatchTrxStatusEnum.CONSULTABLE}
        onApprove={onApprove}
        onSuspend={onSuspend}
        onReject={onReject}
      />
    );

    expect(screen.getByTestId('button-naked')).toHaveTextContent('pages.initiativeMerchantsTransactions.modal.reject');
    expect(screen.getByTestId('button-naked')).not.toHaveTextContent('(2)');
  });

  test('renders no actions for an unknown status', () => {
    render(
      <RefundActionButtons
        direction="row"
        status={'UNKNOWN' as RewardBatchTrxStatusEnum}
        onApprove={onApprove}
        onSuspend={onSuspend}
        onReject={onReject}
      />
    );

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
