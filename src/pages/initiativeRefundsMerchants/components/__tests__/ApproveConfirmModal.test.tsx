import { fireEvent, render, screen } from '@testing-library/react';
import ApproveConfirmModal from '../ApproveConfirmModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('ApproveConfirmModal', () => {
  test('renders single item content and handles close and confirm actions', () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    render(<ApproveConfirmModal open={true} onClose={onClose} onConfirm={onConfirm} count={1} />);

    expect(screen.getByText('pages.initiativeMerchantsTransactions.modal.single.approveTitle')).toBeInTheDocument();
    expect(screen.getByText('pages.initiativeMerchantsTransactions.modal.single.approveDescription')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'pages.initiativeMerchantsTransactions.modal.cancel' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'pages.initiativeMerchantsTransactions.modal.approve (1)' })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'pages.initiativeMerchantsTransactions.modal.cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'pages.initiativeMerchantsTransactions.modal.approve (1)' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('renders plural item content when count is greater than one', () => {
    render(<ApproveConfirmModal open={true} onClose={jest.fn()} onConfirm={jest.fn()} count={3} />);

    expect(screen.getByText('pages.initiativeMerchantsTransactions.modal.plural.approveTitle')).toBeInTheDocument();
    expect(screen.getByText('pages.initiativeMerchantsTransactions.modal.plural.approveDescription')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'pages.initiativeMerchantsTransactions.modal.approve (3)' })
    ).toBeInTheDocument();
  });
});