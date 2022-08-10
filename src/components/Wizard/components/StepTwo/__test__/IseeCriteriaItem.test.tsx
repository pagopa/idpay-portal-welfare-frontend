import { fireEvent, render, act, waitFor } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { FilterOperator } from '../../../../../utils/constants';
import IseeCriteriaItem from '../IseeCriteriaItem';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<IseeCriteriaItem />', (injectedStore?: ReturnType<typeof createStore>) => {
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
  test('Should display the Isee item and must have a correct validation', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <IseeCriteriaItem
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

  it('Test on IseeCriteriaItem', async () => {
    const { queryByTestId } = render(
      <IseeCriteriaItem
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

    const iseeRelationSelect = queryByTestId('isee-realtion-select');
    const iseeStartValue = queryByTestId('isee-start-value');
    const iseeEndValue = queryByTestId('isee-end-value');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await act(async () => {
      expect(iseeRelationSelect).not.toBeNull();
      expect(iseeStartValue).not.toBeNull();
      expect(iseeEndValue).not.toBeNull();
    });
  });

  it('Test iseeCriteria onClick delete button', async () => {
    const { getByTestId } = render(
      <IseeCriteriaItem
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
    const iseeCriteria = getByTestId('isee-criteria-test');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(iseeCriteria).toBeVisible();
      expect(iseeCriteria).toBeInTheDocument();
      fireEvent.click(deleteButton);
      expect(deleteButton).toBeTruthy();
      expect(iseeCriteria).not.toBeVisible();
      expect(iseeCriteria).not.toBeInTheDocument();
    });
  });

  it('Test iseeCriteria Select onChange', async () => {
    const { queryByTestId, getByTestId } = render(
      <IseeCriteriaItem
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

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(exact).toBeInTheDocument();
      expect(majorTo).toBeInTheDocument();
      expect(minorTo).toBeInTheDocument();
      expect(majorOrEqualTo).toBeInTheDocument();
      expect(minorOrEqualTo).toBeInTheDocument();
      expect(between).toBeInTheDocument();
    });

    const mockCallback = jest.fn();

    const criteria = getByTestId('isee-realtion-select');
    // Dig deep to find the actual <select>
    const criteriaSelect = criteria.childNodes[0];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(criteriaSelect, { target: { value: FilterOperator.EQ } });
      expect(mockCallback.mock.calls).toHaveLength(1);
    });
  });

  it('Test iseeCriteria TextField iseeStartValue/IseeEndValue', async () => {
    const valueChanged = jest.fn();

    const { getByTestId } = render(
      <IseeCriteriaItem
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

    const iseeStartValue = getByTestId('isee-start-value').querySelector(
      'input'
    ) as HTMLInputElement;
    const iseeEndValue = getByTestId('isee-end-value').querySelector('input') as HTMLInputElement;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(iseeStartValue).toBeInTheDocument();
      expect(iseeEndValue).toBeInTheDocument();
      expect(iseeStartValue).toBeVisible();
      expect(iseeEndValue).toBeVisible();
      fireEvent.change(iseeStartValue, { target: { value: '100' } });
      expect(iseeStartValue.value).toBe('100');
      fireEvent.change(iseeEndValue, { target: { value: '1000' } });
      expect(iseeEndValue.value).toBe('1000');
    });
  });
});
