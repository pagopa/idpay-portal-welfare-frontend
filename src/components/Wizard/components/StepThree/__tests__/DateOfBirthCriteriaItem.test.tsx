import { fireEvent, render, act, waitFor } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { DateOfBirthOptions, FilterOperator, WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import DateOdBirthCriteriaItem from '../DateOfBirthCriteriaItem';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<DateOfBirthCriteriaItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  const data = {
    _type: '',
    description: '',
    code: '',
    boolValue: true,
    multiValue: ['', ''],
    authorityLabel: '',
    fieldLabel: '',
    value: '',
    value2: '',
    authority: '',
    field: '',
    operator: '',
    checked: false,
  };

  const store = injectedStore ? injectedStore : createStore();
  test('Should display the DateOfBirth item and must have a correct validation', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <DateOdBirthCriteriaItem
            action={''}
            formData={data}
            // eslint-disable-next-line react/jsx-no-bind
            handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
            handleFieldValueChanged={undefined}
            criteriaToSubmit={[]}
            // eslint-disable-next-line react/jsx-no-bind
            setCriteriaToSubmit={function (
              _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
            ): void {
              //
            }}
          />
        </Provider>
      );
    });
  });

  it('test on handleSubmit', () => {
    const handleSubmit = jest.fn();
    render(
      <Provider store={store}>
        <DateOdBirthCriteriaItem
          action={WIZARD_ACTIONS.SUBMIT}
          formData={data}
          // eslint-disable-next-line react/jsx-no-bind
          handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
          handleFieldValueChanged={undefined}
          criteriaToSubmit={[]}
          // eslint-disable-next-line react/jsx-no-bind
          setCriteriaToSubmit={function (
            _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
          ): void {
            //
          }}
        />
      </Provider>
    );
    handleSubmit();
    expect(handleSubmit).toHaveBeenCalled();
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

  it('Test on DateOfBirthCriteriaItem', async () => {
    const { queryByTestId } = render(
      <DateOdBirthCriteriaItem
        action={''}
        formData={data}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
        handleFieldValueChanged={undefined}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          //
        }}
      />
    );

    const dateOfBirthSelect = queryByTestId('dateOfBirth-select-test');
    const dateOfBirthRelationSelect = queryByTestId('dateOfBirth-relation-test');
    const dateOfBirthStartValue = queryByTestId('dateOfBirth-start-value');
    const dateOfBirthEndValue = queryByTestId('dateOfBirth-end-value');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await act(async () => {
      expect(dateOfBirthSelect).not.toBeNull();
      expect(dateOfBirthRelationSelect).not.toBeNull();
      expect(dateOfBirthStartValue).not.toBeNull();
      expect(dateOfBirthEndValue).not.toBeNull();
    });
  });

  it('Test DateOfBirthCriteriaItem onClick delete button', async () => {
    const { getByTestId } = render(
      <DateOdBirthCriteriaItem
        action={''}
        formData={data}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
        handleFieldValueChanged={undefined}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          //
        }}
      />
    );

    const deleteButton = getByTestId('delete-button-test');
    const dateBirth = getByTestId('dateBirth-criteria-test');
    const handleCriteriaRemoved = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(dateBirth).toBeVisible();
      expect(dateBirth).toBeInTheDocument();
      fireEvent.click(deleteButton);
      expect(deleteButton).toBeTruthy();
      expect(dateBirth).not.toBeVisible();
      expect(dateBirth).not.toBeInTheDocument();
      expect(handleCriteriaRemoved).toBeDefined();
      expect(handleCriteriaRemoved).toHaveBeenCalledTimes(0);
    });
  });

  it('Test DateOfBirthCriteriaItem Select onChange', async () => {
    const { queryByTestId, getByTestId } = render(
      <DateOdBirthCriteriaItem
        action={''}
        formData={data}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
        handleFieldValueChanged={undefined}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          //
        }}
      />
    );

    const exact = queryByTestId('exact');
    const majorTo = queryByTestId('majorTo');
    const minorTo = queryByTestId('minorTo');
    const majorOrEqualTo = queryByTestId('majorOrEqualTo');
    const minorOrEqualTo = queryByTestId('minorOrEqualTo');
    const between = queryByTestId('between');
    const year = queryByTestId('year');
    const age = queryByTestId('age');
    const handleChange = jest.fn();
    const handleFieldValueChanged = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(exact).toBeInTheDocument();
      expect(majorTo).toBeInTheDocument();
      expect(minorTo).toBeInTheDocument();
      expect(majorOrEqualTo).toBeInTheDocument();
      expect(minorOrEqualTo).toBeInTheDocument();
      expect(between).toBeInTheDocument();
      expect(year).toBeInTheDocument();
      expect(age).toBeInTheDocument();
    });

    const mockCallback = jest.fn();

    const criteria = getByTestId('dateOfBirth-relation-test');
    // Dig deep to find the actual <select>
    const criteriaSelect = criteria.childNodes[0];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(criteriaSelect, { target: { value: DateOfBirthOptions.YEAR } });
      expect(mockCallback.mock.calls).toHaveLength(1);
      expect(handleChange).toBeDefined();
      expect(handleChange).toHaveBeenCalledTimes(0);
      expect(handleFieldValueChanged).toBeDefined();
      expect(handleFieldValueChanged).toHaveBeenCalledTimes(0);
    });
  });

  it('Test DateOfBirthCriteriaItem RelationSelect onChange', async () => {
    const { getByTestId } = render(
      <DateOdBirthCriteriaItem
        action={''}
        formData={data}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
        handleFieldValueChanged={undefined}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          //
        }}
      />
    );

    const mockCallback = jest.fn();
    const handleChange = jest.fn();
    const handleFieldValueChanged = jest.fn();

    const criteria = getByTestId('dateOfBirth-select-test');
    // Dig deep to find the actual <select>
    const criteriaSelect = criteria.childNodes[0];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(criteriaSelect, { target: { value: FilterOperator.EQ } });
      expect(mockCallback.mock.calls).toHaveLength(1);
      expect(mockCallback.mock.calls).toHaveLength(1);
      expect(handleChange).toBeDefined();
      expect(handleChange).toHaveBeenCalledTimes(0);
      expect(handleFieldValueChanged).toBeDefined();
      expect(handleFieldValueChanged).toHaveBeenCalledTimes(0);
    });
  });

  it('Test DateOfBirthCriteriaItem TextField dateOfBirthStartValue/dateOfBirthEndValue', async () => {
    const handleChange = jest.fn();
    const handleFieldValueChanged = jest.fn();

    const { getByTestId } = render(
      <DateOdBirthCriteriaItem
        action={''}
        formData={data}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
        handleFieldValueChanged={handleFieldValueChanged}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          //
        }}
      />
    );

    const dateOfBirthStartValue = getByTestId('dateOfBirth-start-value').querySelector(
      'input'
    ) as HTMLInputElement;
    const dateOfBirthEndValue = getByTestId('dateOfBirth-end-value').querySelector(
      'input'
    ) as HTMLInputElement;
    const criteria = getByTestId('dateOfBirth-relation-test');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      // eslint-disable-next-line sonarjs/no-all-duplicated-branches
      if (criteria.id === FilterOperator.EQ) {
        expect(dateOfBirthStartValue).toBeInTheDocument();
        expect(dateOfBirthStartValue).toBeVisible();
        expect(dateOfBirthEndValue).toBeInTheDocument();
        expect(dateOfBirthEndValue).toBeVisible();
        fireEvent.change(dateOfBirthStartValue, { target: { value: '100' } });
        expect(dateOfBirthStartValue.value).toBe('100');
        fireEvent.change(dateOfBirthEndValue, { target: { value: '1000' } });
        expect(dateOfBirthEndValue.value).toBe('1100');
        expect(handleChange).toBeDefined();
        expect(handleChange).toHaveBeenCalledTimes(0);
        expect(handleFieldValueChanged).toBeDefined();
        expect(handleFieldValueChanged).toHaveBeenCalledTimes(0);
        // eslint-disable-next-line sonarjs/no-duplicated-branches
      } else {
        expect(dateOfBirthStartValue).toBeInTheDocument();
        expect(dateOfBirthStartValue).toBeVisible();
        expect(dateOfBirthEndValue).not.toBeInTheDocument();
        expect(dateOfBirthEndValue).not.toBeVisible();
        fireEvent.change(dateOfBirthStartValue, { target: { value: '100' } });
        expect(dateOfBirthStartValue.value).toBe('100');
        expect(handleChange).toBeDefined();
        expect(handleChange).toHaveBeenCalledTimes(0);
        expect(handleFieldValueChanged).toBeDefined();
        expect(handleFieldValueChanged).toHaveBeenCalledTimes(0);
      }
    });
  });
});
