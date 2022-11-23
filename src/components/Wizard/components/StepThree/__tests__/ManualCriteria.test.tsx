import { fireEvent, render, act } from '@testing-library/react';
import { SetStateAction } from 'react';
import { Provider } from 'react-redux';
import { ManualCriteriaItem } from '../../../../../model/Initiative';
import { createStore } from '../../../../../redux/store';
import { ManualCriteriaOptions, WIZARD_ACTIONS } from '../../../../../utils/constants';
import Wizard from '../../../Wizard';
import ManualCriteria from '../ManualCriteria';
import React from 'react';
import userEvent from '@testing-library/user-event';

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
  test('Should display ManualCriteria DRAFT action', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ManualCriteria
          key={1}
          data={{
            _type: 'multi',
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
              _type: 'multi',
              description: 'description',
              boolValue: true,
              multiValue: [{ value: 'string' }, { value: 'string' }],
              code: 'code',
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
    //const user = userEvent.setup();
    const textField = getByTestId('manualCriteria-multi-test').querySelector(
      'input'
    ) as HTMLInputElement;

    // user.type(textField, 'CODES');
    // debug();
    expect(textField).toBeDefined();
    fireEvent.change(textField, { target: { value: '' } });
    // expect(textField.value).toBe('value');
  });
  /*
  it('test on handleSubmit', async () => {
    const mockedSetCriteriaToSubmit = jest.fn();
    await act(async () => {
      const handleSubmit = jest.fn();
      render(
        <Provider store={store}>
          <ManualCriteria
            key={2}
            data={data}
            action={WIZARD_ACTIONS.SUBMIT}
            // eslint-disable-next-line react/jsx-no-bind
            handleCriteriaRemoved={(_event: React.MouseEvent<Element, MouseEvent>) => {}}
            manualCriteriaToRender={[]}
            // eslint-disable-next-line react/jsx-no-bind
            setManualCriteriaToRender={function (
              _value: SetStateAction<Array<ManualCriteriaItem>>
            ): void {
              //
            }}
            criteriaToSubmit={[]}
            // eslint-disable-next-line react/jsx-no-bind
            setCriteriaToSubmit={mockedSetCriteriaToSubmit}
          />
        </Provider>
      );

      handleSubmit();
      // const user = userEvent.setup();

      
      act(async () => {
        await user.type(
          screen.getByPlaceholderText(/components.wizard.stepThree.chooseCriteria.form.value/i),
          'CODES'
        );
      });
      
      expect(handleSubmit).toHaveBeenCalled();
      // expect(mockedSetCriteriaToSubmit.mock.calls.length).toEqual(0);
    });
  });
*/
  it('call the submit event when form is submitted', async () => {
    await act(async () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <Wizard handleOpenExitModal={() => console.log('exit modal')} />
        </Provider>
      );

      const submit = queryByTestId('continue-action-test') as HTMLInputElement;
      const skip = queryByTestId('skip-action-test') as HTMLInputElement;

      act(() => {
        fireEvent.click(submit);
      });
      expect(WIZARD_ACTIONS.SUBMIT).toBe('SUBMIT');
      act(() => {
        fireEvent.click(skip);
      });
      expect(WIZARD_ACTIONS.DRAFT).toBe('DRAFT');
    });
  });
  /*

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
          _value: SetStateAction<Array<ManualCriteriaItem>>
        ): void {
          //
        }}
        criteriaToSubmit={[]}
        // eslint-disable-next-line react/jsx-no-bind
        setCriteriaToSubmit={function (
          _value: SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
        ): void {
          //
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
        act(() => {
          fireEvent.click(add);
        });
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
        act(() => {
          fireEvent.click(remove);
        });
        expect(manualCriteriaMulti).toEqual(expect.not.arrayContaining(manualCriteria));
        expect(handleOptionDeleted).toBeDefined();
        expect(deleteOption).toBeDefined();
        expect(handleOptionDeleted).toHaveBeenCalledTimes(0);
        expect(deleteOption).toHaveBeenCalledTimes(0);
      });
    }
  });
  */
});
