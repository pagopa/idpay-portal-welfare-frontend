import { render, screen, fireEvent } from '@testing-library/react';
import { RoleActionButton } from '../RoleActionButton';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('RoleActionButton', () => {
  test.each([
    ['L1', 'pages.initiativeMerchantsTransactions.batchDetail.validate'],
    ['L2', 'pages.initiativeMerchantsTransactions.batchDetail.check'],
    ['L3', 'pages.initiativeMerchantsTransactions.batchDetail.approve'],
  ])('renders the label for role %s', (role, expectedLabel) => {
    render(<RoleActionButton role={role as 'L1' | 'L2' | 'L3'} onClick={jest.fn()} />);

    expect(screen.getByRole('button')).toHaveTextContent(
      `${expectedLabel} pages.initiativeMerchantsTransactions.batchDetail.batchLowerCase`
    );
  });

  test('renders the fallback label for an unknown role and handles click', () => {
    const onClick = jest.fn();
    render(<RoleActionButton role={'unknown' as any} onClick={onClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('pages.initiativeMerchantsTransactions.batchDetail.batchLowerCase');

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
