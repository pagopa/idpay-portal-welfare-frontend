import { fireEvent, render, act, waitFor, screen } from '@testing-library/react';
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
    const handleFieldValueChanged = jest.fn();
    const handleCriteriaRemoved = jest.fn();
    const setCriteriaToSubmit = jest.fn();
    await act(async () => {
      render(
        <Provider store={store}>
          <ResidencyCriteriaItem
            action={WIZARD_ACTIONS.SUBMIT}
            formData={data}
            handleCriteriaRemoved={handleCriteriaRemoved}
            handleFieldValueChanged={handleFieldValueChanged}
            criteriaToSubmit={[
              { code: 'code', dispatched: true },
              { code: 'code', dispatched: true },
            ]}
            setCriteriaToSubmit={setCriteriaToSubmit}
          />
        </Provider>
      );
      const residencyValue = screen.getByTestId('residencyValue') as HTMLInputElement;
      const selectResidencyValue = screen.getByTestId('residency-select-test') as HTMLSelectElement;
      const selectResidencyRelation = screen.getByTestId(
        'residency-relation-test'
      ) as HTMLSelectElement;
      const deleteButton = screen.getByTestId('delete-button-test') as HTMLButtonElement;

      fireEvent.change(residencyValue, { target: { value: '100' } });
      fireEvent.blur(residencyValue);
      expect(residencyValue).toBeInTheDocument();
      expect(handleFieldValueChanged.mock.calls.length).toBe(1);

      fireEvent.click(selectResidencyValue);
      fireEvent.change(selectResidencyValue, { target: { value: 'postal_code' } });
      expect(selectResidencyValue).toBeInTheDocument();

      fireEvent.click(selectResidencyRelation);
      fireEvent.change(selectResidencyRelation, { target: { value: 'EQ' } });
      expect(selectResidencyValue).toBeInTheDocument();

      fireEvent.click(deleteButton);
      expect(handleCriteriaRemoved.mock.calls.length).toBe(1);
    });
  });

  it('Test on ResidencyCriteriaItem', async () => {
    render(
      <ResidencyCriteriaItem
        action={WIZARD_ACTIONS.BACK}
        formData={data}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
        handleFieldValueChanged={undefined}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind /
        setCriteriaToSubmit={function (
          _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          //
        }}
      />
    );
  });

  it('Test DateOfBirthCriteriaItem onClick delete button', async () => {
    render(
      <ResidencyCriteriaItem
        action={WIZARD_ACTIONS.DRAFT}
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
  });
});
