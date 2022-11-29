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

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

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
      const handleFieldValueChanged = jest.fn();
      const handleCriteriaRemoved = jest.fn();
      const { getByTestId } = render(
        <Provider store={store}>
          <DateOdBirthCriteriaItem
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
            setCriteriaToSubmit={function (
              _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
            ): void {
              //
            }}
          />
        </Provider>
      );
      const deleteBtn = getByTestId('delete-button-test') as HTMLButtonElement;
      const birthDateStart = getByTestId('dateOfBirth-start-value') as HTMLInputElement;
      const birthDateEnd = getByTestId('dateOfBirth-end-value') as HTMLInputElement;

      fireEvent.click(deleteBtn);
      expect(handleCriteriaRemoved.mock.calls.length).toBe(1);

      fireEvent.change(birthDateStart, { target: { value: 'birthDateStart' } });
      fireEvent.blur(birthDateStart);
      expect(birthDateStart).toBeInTheDocument();

      fireEvent.change(birthDateEnd, { target: { value: 'birthDateEnd' } });
      expect(birthDateEnd).toBeInTheDocument();
    });
  });

  it('test on handleSubmit', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <DateOdBirthCriteriaItem
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
        </Provider>
      );
    });
  });

  it('Test on DateOfBirthCriteriaItem', async () => {
    const { queryByTestId } = render(
      <DateOdBirthCriteriaItem
        action={WIZARD_ACTIONS.BACK}
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
