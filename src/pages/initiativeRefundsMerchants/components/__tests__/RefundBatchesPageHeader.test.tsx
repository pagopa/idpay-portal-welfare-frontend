import { render, screen } from '@testing-library/react';
import RefundBatchesPageHeader from '../RefundBatchesPageHeader';
import ROUTES from '../../../../routes';

jest.mock('../../../components/BreadcrumbsBox', () => (props: any) => (
  <div
    data-testid="breadcrumbs-box"
    data-back-url={props.backUrl}
    data-back-label={props.backLabel}
    data-items={props.items.join('|')}
  />
));

jest.mock('@pagopa/selfcare-common-frontend/lib', () => ({
  TitleBox: (props: any) => (
    <div
      data-testid="title-box"
      data-title={props.title}
      data-subtitle={props.subTitle}
      data-variant-title={props.variantTitle}
      data-variant-subtitle={props.variantSubTitle}
    />
  ),
}));

const t = (key: string) => key;

describe('<RefundBatchesPageHeader />', () => {
  test('passes the home back url and renders the page title block', () => {
    render(<RefundBatchesPageHeader t={t} initiativeName="Initiative name" />);

    expect(screen.getByTestId('breadcrumbs-box')).toHaveAttribute('data-back-url', ROUTES.HOME);
    expect(screen.getByTestId('breadcrumbs-box')).toHaveAttribute(
      'data-items',
      'Initiative name|breadcrumbs.initiativeRefunds'
    );

    expect(screen.getByTestId('title-box')).toHaveAttribute(
      'data-title',
      'pages.initiativeRefunds.title'
    );
    expect(screen.getByTestId('title-box')).toHaveAttribute(
      'data-subtitle',
      'pages.initiativeRefunds.subtitle'
    );
  });
});