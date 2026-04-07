import { render, screen } from '@testing-library/react';
import RefundTransactionsBreadcrumbs from '../RefundTransactionsBreadcrumbs';
import ROUTES from '../../../../routes';

jest.mock('../../../components/BreadcrumbsBox', () => (props: any) => (
  <div
    data-testid="breadcrumbs-box"
    data-back-url={props.backUrl}
    data-back-label={props.backLabel}
    data-items={props.items.join('|')}
  />
));

const t = (key: string) => key;

describe('<RefundTransactionsBreadcrumbs />', () => {
  test('passes the expected back url and breadcrumb items', () => {
    render(
      <RefundTransactionsBreadcrumbs
        t={t}
        initiativeName="Initiative name"
        initiativeId="initiative-123"
        businessName="Merchant name"
      />
    );

    expect(screen.getByTestId('breadcrumbs-box')).toHaveAttribute(
      'data-back-url',
      ROUTES.INITIATIVE_REFUNDS.replace(':id', 'initiative-123')
    );
    expect(screen.getByTestId('breadcrumbs-box')).toHaveAttribute('data-back-label', 'breadcrumbs.back');
    expect(screen.getByTestId('breadcrumbs-box')).toHaveAttribute(
      'data-items',
      'Initiative name|breadcrumbs.initiativeRefunds|Merchant name'
    );
  });
});