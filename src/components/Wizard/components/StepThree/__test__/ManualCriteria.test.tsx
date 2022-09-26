import { fireEvent, render, act, waitFor } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { ManualCriteriaItem } from '../../../../../model/Initiative';
import { createStore } from '../../../../../redux/store';
import { ManualCriteriaOptions, WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import ManualCriteria from '../ManualCriteria';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<DateOfBirthCriteriaItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const data = {
    _type: '',
    description: '',
    code: '',
    boolValue: true,
    multiValue: [{ value: '' }, { value: '' }],
    authorityLabel: '',
    fieldLabel: '',
    value: '',
    value2: '',
    authority: '',
    field: '',
    operator: '',
    checked: false,
  };

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  const store = injectedStore ? injectedStore : createStore();
  test('Should display ManualCriteria and must have a correct validation', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ManualCriteria
            data={data}
            action={''}
            // eslint-disable-next-line react/jsx-no-bind
            handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
            manualCriteriaToRender={[]}
            // eslint-disable-next-line react/jsx-no-bind
            setManualCriteriaToRender={function (
              value: SetStateAction<Array<ManualCriteriaItem>>
            ): void {
              console.log(value);
            }}
            criteriaToSubmit={[]}
            // eslint-disable-next-line react/jsx-no-bind
            setCriteriaToSubmit={function (
              value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
            ): void {
              console.log(value);
            }}
          />
        </Provider>
      );
    });
  });

  it('call the submit event when form is submitted', async () => {
    const { queryByTestId } = render(
      <Provider store={store}>
        <Wizard handleOpenExitModal={() => console.log('exit modal')} />
      </Provider>
    );

    const submit = queryByTestId('continue-action-test') as HTMLInputElement;
    const skip = queryByTestId('skip-action-test') as HTMLInputElement;

    await act(async () => {
      fireEvent.click(submit);
      expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
      fireEvent.click(skip);
      expect(WIZARD_ACTIONS.DRAFT).toBe('DRAFT');
    });
  });

  it('Test DateOfBirthCriteriaItem onClick delete button', async () => {
    const { getByTestId } = render(
      <ManualCriteria
        data={data}
        action={''}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
        manualCriteriaToRender={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setManualCriteriaToRender={function (
          value: SetStateAction<Array<ManualCriteriaItem>>
        ): void {
          console.log(value);
        }}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          console.log(value);
        }}
      />
    );

    const deleteButton = getByTestId('delete-button-test');
    const manual = getByTestId('manual-criteria-test');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(manual).toBeVisible();
      expect(manual).toBeInTheDocument();
      fireEvent.click(deleteButton);
      expect(deleteButton).toBeTruthy();
      expect(manual).not.toBeVisible();
      expect(manual).not.toBeInTheDocument();
    });
  });

  it('Test manualCriteriaSelectName Select onChange', async () => {
    const { queryByTestId, getByTestId } = render(
      <ManualCriteria
        data={data}
        action={''}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
        manualCriteriaToRender={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setManualCriteriaToRender={function (
          value: SetStateAction<Array<ManualCriteriaItem>>
        ): void {
          console.log(value);
        }}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          console.log(value);
        }}
      />
    );

    const boolean = queryByTestId('boolean');
    const multi = queryByTestId('multi');
    const handleCriteriaType = jest.fn();
    const handleFieldValueChanged = jest.fn();
    const handleOptionChanged = jest.fn();
    const changeOption = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(boolean).toBeInTheDocument();
      expect(multi).toBeInTheDocument();
    });

    const mockCallback = jest.fn();

    const manualCriteria = getByTestId('manualCriteria-select-name');
    // Dig deep to find the actual <select>
    const manualCriteriaSelect = manualCriteria.childNodes[0];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(manualCriteriaSelect, { target: { value: ManualCriteriaOptions.MULTI } });
      expect(mockCallback.mock.calls).toHaveLength(1);
      expect(handleCriteriaType).toBeDefined();
      expect(handleCriteriaType).toHaveBeenCalledTimes(0);
      expect(handleFieldValueChanged).toBeDefined();
      expect(handleFieldValueChanged).toHaveBeenCalledTimes(0);
      expect(handleOptionChanged).toBeDefined();
      expect(handleOptionChanged).toHaveBeenCalledTimes(0);
      expect(changeOption).toBeDefined();
      expect(changeOption).toHaveBeenCalledTimes(0);
    });
  });

  it('Test manualCriteriaSelectName TextFields', async () => {
    const { queryByTestId, getByTestId } = render(
      <ManualCriteria
        data={data}
        action={''}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
        manualCriteriaToRender={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setManualCriteriaToRender={function (
          value: SetStateAction<Array<ManualCriteriaItem>>
        ): void {
          console.log(value);
        }}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          console.log(value);
        }}
      />
    );

    const boolean = queryByTestId('boolean');
    const multi = queryByTestId('multi');
    const manualCriteria = getByTestId('manualCriteria-select-name');
    const manualCriteriaBoolean = getByTestId('manualCriteria-boolean-test') as HTMLInputElement;
    const manualCriteriaMulti = queryByTestId('manualCriteria-multi-test') as HTMLInputElement;
    const handleFieldValueChanged = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(boolean).toBeInTheDocument();
      expect(multi).toBeInTheDocument();
    });

    if (manualCriteria.id === ManualCriteriaOptions.BOOLEAN) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      waitFor(async () => {
        expect(boolean).toBeInTheDocument();
        expect(boolean).toBeVisible();
        expect(multi).not.toBeInTheDocument();
        expect(multi).not.toBeVisible();
        fireEvent.change(manualCriteriaBoolean, {
          target: { value: 'Et dignissimos perspiciatis facere impedit modi.' },
        });
        expect(handleFieldValueChanged).toBeDefined();
        expect(handleFieldValueChanged).toHaveBeenCalledTimes(0);
        expect(manualCriteriaBoolean.value).toBe(
          'Et dignissimos perspiciatis facere impedit modi.'
        );
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      waitFor(async () => {
        expect(boolean).toBeInTheDocument();
        expect(boolean).toBeVisible();
        expect(multi).toBeInTheDocument();
        expect(multi).toBeVisible();
        fireEvent.change(manualCriteriaBoolean, {
          target: { value: 'Et dignissimos perspiciatis facere impedit modi.' },
        });
        expect(manualCriteriaBoolean.value).toBe(
          'Et dignissimos perspiciatis facere impedit modi.'
        );
        fireEvent.change(manualCriteriaMulti, { target: { value: 'Multipla' } });
        expect(manualCriteriaMulti.value).toBe('Multipla');
      });
    }
  });

  it('Test Add/Remove Manual criteria Multi item', async () => {
    const { queryByTestId, getByTestId } = render(
      <ManualCriteria
        data={data}
        action={''}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
        manualCriteriaToRender={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setManualCriteriaToRender={function (
          value: SetStateAction<Array<ManualCriteriaItem>>
        ): void {
          console.log(value);
        }}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          console.log(value);
        }}
      />
    );

    const add = queryByTestId('manualCriteria-add-option') as HTMLInputElement;
    const remove = queryByTestId('manualCriteria-remove-option') as HTMLInputElement;
    const manualCriteriaMulti = queryByTestId('manualCriteria-multi-test') as HTMLInputElement;
    const manualCriteriaSelect = getByTestId('manualCriteria-select-name');
    const manualCriteria = [manualCriteriaMulti];
    const handleOptionAdded = jest.fn();
    const addOption = jest.fn();
    const handleOptionDeleted = jest.fn();
    const deleteOption = jest.fn();

    if (manualCriteriaSelect.id === ManualCriteriaOptions.MULTI) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      waitFor(async () => {
        expect(add).toBeTruthy();
        expect(add).toBeDefined();
        expect(add).toBeInTheDocument();
        expect(add).toBeVisible();
        fireEvent.click(add);
        expect(handleOptionAdded).toBeDefined();
        expect(addOption).toBeDefined();
        expect(handleOptionAdded).toHaveBeenCalledTimes(0);
        expect(addOption).toHaveBeenCalledTimes(0);
        expect(manualCriteriaMulti).toEqual(expect.arrayContaining(manualCriteria));
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      waitFor(async () => {
        expect(remove).toBeTruthy();
        expect(remove).toBeDefined();
        expect(remove).toBeInTheDocument();
        expect(remove).toBeVisible();
        fireEvent.click(remove);
        expect(manualCriteriaMulti).toEqual(expect.not.arrayContaining(manualCriteria));
        expect(handleOptionDeleted).toBeDefined();
        expect(deleteOption).toBeDefined();
        expect(handleOptionDeleted).toHaveBeenCalledTimes(0);
        expect(deleteOption).toHaveBeenCalledTimes(0);
      });
    }
  });
});
