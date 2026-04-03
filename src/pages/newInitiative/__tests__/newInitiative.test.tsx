import NewInitiative from '../newInitiative';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockUseInitiative = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
  withTranslation: () => jest.fn(),
}));

jest.mock('@pagopa/mui-italia', () => ({
  ButtonNaked: ({ children, onClick, ...props }: any) => (
    <button type="button" onClick={onClick} data-testid={props['data-testid']}>
      {children}
    </button>
  ),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib', () => ({
  TitleBox: () => <div data-testid="title-box-mock" />,
}));

jest.mock('../../../components/ExitModal/ExitModal', () => ({
  __esModule: true,
  default: ({ openExitModal, handleCloseExitModal }: any) => (
    <div data-testid="exit-modal-state">
      <span>{openExitModal ? 'open' : 'closed'}</span>
      {openExitModal ? (
        <button type="button" data-testid="exit-modal-close" onClick={handleCloseExitModal}>
          close
        </button>
      ) : null}
    </div>
  ),
}));

jest.mock('../../../components/Wizard/Wizard', () => ({
  __esModule: true,
  default: ({ handleOpenExitModal }: any) => (
    <button type="button" data-testid="wizard-mock" onClick={handleOpenExitModal}>
      wizard
    </button>
  ),
}));

jest.mock('../../../hooks/useInitiative', () => ({
  useInitiative: (...args: Array<any>) => mockUseInitiative(...args),
}));

describe('<NewInitiative />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  it('toggles the exit modal when the breadcrumb button and modal controls are used', async () => {
    render(<NewInitiative />);

    expect(screen.getByTestId('title-box-mock')).toBeInTheDocument();
    expect(screen.getByTestId('wizard-mock')).toBeInTheDocument();
    expect(screen.getByTestId('exit-modal-state')).toHaveTextContent('closed');

    fireEvent.click(screen.getByTestId('exit-button-test'));

    await waitFor(() => {
      expect(screen.getByTestId('exit-modal-state')).toHaveTextContent('open');
    });

    fireEvent.click(screen.getByTestId('exit-modal-close'));

    await waitFor(() => {
      expect(screen.getByTestId('exit-modal-state')).toHaveTextContent('closed');
    });
  });
});
