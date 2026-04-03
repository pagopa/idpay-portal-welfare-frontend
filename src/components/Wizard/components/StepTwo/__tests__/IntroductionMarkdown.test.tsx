import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import IntroductionMarkdown from '../IntroductionMarkdown';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));
describe('<IntroductionMarkdown />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  test('should render correctly the IntroductionMarkdown component', async () => {
    render(
      <Provider store={store}>
        <IntroductionMarkdown
          textToRender={[
            { label: 'IT', formikValue: 'formikValue' },
            { label: 'EN', formikValue: 'formikValue' },
            { label: 'FR', formikValue: 'formikValue' },
            { label: 'DE', formikValue: 'formikValue' },
            { label: 'SL', formikValue: 'formikValue' },
          ]}
          serviceName="serviceName"
          selectedParty="selectedParty"
          logoUrl="http//test/logo.png"
        />
      </Provider>
    );
    const showMarkdownBtn = (await screen.findByText(
      /components.wizard.stepTwo.form.preview/i
    )) as HTMLButtonElement;
    fireEvent.click(showMarkdownBtn);
    expect(
      await screen.findByText(/components.wizard.stepTwo.previewModal.title/i)
    ).toBeInTheDocument();
    const modal = screen.getByRole('presentation');

    const englishTab = screen.getByRole('tab', { name: 'EN' });
    fireEvent.click(englishTab);
    expect(englishTab).toHaveAttribute('aria-selected', 'true');

    const closeButton = screen.getByRole('button', {
      name: 'components.wizard.stepTwo.previewModal.closeBtn',
    });
    fireEvent.click(closeButton);
    await waitForElementToBeRemoved(modal);
  });

  test('should render correctly the IntroductionMarkdown component with one text and close on escape', async () => {
    render(
      <Provider store={store}>
        <IntroductionMarkdown
          textToRender={[{ label: 'IT', formikValue: 'single markdown content' }]}
          serviceName={undefined}
          selectedParty={undefined}
          logoUrl={''}
        />
      </Provider>
    );

    fireEvent.click(screen.getByText(/components.wizard.stepTwo.form.preview/i));
    expect(await screen.findByText(/components.wizard.stepTwo.previewModal.title/i)).toBeInTheDocument();
    const modal = screen.getByRole('presentation');
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();

    const closeButton = screen.getByRole('button', {
      name: 'components.wizard.stepTwo.previewModal.closeBtn',
    });
    closeButton.focus();
    fireEvent.keyDown(closeButton, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
      bubbles: true,
    });
    await waitForElementToBeRemoved(modal);
  });
});
