import { fireEvent, render, screen } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { ManualCriteriaItem } from '../../../../../model/Initiative';
import { createStore } from '../../../../../redux/store';
import { ManualCriteriaOptions, WIZARD_ACTIONS } from '../../../../../utils/constants';
import ManualCriteria from '../ManualCriteria';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));
const originalError = console.error;
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  console.error = originalError;
});

describe('<DateOfBirthCriteriaItem />', (injectedStore?: ReturnType<typeof createStore>) => {
  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  const store = injectedStore ? injectedStore : createStore();
  test('Should display ManualCriteria SUBMIT action', () => {
    const handleCriteriaRemoved = jest.fn();
    const setManualCriteriaToRender = jest.fn();
    const setCriteriaToSubmit = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <ManualCriteria
          key={1}
          data={{
            _type: 'multi',
            description: 'description',
            boolValue: false,
            multiValue: [{ value: 'value' }],
            code: 'code',
          }}
          action={WIZARD_ACTIONS.SUBMIT}
          handleCriteriaRemoved={handleCriteriaRemoved}
          manualCriteriaToRender={[
            {
              _type: 'multi',
              description: 'description',
              boolValue: false,
              multiValue: [{ value: 'string' }, { value: 'string' }],
              code: 'code',
            },
          ]}
          setManualCriteriaToRender={setManualCriteriaToRender}
          criteriaToSubmit={[{ code: 'code', dispatched: true }]}
          setCriteriaToSubmit={setCriteriaToSubmit}
        />
      </Provider>
    );

    const textField = getByTestId('manualCriteria-multi-test') as HTMLInputElement;
    const deleteBtn = screen.getByTestId('delete-button-test') as HTMLButtonElement;
    const selectManualCriteria = screen.getByTestId(
      'manualCriteria-select-name'
    ) as HTMLSelectElement;
    const manualCriteriaName = screen.getByTestId(
      'manualCriteria-boolean-test'
    ) as HTMLInputElement;
    const addOptionsBtn = screen.getByTestId('add option btn') as HTMLButtonElement;

    fireEvent.change(textField, { target: { value: 'temp val' } });
    expect(textField).toBeDefined();

    fireEvent.click(deleteBtn);
    expect(handleCriteriaRemoved.mock.calls.length).toBe(1);

    fireEvent.click(selectManualCriteria);
    fireEvent.change(selectManualCriteria, { target: { value: 'boolean' } });
    expect(selectManualCriteria).toBeDefined();

    fireEvent.click(manualCriteriaName);
    fireEvent.change(manualCriteriaName, { target: { value: 'boolean' } });
    expect(manualCriteriaName).toBeDefined();

    fireEvent.click(addOptionsBtn);
    expect(addOptionsBtn).toBeDefined();
  });

  test('Should display ManualCriteria DRAFT action', () => {
    render(
      <Provider store={store}>
        <ManualCriteria
          key={0}
          data={{
            _type: 'boolean',
            description: 'description',
            boolValue: true,
            multiValue: [{ value: 'value' }],
            code: 'code',
          }}
          action={WIZARD_ACTIONS.DRAFT}
          // eslint-disable-next-line react/jsx-no-bind
          handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
          manualCriteriaToRender={[
            {
              _type: 'bool',
              description: 'description',
              boolValue: true,
              multiValue: [{ value: 'string' }, { value: 'string' }],
              code: '',
            },
          ]}
          // eslint-disable-next-line react/jsx-no-bind
          setManualCriteriaToRender={function (
            _value: SetStateAction<Array<ManualCriteriaItem>>
          ): void {
            //
          }}
          criteriaToSubmit={[{ code: 'code', dispatched: true }]}
          // eslint-disable-next-line react/jsx-no-bind
          setCriteriaToSubmit={function (
            _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
          ): void {
            //
          }}
        />
      </Provider>
    );
    const deleteBtn = screen.getByTestId('delete-button-test') as HTMLButtonElement;

    fireEvent.click(deleteBtn);
  });
});
