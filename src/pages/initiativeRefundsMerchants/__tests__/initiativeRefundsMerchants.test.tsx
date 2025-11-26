/* eslint-disable functional/immutable-data */
import { cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InitiativeRefundsMerchants from '../InitiativeRefundsMerchants';
import { renderWithContext } from '../../../utils/test-utils';
import { BASE_ROUTE } from '../../../routes';

jest.mock('../../../hooks/useInitiative', () => ({
    useInitiative: () => jest.fn(),
}));

jest.mock('../../components/BreadcrumbsBox', () => () => (
    <div data-testid="breadcrumbs-test">Breadcrumbs</div>
));

jest.mock('@pagopa/selfcare-common-frontend', () => ({
    TitleBox: () => <div data-testid="titlebox-test">TitleBox</div>,
}));

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const oldWindowLocation = global.window.location;

const mockedLocation = {
    assign: jest.fn(),
    pathname: `${BASE_ROUTE}/rimborsi-iniziativa/INIT123`,
    origin: 'MOCKED_ORIGIN',
    search: '',
    hash: '',
};

beforeAll(() => {
    Object.defineProperty(window, 'location', { value: mockedLocation });
});

afterAll(() => {
    Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

afterEach(() => cleanup);

describe('InitiativeRefundsMerchants component tests', () => {
    test('renders structure: breadcrumbs, titlebox, table', () => {
        renderWithContext(<InitiativeRefundsMerchants />);

        expect(screen.getByTestId('breadcrumbs-test')).toBeInTheDocument();
        expect(screen.getByTestId('titlebox-test')).toBeInTheDocument();

        expect(
            screen.getByText('pages.initiativeMerchantsRefunds.table.name')
        ).toBeInTheDocument();

        expect(
            screen.getByText('pages.initiativeMerchantsRefunds.table.period')
        ).toBeInTheDocument();
    });

    test('renders filter controls (select + buttons)', () => {
        renderWithContext(<InitiativeRefundsMerchants />);

        expect(
            screen.getByLabelText('pages.initiativeMerchantsRefunds.table.assignee')
        ).toBeInTheDocument();

        expect(
            screen.getByText('pages.initiativeMerchantDetail.filterBtn')
        ).toBeInTheDocument();

        expect(
            screen.getByText('pages.initiativeMerchant.form.removeFiltersBtn')
        ).toBeInTheDocument();
    });

    test('allows selecting a draft assignee and applying a filter', async () => {
        renderWithContext(<InitiativeRefundsMerchants />);
        const user = userEvent.setup();

        const select = screen.getByLabelText(
            'pages.initiativeMerchantsRefunds.table.assignee'
        );
        await user.click(select);

        const L2option = screen
            .getAllByText('pages.initiativeMerchantsRefunds.L2')
            .find((el) => el.getAttribute('role') === 'option');

        await user.click(L2option!);

        expect(select).toHaveTextContent('pages.initiativeMerchantsRefunds.L2');

        fireEvent.click(
            screen.getByText('pages.initiativeMerchantDetail.filterBtn')
        );
    });

    test('renders mocked rows in table', () => {
        renderWithContext(<InitiativeRefundsMerchants />);

        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(1);

        expect(
            screen.getAllByText('Esercente di test IdPay').length
        ).toBeGreaterThan(0);

        expect(
            screen.getAllByText('novembre 2025').length
        ).toBeGreaterThan(0);
    });

    test('renders percentage with 1 decimal place', () => {
        renderWithContext(<InitiativeRefundsMerchants />);

        expect(screen.getByText('30.0% / 100%')).toBeInTheDocument();
        expect(screen.getByText('14.9% / 100%')).toBeInTheDocument();
    });

    test('renders chevron action button and allows click', () => {
        renderWithContext(<InitiativeRefundsMerchants />);

        const chevrons = screen.getAllByRole('button');
        expect(chevrons.length).toBeGreaterThan(0);

        fireEvent.click(chevrons[0]);
    });

    test('pagination summary is visible', () => {
        renderWithContext(<InitiativeRefundsMerchants />);

        expect(screen.getByText('1–4 di 4')).toBeInTheDocument();
    });

    test('left and right pagination arrows render', () => {
        renderWithContext(<InitiativeRefundsMerchants />);

        expect(screen.getAllByTestId('ChevronLeftIcon').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('ChevronRightIcon').length).toBeGreaterThan(0);
    });
});