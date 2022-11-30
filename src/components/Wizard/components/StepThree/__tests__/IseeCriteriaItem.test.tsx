import { fireEvent, render, act, waitFor, screen } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { FilterOperator, WIZARD_ACTIONS } from '../../../../../utils/constants';
import IseeCriteriaItem from '../IseeCriteriaItem';
import React from 'react';

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

  const handleCriteriaRemoved = jest.fn();

  const setCriteriaToSubmit = jest.fn();

  const store = injectedStore ? injectedStore : createStore();

  it('test on handleSubmit', async () => {
    await act(async () => {
      const handleFieldValueChanged = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <IseeCriteriaItem
            action={WIZARD_ACTIONS.SUBMIT}
            formData={data}
            // eslint-disable-next-line react/jsx-no-bind
            handleCriteriaRemoved={handleCriteriaRemoved}
            handleFieldValueChanged={handleFieldValueChanged}
            criteriaToSubmit={[
              { code: 'string', dispatched: true },
              { code: 'string', dispatched: true },
            ]}
            // eslint-disable-next-line react/jsx-no-bind
            setCriteriaToSubmit={setCriteriaToSubmit}
            rankingEnabled={'true'}
          />
        </Provider>
      );
      const iseeRelationSelect = screen.getByTestId('isee-realtion-select') as HTMLSelectElement;
      const deleteBtn = screen.getByTestId('delete-button-test') as HTMLButtonElement;

      fireEvent.click(iseeRelationSelect);
      fireEvent.change(iseeRelationSelect, { target: { value: 'GT' } });
      expect(iseeRelationSelect).toBeDefined();
      fireEvent.blur(iseeRelationSelect);
      expect(handleFieldValueChanged.mock.calls.length).toBe(1);

      fireEvent.click(deleteBtn);

      expect(deleteBtn).toBeInTheDocument();
      expect(handleCriteriaRemoved.mock.calls.length).toBe(1);
    });
  });

  it('Test on IseeCriteriaItem', async () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await act(async () => {
      const { queryByTestId } = render(
        <IseeCriteriaItem
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
          rankingEnabled={undefined}
        />
      );
    });
  });

  it('Test iseeCriteria TextField iseeStartValue/IseeEndValue', async () => {
    const valueChanged = jest.fn();

    const { getByTestId } = render(
      <IseeCriteriaItem
        action={WIZARD_ACTIONS.BACK}
        formData={data}
        // eslint-disable-next-line react/jsx-no-bind
        handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
        handleFieldValueChanged={valueChanged}
        criteriaToSubmit={[
          { code: 'string', dispatched: true },
          { code: 'string', dispatched: true },
        ]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          //
        }}
        rankingEnabled={'false'}
      />
    );

    const iseeStartValue = getByTestId('isee-start-value') as HTMLInputElement;
    const iseeEndValue = getByTestId('isee-end-value') as HTMLInputElement;

    expect(iseeStartValue).toBeInTheDocument();
    expect(iseeEndValue).toBeInTheDocument();
    
    fireEvent.blur(iseeStartValue);
    fireEvent.change(iseeStartValue, { target: { value: '100' } });
    expect(iseeStartValue.value).toBe('100');
    fireEvent.change(iseeEndValue, { target: { value: '1000' } });
    fireEvent.blur(iseeEndValue);
    await waitFor(() => expect(iseeEndValue.value).toBeDefined());
  });
});
