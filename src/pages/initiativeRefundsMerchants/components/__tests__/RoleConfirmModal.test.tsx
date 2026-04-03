import { fireEvent, render, screen } from '@testing-library/react';
import { RoleConfirmModal } from '../RoleConfirmModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('<RoleConfirmModal />', () => {
  test('renders translated labels for L1 and triggers callbacks', () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    render(
      <RoleConfirmModal open={true} role="L1" onClose={onClose} onConfirm={onConfirm} />
    );

    expect(
      screen.getByText('pages.initiativeMerchantsTransactions.batchModal.L1.title')
    ).toBeInTheDocument();
    expect(
      screen.getByText('pages.initiativeMerchantsTransactions.batchModal.L1.description')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('pages.initiativeMerchantsTransactions.modal.cancel'));
    expect(onClose).toHaveBeenCalled();

    fireEvent.click(screen.getByText('pages.initiativeMerchantsTransactions.batchModal.confirm'));
    expect(onConfirm).toHaveBeenCalled();
  });

  test('renders role-specific title/description for L3', () => {
    render(
      <RoleConfirmModal
        open={true}
        role="L3"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(
      screen.getByText('pages.initiativeMerchantsTransactions.batchModal.L3.title')
    ).toBeInTheDocument();
    expect(
      screen.getByText('pages.initiativeMerchantsTransactions.batchModal.L3.description')
    ).toBeInTheDocument();
  });

  test('keeps the dialog content hidden when closed', () => {
    render(
      <RoleConfirmModal
        open={false}
        role="L2"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    const title = screen.queryByText('pages.initiativeMerchantsTransactions.batchModal.L2.title');
    if (title) {
      expect(title).not.toBeVisible();
    } else {
      expect(title).toBeNull();
    }
  });
});