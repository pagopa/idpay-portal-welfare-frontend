import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  ChannelDtoTypeEnum as TypeEnum,
  InitiativeAdditionalDtoServiceScopeEnum as ServiceScopeEnum,
} from '../../../../../api/generated/initiative/apiClient';
import { AdditionalInfo } from '../../../../../model/Initiative';
import {
  setAdditionalInfo,
  setInitiativeId,
} from '../../../../../redux/slices/initiativeSlice';
import { store } from '../../../../../redux/store';
import { WIZARD_ACTIONS } from '../../../../../utils/constants';
import { renderWithProviders } from '../../../../../utils/test-utils';
import Wizard from '../../../Wizard';
import ServiceConfig from '../ServiceConfig';
import * as initiativeService from '../../../../../services/intitativeService';

window.scrollTo = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('../../../../../services/intitativeService', () => ({
  createInitiativeServiceInfo: jest.fn(),
  updateInitiativeServiceInfo: jest.fn(),
  uploadAndUpdateLogo: jest.fn(),
}));

jest.mock('../InitiativeNotOnIOModal', () => {
  return function MockInitiativeNotOnIOModal(props: any) {
    if (!props.openInitiativeNotOnIOModal) {
      return null;
    }

    return (
      <div data-testid="initiative-not-on-io-modal">
        <button
          data-testid="confirm-initiative-not-on-io"
          onClick={() =>
            props.sendValues(props.values, props.currentStep, props.setCurrentStep)
          }
        >
          confirm
        </button>
        <button
          data-testid="close-initiative-not-on-io"
          onClick={props.handleCloseInitiativeNotOnIOModal}
        >
          close
        </button>
      </div>
    );
  };
});

jest.mock('../UploadServiceIcon', () => {
  return function MockUploadServiceIcon(props: any) {
    return (
      <div data-testid="upload-service-icon">
        <button
          data-testid="mock-upload-file"
          onClick={() => {
            props.setUploadFile(new File(['logo'], 'logo.png', { type: 'image/png' }));
            props.setFileName('logo.png');
            props.setUploadDate('01/01/2026, 10:00:00');
            props.setFileUploadedOk(true);
          }}
        >
          upload
        </button>
        <span>{props.fileName}</span>
        <span>{props.fileUploadDate}</span>
        <span>{String(props.fileUplodedOk)}</span>
        <span>{String(props.fileUplodedKo)}</span>
      </div>
    );
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => { });
  jest.spyOn(console, 'warn').mockImplementation(() => { });
});

afterEach(cleanup);

describe('<ServiceConfig />', () => {
  const handleOpenExitModal = jest.fn();
  const setAction = jest.fn();
  const setCurrentStep = jest.fn();
  const setDisabledNext = jest.fn();
  const currentStep = 0;

  const mockedAdditionalInfo: AdditionalInfo = {
    initiativeOnIO: true,
    serviceName: 'prova313',
    serviceId: 'prova123',
    serviceArea: ServiceScopeEnum.NATIONAL,
    serviceDescription: 'newStepOneTest',
    privacyPolicyUrl: 'https://test.it/privacy',
    termsAndConditions: 'https://test.it/terms',
    assistanceChannels: [
      { type: TypeEnum.Web, contact: 'https://test.it' },
      { type: TypeEnum.Email, contact: 'test@test.it' },
      { type: TypeEnum.Mobile, contact: '123-1234567' },
      { type: '', contact: '' },
    ],
    logoFileName: 'logo file name',
    logoUploadDate: 'logo date',
    logoURL: 'logo url',
  };

  test('test submit wizard', () => {
    renderWithProviders(<Wizard handleOpenExitModal={handleOpenExitModal} />);
    const submit = screen.getByTestId('continue-action-test') as HTMLButtonElement;
    fireEvent.click(submit);
  });

  test('Test Input Form onChange', async () => {
    store.dispatch(setAdditionalInfo(mockedAdditionalInfo));

    renderWithProviders(
      <ServiceConfig
        action=""
        setAction={setAction}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setDisabledNext={setDisabledNext}
      />
    );

    const serviceName = screen.getByTestId('service-name-test') as HTMLInputElement;
    const serviceDescription = screen.getByTestId('service-description-test') as HTMLInputElement;
    const privacyPolicyUrl = screen.getByTestId('privacy-policy-url-test') as HTMLInputElement;
    const termsAndConditions = screen.getByTestId('terms-and-conditions-test') as HTMLInputElement;
    const indicatedChannel = screen.getAllByTestId('indicated-channel-test') as HTMLInputElement[];

    fireEvent.change(serviceName, { target: { value: 'name' } });
    expect(serviceName.value).toBe('name');

    fireEvent.change(serviceDescription, { target: { value: 'description' } });
    expect(serviceDescription.value).toBe('description');

    fireEvent.change(privacyPolicyUrl, { target: { value: 'https://privacy.test.it' } });
    expect(privacyPolicyUrl.value).toBe('https://privacy.test.it');

    fireEvent.change(termsAndConditions, { target: { value: 'https://terms.test.it' } });
    expect(termsAndConditions.value).toBe('https://terms.test.it');

    fireEvent.change(indicatedChannel[0], { target: { value: 'https://changed.test.it' } });
    expect(indicatedChannel[0].value).toBe('https://changed.test.it');

    const initiativeOnIo = screen.getByRole('checkbox') as HTMLInputElement;
    fireEvent.click(initiativeOnIo);
    expect(initiativeOnIo).toBeInTheDocument();

    const assistanceSelect = screen.getAllByTestId('assistance-channel-test');
    expect(assistanceSelect[0]).toBeInTheDocument();

    const initialChannels = screen.getAllByTestId('indicated-channel-test').length;

    const assistanceChannel = screen.getByTestId('add-channel-test');
    fireEvent.click(assistanceChannel);

    await waitFor(() => {
      expect(screen.getAllByTestId('indicated-channel-test').length).toBe(initialChannels + 1);
    });

    const remove = await screen.findAllByTestId('remove-assistance-channel');
    fireEvent.click(remove[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('indicated-channel-test').length).toBe(initialChannels);
    });

    const addChannel = screen.getByTestId('add-channel-test') as HTMLButtonElement;
    fireEvent.click(addChannel);

    await waitFor(() => {
      expect(screen.getAllByTestId('indicated-channel-test').length).toBe(initialChannels + 1);
    });

    expect(setDisabledNext).toHaveBeenCalled();
  });

  test('should initialize uploaded logo data from redux additionalInfo', async () => {
    store.dispatch(
      setAdditionalInfo({
        ...mockedAdditionalInfo,
        logoFileName: 'stored-logo.png',
        logoUploadDate: '05/01/2026, 10:00:00',
      })
    );

    renderWithProviders(
      <ServiceConfig
        action=""
        setAction={setAction}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setDisabledNext={setDisabledNext}
      />
    );

    expect(await screen.findByTestId('upload-service-icon')).toBeInTheDocument();
    expect(screen.getByText('stored-logo.png')).toBeInTheDocument();
    expect(screen.getByText('05/01/2026, 10:00:00')).toBeInTheDocument();
  });

  test('should add and remove assistance channels', async () => {
    store.dispatch(
      setAdditionalInfo({
        ...mockedAdditionalInfo,
        assistanceChannels: [{ type: TypeEnum.Web, contact: 'https://test.it' }],
      })
    );

    renderWithProviders(
      <ServiceConfig
        action=""
        setAction={setAction}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setDisabledNext={setDisabledNext}
      />
    );

    expect(screen.getAllByTestId('assistance-channel-test')).toHaveLength(1);

    fireEvent.click(screen.getByTestId('add-channel-test'));

    await waitFor(() => {
      expect(screen.getAllByTestId('assistance-channel-test')).toHaveLength(2);
    });

    fireEvent.click(screen.getByTestId('remove-assistance-channel'));

    await waitFor(() => {
      expect(screen.getAllByTestId('assistance-channel-test')).toHaveLength(1);
    });
  });

  test('should submit create flow and upload logo when no initiativeId exists', async () => {
    (initiativeService.createInitiativeServiceInfo as jest.Mock).mockResolvedValue({
      initiativeId: 'initiative-created-id',
    });
    (initiativeService.uploadAndUpdateLogo as jest.Mock).mockResolvedValue({
      logoFileName: 'uploaded-logo.png',
      logoUploadDate: '2026-01-10T10:00:00.000Z',
      logoURL: 'https://cdn.test.it/logo.png',
    });

    store.dispatch(setInitiativeId(undefined as any));
    store.dispatch(
      setAdditionalInfo({
        initiativeOnIO: true,
        serviceName: '',
        serviceId: '',
        serviceArea: '',
        serviceDescription: '',
        privacyPolicyUrl: '',
        termsAndConditions: '',
        assistanceChannels: [{ type: '', contact: '' }],
        logoFileName: '',
        logoUploadDate: '',
        logoURL: '',
      } as any)
    );

    const { rerender } = render(
      <Provider store={store}>
        <ServiceConfig
          action=""
          setAction={setAction}
          currentStep={1}
          setCurrentStep={setCurrentStep}
          setDisabledNext={setDisabledNext}
        />
      </Provider>
    );

    fireEvent.change(screen.getByTestId('service-name-test'), {
      target: { value: 'My service' },
    });
    fireEvent.change(screen.getByTestId('service-area-select'), {
      target: { value: ServiceScopeEnum.LOCAL },
    });
    fireEvent.change(screen.getByTestId('service-description-test'), {
      target: { value: 'My description' },
    });
    fireEvent.change(screen.getByTestId('privacy-policy-url-test'), {
      target: { value: 'https://test.it/privacy' },
    });
    fireEvent.change(screen.getByTestId('terms-and-conditions-test'), {
      target: { value: 'https://test.it/terms' },
    });

    fireEvent.change(screen.getAllByTestId('assistance-channel-test')[0], {
      target: { value: 'web' },
    });
    fireEvent.change(screen.getAllByTestId('indicated-channel-test')[0], {
      target: { value: 'https://help.test.it' },
    });

    fireEvent.click(screen.getByTestId('mock-upload-file'));

    rerender(
      <Provider store={store}>
        <ServiceConfig
          action={WIZARD_ACTIONS.SUBMIT}
          setAction={setAction}
          currentStep={1}
          setCurrentStep={setCurrentStep}
          setDisabledNext={setDisabledNext}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(initiativeService.createInitiativeServiceInfo).toHaveBeenCalled();
      expect(initiativeService.uploadAndUpdateLogo).toHaveBeenCalled();
    });
  });

  test('should submit update flow when initiativeId exists', async () => {
    (initiativeService.updateInitiativeServiceInfo as jest.Mock).mockResolvedValue({});
    (initiativeService.uploadAndUpdateLogo as jest.Mock).mockResolvedValue({
      logoFileName: 'uploaded-logo.png',
      logoUploadDate: '2026-01-10T10:00:00.000Z',
      logoURL: 'https://cdn.test.it/logo.png',
    });

    store.dispatch(setInitiativeId('initiative-existing-id'));
    store.dispatch(
      setAdditionalInfo({
        initiativeOnIO: true,
        serviceName: 'Existing service',
        serviceId: 'srv-id',
        serviceArea: ServiceScopeEnum.NATIONAL,
        serviceDescription: 'Existing description',
        privacyPolicyUrl: 'https://test.it/privacy',
        termsAndConditions: 'https://test.it/terms',
        assistanceChannels: [{ type: TypeEnum.Web, contact: 'https://help.test.it' }],
        logoFileName: '',
        logoUploadDate: '',
        logoURL: '',
      } as any)
    );

    renderWithProviders(
      <ServiceConfig
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={setAction}
        currentStep={2}
        setCurrentStep={setCurrentStep}
        setDisabledNext={setDisabledNext}
      />
    );

    await waitFor(() => {
      expect(initiativeService.updateInitiativeServiceInfo).toHaveBeenCalled();
    });
  });

  test('should open initiative not on IO modal and confirm sendValues', async () => {
    (initiativeService.createInitiativeServiceInfo as jest.Mock).mockResolvedValue({
      initiativeId: 'initiative-created-id',
    });

    store.dispatch(setInitiativeId(undefined as any));
    store.dispatch(
      setAdditionalInfo({
        initiativeOnIO: false,
        serviceName: 'My service',
        serviceId: '',
        serviceArea: ServiceScopeEnum.LOCAL,
        serviceDescription: 'My description',
        privacyPolicyUrl: 'https://test.it/privacy',
        termsAndConditions: 'https://test.it/terms',
        assistanceChannels: [{ type: TypeEnum.Web, contact: 'https://help.test.it' }],
        logoFileName: '',
        logoUploadDate: '',
        logoURL: '',
      } as any)
    );

    const { rerender } = render(
      <Provider store={store}>
        <ServiceConfig
          action=""
          setAction={setAction}
          currentStep={1}
          setCurrentStep={setCurrentStep}
          setDisabledNext={setDisabledNext}
        />
      </Provider>
    );

    rerender(
      <Provider store={store}>
        <ServiceConfig
          action={WIZARD_ACTIONS.SUBMIT}
          setAction={setAction}
          currentStep={1}
          setCurrentStep={setCurrentStep}
          setDisabledNext={setDisabledNext}
        />
      </Provider>
    );

    expect(await screen.findByTestId('initiative-not-on-io-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('confirm-initiative-not-on-io'));

    await waitFor(() => {
      expect(initiativeService.createInitiativeServiceInfo).toHaveBeenCalled();
    });
  });

  test('should handle create service info error', async () => {
    (initiativeService.createInitiativeServiceInfo as jest.Mock).mockRejectedValue(
      new Error('create error')
    );

    store.dispatch(setInitiativeId(undefined as any));
    store.dispatch(
      setAdditionalInfo({
        initiativeOnIO: true,
        serviceName: 'My service',
        serviceId: '',
        serviceArea: ServiceScopeEnum.LOCAL,
        serviceDescription: 'My description',
        privacyPolicyUrl: 'https://test.it/privacy',
        termsAndConditions: 'https://test.it/terms',
        assistanceChannels: [{ type: TypeEnum.Web, contact: 'https://help.test.it' }],
        logoFileName: '',
        logoUploadDate: '',
        logoURL: '',
      } as any)
    );

    renderWithProviders(
      <ServiceConfig
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={setAction}
        currentStep={1}
        setCurrentStep={setCurrentStep}
        setDisabledNext={setDisabledNext}
      />
    );

    await waitFor(() => {
      expect(initiativeService.createInitiativeServiceInfo).toHaveBeenCalled();
    });
  });

  test('should handle update service info error', async () => {
    (initiativeService.updateInitiativeServiceInfo as jest.Mock).mockRejectedValue(
      new Error('update error')
    );

    store.dispatch(setInitiativeId('initiative-existing-id'));
    store.dispatch(
      setAdditionalInfo({
        initiativeOnIO: true,
        serviceName: 'Existing service',
        serviceId: 'srv-id',
        serviceArea: ServiceScopeEnum.NATIONAL,
        serviceDescription: 'Existing description',
        privacyPolicyUrl: 'https://test.it/privacy',
        termsAndConditions: 'https://test.it/terms',
        assistanceChannels: [{ type: TypeEnum.Web, contact: 'https://help.test.it' }],
        logoFileName: '',
        logoUploadDate: '',
        logoURL: '',
      } as any)
    );

    renderWithProviders(
      <ServiceConfig
        action={WIZARD_ACTIONS.SUBMIT}
        setAction={setAction}
        currentStep={2}
        setCurrentStep={setCurrentStep}
        setDisabledNext={setDisabledNext}
      />
    );

    await waitFor(() => {
      expect(initiativeService.updateInitiativeServiceInfo).toHaveBeenCalled();
    });
  });

  test('should handle upload logo error', async () => {
    (initiativeService.updateInitiativeServiceInfo as jest.Mock).mockResolvedValue({});
    (initiativeService.uploadAndUpdateLogo as jest.Mock).mockRejectedValue(
      new Error('upload error')
    );

    store.dispatch(setInitiativeId('initiative-existing-id'));
    store.dispatch(
      setAdditionalInfo({
        initiativeOnIO: true,
        serviceName: 'Existing service',
        serviceId: 'srv-id',
        serviceArea: ServiceScopeEnum.NATIONAL,
        serviceDescription: 'Existing description',
        privacyPolicyUrl: 'https://test.it/privacy',
        termsAndConditions: 'https://test.it/terms',
        assistanceChannels: [{ type: TypeEnum.Web, contact: 'https://help.test.it' }],
        logoFileName: '',
        logoUploadDate: '',
        logoURL: '',
      } as any)
    );

    const { rerender } = render(
      <Provider store={store}>
        <ServiceConfig
          action=""
          setAction={setAction}
          currentStep={2}
          setCurrentStep={setCurrentStep}
          setDisabledNext={setDisabledNext}
        />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('mock-upload-file'));

    rerender(
      <Provider store={store}>
        <ServiceConfig
          action={WIZARD_ACTIONS.SUBMIT}
          setAction={setAction}
          currentStep={2}
          setCurrentStep={setCurrentStep}
          setDisabledNext={setDisabledNext}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(initiativeService.updateInitiativeServiceInfo).toHaveBeenCalled();
      expect(initiativeService.uploadAndUpdateLogo).toHaveBeenCalled();
    });
  });
});