import { fireEvent, render, screen } from '@testing-library/react';
import { RoleErrorModal } from '../RoleErrorModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('<RoleErrorModal />', () => {
  test('renders translated content and handles close action', () => {
    const onClose = jest.fn();
    render(<RoleErrorModal open={true} onClose={onClose} />);

    expect(
      screen.getByText('pages.initiativeMerchantsTransactions.batchModal.errorTitle')
    ).toBeInTheDocument();
    expect(
      screen.getByText('pages.initiativeMerchantsTransactions.batchModal.errorDescription')
    ).toBeInTheDocument();

    const closeButton = screen.getByText('pages.initiativeMerchantsTransactions.modal.close');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  test('does not show modal content when closed', () => {
    render(<RoleErrorModal open={false} onClose={jest.fn()} />);

    const maybeTitle = screen.queryByText(
      'pages.initiativeMerchantsTransactions.batchModal.errorTitle'
    );
    if (maybeTitle) {
      expect(maybeTitle).not.toBeVisible();
    } else {
      expect(maybeTitle).toBeNull();
    }
  });
});