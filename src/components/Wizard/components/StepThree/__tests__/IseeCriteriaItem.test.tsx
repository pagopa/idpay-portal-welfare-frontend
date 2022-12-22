import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '../../../../../redux/store';
import { FilterOperator, WIZARD_ACTIONS } from '../../../../../utils/constants';
import IseeCriteriaItem from '../IseeCriteriaItem';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));
afterEach(cleanup);

describe('<IseeCriteriaItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  const data = {
    code: '',
    authorityLabel: 'auth label',
    fieldLabel: '',
    value: 'value',
    value2: 'value2',
    authority: '',
    field: '',
    operator: FilterOperator.BTW_OPEN,
    checked: true,
  };

  const handleCriteriaRemoved = jest.fn();

  const setCriteriaToSubmit = jest.fn();

  const store = injectedStore ? injectedStore : createStore();

  it('test on handleSubmit', async () => {
    await act(async () => {
      const handleFieldValueChanged = jest.fn();
      render(
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
      const menuASC = await waitFor(() => {
        return screen.getByText('components.wizard.stepThree.chooseCriteria.form.rankingOrderASC');
      });
      const rankingBtn = await waitFor(() => {
        return screen.getByTestId('ranking-button-test');
      });

      fireEvent.click(rankingBtn);
      expect(rankingBtn).toBeInTheDocument();

      fireEvent.click(menuASC);
      expect(menuASC).toBeInTheDocument();

      fireEvent.click(iseeRelationSelect);
      fireEvent.change(iseeRelationSelect, { target: { value: 'GT' } });
      expect(iseeRelationSelect).toBeDefined();
      expect(handleFieldValueChanged.mock.calls.length).toBe(1);

      fireEvent.click(deleteBtn);

      expect(deleteBtn).toBeInTheDocument();
      expect(handleCriteriaRemoved.mock.calls.length).toBe(1);
    });
  });

  it('Test on IseeCriteriaItem', async () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await act(async () => {
      render(
        <IseeCriteriaItem
          action={WIZARD_ACTIONS.DRAFT}
          formData={{
            code: '',
            authorityLabel: 'auth label',
            fieldLabel: '',
            value: 'value',
            value2: 'value2',
            authority: '',
            field: '',
            operator: 'GT',
            checked: true,
          }}
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
