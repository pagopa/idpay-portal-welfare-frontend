import { fireEvent, render, act, waitFor } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { DateOfBirthOptions, FilterOperator, WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import ResidencyCriteriaItem from '../ResidencyCriteriaItem';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('<ResidencyCriteriaItem />', (injectedStore?: ReturnType<typeof createStore>) => {
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
  test('Should display the Residency item and must have a correct validation', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <ResidencyCriteriaItem
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

  it('test on handleSubmit', async () => {
    await act(async () => {
      const handleSubmit = jest.fn();
      render(
        <ResidencyCriteriaItem
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
      );
      handleSubmit();
      expect(handleSubmit).toHaveBeenCalled();
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

  it('Test on ResidencyCriteriaItem', async () => {
    const { queryByTestId } = render(
      <ResidencyCriteriaItem
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

    const residencySelect = queryByTestId('residency-select-test');
    const residencyRelationSelect = queryByTestId('residency-relation-test');
    const residencyValue = queryByTestId('residencyValue');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await act(async () => {
      expect(residencySelect).not.toBeNull();
      expect(residencyRelationSelect).not.toBeNull();
      expect(residencyValue).not.toBeNull();
    });

    const postalCode = queryByTestId('postalCode');
    const cityCouncil = queryByTestId('cityCouncil');
    const city = queryByTestId('city');
    const province = queryByTestId('province');
    const region = queryByTestId('region');
    const is = queryByTestId('is');
    const isNot = queryByTestId('isNot');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(postalCode).toBeInTheDocument();
      expect(cityCouncil).toBeInTheDocument();
      expect(city).toBeInTheDocument();
      expect(province).toBeInTheDocument();
      expect(region).toBeInTheDocument();
      expect(is).toBeInTheDocument();
      expect(isNot).toBeInTheDocument();
    });
  });

  it('Test DateOfBirthCriteriaItem onClick delete button', async () => {
    const { queryByTestId } = render(
      <ResidencyCriteriaItem
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

    const deleteButton = queryByTestId('delete-button-test') as HTMLInputElement;
    const residency = queryByTestId('residency-criteria-test');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(residency).toBeVisible();
      expect(residency).toBeInTheDocument();
      fireEvent.click(deleteButton);
      expect(deleteButton).toBeTruthy();
      expect(residency).not.toBeVisible();
      expect(residency).not.toBeInTheDocument();
    });
  });

  it('Test DateOfBirthCriteriaItem Select onChange', async () => {
    const { getByTestId } = render(
      <ResidencyCriteriaItem
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

    const criteria = getByTestId('residency-select-test').querySelector(
      'input'
    ) as HTMLInputElement;
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
      <ResidencyCriteriaItem
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

    const criteria = getByTestId('residency-relation-test').querySelector(
      'input'
    ) as HTMLInputElement;
    // Dig deep to find the actual <select>
    const criteriaSelect = criteria.childNodes[0];

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      fireEvent.change(criteriaSelect, { target: { value: FilterOperator.EQ } });
      expect(mockCallback.mock.calls).toHaveLength(1);
    });
  });

  it('Test ResidencyCriteria TextField residencyValue', async () => {
    const valueChanged = jest.fn();

    const { getByTestId } = render(
      <ResidencyCriteriaItem
        action={''}
        formData={data}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
        handleFieldValueChanged={valueChanged}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          //
        }}
      />
    );

    const residencyValue = getByTestId('residencyValue') as HTMLInputElement;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitFor(async () => {
      expect(residencyValue).toBeInTheDocument();
      expect(residencyValue).toBeVisible();
      fireEvent.change(residencyValue, { target: { value: '100' } });
      expect(residencyValue.value).toBe('100');
    });
  });
});
