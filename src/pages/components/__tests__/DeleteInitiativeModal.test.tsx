/* eslint-disable react/jsx-no-bind */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import DeleteInitiativeModal from '../DeleteInitiativeModal';
import ROUTES from '../../../routes';

const mockReplace = jest.fn();
const mockAddError = jest.fn();
const mockSetLoading = jest.fn();
const mockLogicallyDeleteInitiative = jest.fn();
const mockUsePermissions = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher', () => ({
  __esModule: true,
  default: () => mockAddError,
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/hooks/useLoading', () => ({
  __esModule: true,
  default: () => mockSetLoading,
}));

jest.mock('../../../hooks/usePermissions', () => ({
  usePermissions: (...args: Array<any>) => mockUsePermissions(...args),
}));

jest.mock('../../../services/intitativeService', () => ({
  logicallyDeleteInitiative: (...args: Array<any>) => mockLogicallyDeleteInitiative(...args),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('<DeleteInitiativeModal />', () => {
  const handleCloseInitiativeDeleteModal = jest.fn();

  const renderComponent = (initiativeStatus: string | undefined, initiativeId: string | undefined) =>
    render(
      <DeleteInitiativeModal
        initiativeId={initiativeId}
        initiativeStatus={initiativeStatus}
        openInitiativeDeleteModal={true}
        handleCloseInitiativeDeleteModal={handleCloseInitiativeDeleteModal}
      />
    );

  it('renders the modal and closes from the cancel button', async () => {
    mockUsePermissions.mockReturnValue(true);

    renderComponent('DRAFT', 'initiative-id');

    expect(screen.getByTestId('delete-modal-test')).toBeInTheDocument();
    expect(screen.getByTestId('fade-test')).toBeInTheDocument();

    fireEvent.click(await screen.findByTestId('cancel-button-test'));

    expect(handleCloseInitiativeDeleteModal).toHaveBeenCalledTimes(1);
  });

  it('deletes the initiative when the user can delete it and the status is eligible', async () => {
    mockUsePermissions.mockReturnValue(true);
    mockLogicallyDeleteInitiative.mockResolvedValueOnce(undefined);

    renderComponent('DRAFT', 'initiative-id');

    fireEvent.click(await screen.findByTestId('delete-button-test'));

    await waitFor(() => {
      expect(mockLogicallyDeleteInitiative).toHaveBeenCalledWith('initiative-id');
    });
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(ROUTES.INITIATIVE_LIST);
    });

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, false);
    expect(handleCloseInitiativeDeleteModal).toHaveBeenCalledTimes(1);
  });

  it('reports an error when delete fails', async () => {
    mockUsePermissions.mockReturnValue(true);
    const error = new Error('delete failed');
    mockLogicallyDeleteInitiative.mockRejectedValueOnce(error);

    renderComponent('DRAFT', 'initiative-id');

    fireEvent.click(await screen.findByTestId('delete-button-test'));

    await waitFor(() => {
      expect(mockAddError).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'DELETE_INITIATIVE_ERROR',
          blocking: false,
          error,
          techDescription: 'An error occurred deleting initiative',
          displayableTitle: 'errors.title',
          displayableDescription: 'errors.cantDeleteInitiative',
          toNotify: true,
          component: 'Toast',
          showCloseIcon: true,
        })
      );
    });

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, false);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it.each(['PUBLISHED', 'IN_REVISION', 'CLOSED'])(
    'does not delete initiatives with status %s',
    async (initiativeStatus) => {
      mockUsePermissions.mockReturnValue(true);

      renderComponent(initiativeStatus, 'initiative-id');

      fireEvent.click(await screen.findByTestId('delete-button-test'));

      expect(mockLogicallyDeleteInitiative).not.toHaveBeenCalled();
      expect(mockSetLoading).not.toHaveBeenCalled();
      expect(mockReplace).not.toHaveBeenCalled();
    }
  );

  it('does not delete initiatives when the user lacks permission', async () => {
    mockUsePermissions.mockReturnValue(false);

    renderComponent('DRAFT', 'initiative-id');

    fireEvent.click(await screen.findByTestId('delete-button-test'));

    expect(mockLogicallyDeleteInitiative).not.toHaveBeenCalled();
    expect(mockSetLoading).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
