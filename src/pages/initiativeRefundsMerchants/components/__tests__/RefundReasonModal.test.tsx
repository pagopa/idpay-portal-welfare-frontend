import { render, screen, fireEvent } from '@testing-library/react';
import RefundReasonModal from '../RefundReasonModal';

describe('RefundReasonModal', () => {
  test('keeps the dialog closed when open is false', () => {
    render(
      <RefundReasonModal
        open={false}
        onClose={jest.fn()}
        type="suspend"
        count={1}
        onConfirm={jest.fn()}
      />
    );

    expect(
      screen.queryByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.cancel/i })
    ).not.toBeInTheDocument();
  });

  test('submits suspend flow after selecting a reason and checkbox', () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();

    render(
      <RefundReasonModal
        open={true}
        onClose={onClose}
        type="suspend"
        count={1}
        onConfirm={onConfirm}
      />
    );

    expect(
      screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.cancel/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.suspend/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.cancel/i }));
    expect(onClose).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.suspend/i }));
    expect(screen.getByText('validation.required')).toBeInTheDocument();
    expect(screen.getByText('validation.selectAtLeastOne')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.cfError/i }));
    expect(screen.queryByText('validation.selectAtLeastOne')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.suspend/i }));
    expect(screen.getByText('validation.required')).toBeInTheDocument();
    expect(screen.queryByText('validation.selectAtLeastOne')).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'reason text' } });
    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.suspend/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      'reason text',
      expect.objectContaining({ cfError: true })
    );
  });

  test('shows edit mode alert and updates after selecting a checkbox', () => {
    const onConfirm = jest.fn();

    render(
      <RefundReasonModal
        open={true}
        onClose={jest.fn()}
        type="reject"
        count={2}
        editMode={true}
        activeErrors={{
          cfError: false,
          productEligibilityError: false,
          disposalRaeeError: false,
          priceError: false,
          bonusError: false,
          sellerReferenceError: false,
          accountingDocumentError: false,
          genericError: false,
        }}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('pages.initiativeMerchantsTransactions.modal.alert')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.update/i })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.genericError/i }));
    expect(screen.queryByText('pages.initiativeMerchantsTransactions.modal.alert')).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'updated reason' } });
    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.update/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      'updated reason',
      expect.objectContaining({ genericError: true })
    );
  });

  test('renders reject flow with plural count and preserves selected errors in edit mode', () => {
    const onConfirm = jest.fn();

    render(
      <RefundReasonModal
        open={true}
        onClose={jest.fn()}
        type="reject"
        count={3}
        editMode={true}
        activeErrors={{
          cfError: true,
          productEligibilityError: false,
          disposalRaeeError: false,
          priceError: false,
          bonusError: false,
          sellerReferenceError: false,
          accountingDocumentError: false,
          genericError: false,
        }}
        onConfirm={onConfirm}
      />
    );

    expect(
      screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.update/i })
    ).toBeEnabled();
    expect(screen.queryByText('pages.initiativeMerchantsTransactions.modal.alert')).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.cfError/i })).toBeChecked();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'edit reason' } });
    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.update/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      'edit reason',
      expect.objectContaining({ cfError: true })
    );
  });

  test('renders reject flow without edit mode and submits selected reason', () => {
    const onConfirm = jest.fn();

    render(
      <RefundReasonModal
        open={true}
        onClose={jest.fn()}
        type="reject"
        count={2}
        onConfirm={onConfirm}
      />
    );

    expect(
      screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.reject \(2\)/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.genericError/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'reject reason' } });
    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.reject \(2\)/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      'reject reason',
      expect.objectContaining({ genericError: true })
    );
  });

  test('falls back to default check state when edit mode has no active errors', () => {
    const onConfirm = jest.fn();

    render(
      <RefundReasonModal
        open={true}
        onClose={jest.fn()}
        type="suspend"
        count={1}
        editMode={true}
        onConfirm={onConfirm}
      />
    );

    expect(
      screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.update/i })
    ).toBeDisabled();
    expect(
      screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.cfError/i })
    ).not.toBeChecked();

    fireEvent.click(screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.cfError/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'fallback reason' } });
    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.update/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      'fallback reason',
      expect.objectContaining({ cfError: true })
    );
  });
});