import { fireEvent, render, act, waitFor } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { DateOfBirthOptions, FilterOperator, WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import DateOdBirthCriteriaItem from '../DateOfBirthCriteriaItem';

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
            handleCriteriaRemoved={function (event: React.MouseEvent<Element, MouseEvent>): void {
              console.log(event);
            }}
            handleFieldValueChanged={undefined}
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
        <Wizard />
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
        handleCriteriaRemoved={function (event: React.MouseEvent<Element, MouseEvent>): void {
          console.log(event);
        }}
        handleFieldValueChanged={undefined}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          console.log(value);
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
        handleCriteriaRemoved={function (event: React.MouseEvent<Element, MouseEvent>): void {
          console.log(event);
        }}
        handleFieldValueChanged={undefined}
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
    const dateBirth = getByTestId('dateBirth-criteria-test');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(dateBirth).toBeVisible();
      expect(dateBirth).toBeInTheDocument();
      fireEvent.click(deleteButton);
      expect(deleteButton).toBeTruthy();
      expect(dateBirth).not.toBeVisible();
      expect(dateBirth).not.toBeInTheDocument();
    });
  });

  it('Test DateOfBirthCriteriaItem Select onChange', async () => {
    const { queryByTestId, getByTestId } = render(
      <DateOdBirthCriteriaItem
        action={''}
        formData={data}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={function (event: React.MouseEvent<Element, MouseEvent>): void {
          console.log(event);
        }}
        handleFieldValueChanged={undefined}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          console.log(value);
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
    });
  });

  it('Test DateOfBirthCriteriaItem RelationSelect onChange', async () => {
    const { getByTestId } = render(
      <DateOdBirthCriteriaItem
        action={''}
        formData={data}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={function (event: React.MouseEvent<Element, MouseEvent>): void {
          console.log(event);
        }}
        handleFieldValueChanged={undefined}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          console.log(value);
        }}
      />
    );

    const mockCallback = jest.fn();

    const criteria = getByTestId('dateOfBirth-select-test');
    // Dig deep to find the actual <select>
    const criteriaSelect = criteria.childNodes[0];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(criteriaSelect, { target: { value: FilterOperator.EQ } });
      expect(mockCallback.mock.calls).toHaveLength(1);
    });
  });

  it('Test DateOfBirthCriteriaItem TextField dateOfBirthStartValue/dateOfBirthEndValue', async () => {
    const valueChanged = jest.fn();

    const { getByTestId } = render(
      <DateOdBirthCriteriaItem
        action={''}
        formData={data}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={function (event: React.MouseEvent<Element, MouseEvent>): void {
          console.log(event);
        }}
        handleFieldValueChanged={valueChanged}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          console.log(value);
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
        // eslint-disable-next-line sonarjs/no-duplicated-branches
      } else {
        expect(dateOfBirthStartValue).toBeInTheDocument();
        expect(dateOfBirthStartValue).toBeVisible();
        expect(dateOfBirthEndValue).not.toBeInTheDocument();
        expect(dateOfBirthEndValue).not.toBeVisible();
        fireEvent.change(dateOfBirthStartValue, { target: { value: '100' } });
        expect(dateOfBirthStartValue.value).toBe('100');
      }
    });
  });
});
