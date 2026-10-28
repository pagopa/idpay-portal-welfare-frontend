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
    expect(
      screen.queryByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.disposalRaeeError/i })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.cancel/i }));
    expect(onClose).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.suspend/i }));
    expect(screen.getAllByText('validation.required')).toHaveLength(2);
    expect(screen.getByText('validation.selectAtLeastOne')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.cfError/i }));
    expect(screen.queryByText('validation.selectAtLeastOne')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.suspend/i }));
    expect(screen.getAllByText('validation.required')).toHaveLength(2);
    expect(screen.queryByText('validation.selectAtLeastOne')).not.toBeInTheDocument();

    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'reason text' } });
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'reason text' } });
    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.suspend/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      {internalNote: 'reason text', officialNote: 'reason text'},
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

    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'updated reason' } });
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'updated reason' } });
    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.update/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      {internalNote: 'updated reason', officialNote: 'updated reason'},
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

    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'edit reason' } });
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'edit reason' } });
    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.update/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      {internalNote: 'edit reason', officialNote: 'edit reason'},
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
    expect(
      screen.queryByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.disposalRaeeError/i })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.genericError/i }));
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'reject reason' } });
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'reject reason' } });
    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.reject \(2\)/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      {internalNote: 'reject reason', officialNote: 'reject reason'},
      expect.objectContaining({ genericError: true })
    );
  });

  test('shows and submits the RAEE error for the appliance initiative', () => {
    const onConfirm = jest.fn();

    render(
      <RefundReasonModal
        open={true}
        onClose={jest.fn()}
        type="suspend"
        count={1}
        isApplianceInitiative={true}
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.disposalRaeeError/i }));
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'RAEE reason' } });
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'RAEE reason' } });
    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.suspend/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      {internalNote: 'RAEE reason', officialNote: 'RAEE reason'},
      expect.objectContaining({ disposalRaeeError: true })
    );
  });

  test('ignores a previously selected RAEE error for other initiatives', () => {
    const onConfirm = jest.fn();

    render(
      <RefundReasonModal
        open={true}
        onClose={jest.fn()}
        type="reject"
        count={1}
        editMode={true}
        activeErrors={{
          cfError: false,
          productEligibilityError: false,
          disposalRaeeError: true,
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
      screen.queryByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.disposalRaeeError/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.update/i })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.genericError/i }));
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'other initiative reason' } });
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'other initiative reason' } });
    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.update/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      {internalNote: 'other initiative reason', officialNote: 'other initiative reason'},
      expect.objectContaining({
        genericError: true,
        disposalRaeeError: false,
      })
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
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'fallback reason' } });
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'fallback reason' } });
    fireEvent.click(screen.getByRole('button', { name: /pages.initiativeMerchantsTransactions.modal.update/i }));

    expect(onConfirm).toHaveBeenCalledWith(
      {internalNote: 'fallback reason', officialNote: 'fallback reason'},
      expect.objectContaining({ cfError: true })
    );
  });

  test('resets operator reason and checkboxes when the modal is reopened', () => {
    const onConfirm = jest.fn();
    const { rerender } = render(
      <RefundReasonModal
        open={true}
        onClose={jest.fn()}
        type="reject"
        count={2}
        editMode={true}
        activeErrors={{
          cfError: true,
          productEligibilityError: false,
          priceError: false,
          bonusError: false,
          sellerReferenceError: false,
          accountingDocumentError: false,
          genericError: false,
        }}
        onConfirm={onConfirm}
      />
    );

    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'previous reason' } });
    fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'previous reason' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.cfError/i }));

    rerender(
      <RefundReasonModal
        open={false}
        onClose={jest.fn()}
        type="reject"
        count={2}
        editMode={true}
        activeErrors={{
          cfError: true,
          productEligibilityError: false,
          priceError: false,
          bonusError: false,
          sellerReferenceError: false,
          accountingDocumentError: false,
          genericError: false,
        }}
        onConfirm={onConfirm}
      />
    );

    rerender(
      <RefundReasonModal
        open={true}
        onClose={jest.fn()}
        type="reject"
        count={2}
        editMode={true}
        activeErrors={{
          cfError: false,
          productEligibilityError: false,
          priceError: false,
          bonusError: false,
          sellerReferenceError: false,
          accountingDocumentError: false,
          genericError: true,
        }}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getAllByRole('textbox')[0]).toHaveValue('');
    expect(screen.getAllByRole('textbox')[1]).toHaveValue('');
    expect(screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.cfError/i })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /pages.initiativeMerchantsTransactions.checksError.genericError/i })).toBeChecked();
  });
});