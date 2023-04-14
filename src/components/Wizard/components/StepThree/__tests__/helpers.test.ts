import {
  handleCriteriaToSubmit,
  setError,
  setErrorText,
  setFieldType,
  setFormControlDisplayProp,
  mapResponse,
  updateInitialAutomatedCriteriaOnSelector,
  mapCriteriaToSend,
  setInitialOrderDirection,
  IseeTypologyEnum,
} from '../helpers';
// import {FilterOperator} from "../../../../../utils/constants";
const setterFunction = jest.fn();
export const mockedMapResponse = (
  stringOrUndefined: string | undefined,
  authority: string | undefined,
  operator: string | undefined
) => {
  return [
    {
      authority: authority,
      checked: true,
      code: stringOrUndefined,
      field: 'string',
      operator: operator,
      iseeTypes: [IseeTypologyEnum.Dottorato, IseeTypologyEnum.Minorenne],
    },
  ];
};
const arrOptions = ['ISEE', 'BIRTHDATE', 'RESIDENCE', '', undefined];
const mockedAutomatedCriteria = [
  {
    authority: 'string',
    code: 'string',
    field: 'string',
    operator: 'NOT_EQ',
    value: 'string',
    value2: 'string',
  },
];

const mockedSecondCriteriaParameter = [
  {
    authority: '',
    checked: false,
    code: '',
    operator: 'EQ',
    field: '',
    fieldLabel: '',
    authorityLabel: '',
    value: '',
    value2: '',
  },
];

const mockedManualCriteria = (paramaterType: string) => [
  {
    _type: paramaterType,
    description: 'string',
    boolValue: true,
    multiValue: [{ value: 'string' }],
    code: 'string',
  },
];
const mockedManualCriteriaoptions = ['', 'boolean', 'multi'];
describe('helpers.ts of Step three', () => {
  test('handleCriteriaToSubmit', () => {
    expect(
      handleCriteriaToSubmit(
        [
          {
            code: 'string',
            dispatched: true,
          },
        ],
        'code'
      )
    ).not.toBeNull();

    expect(
      handleCriteriaToSubmit(
        [
          {
            code: 'code',
            dispatched: true,
          },
        ],
        'code'
      )
    ).not.toBeNull();
  });
  test('setError', () => {
    expect(setError(false, '')).toBeFalsy();
    expect(setError(true, 'string')).toBeTruthy();
  });
  test('setErrorText', () => {
    expect(setErrorText(true, 'string')).toBe('string');
  });
  test('setFieldType ', () => {
    expect(setFieldType('BTW_OPEN', setterFunction)).not.toBeNull();
    expect(setFieldType('', setterFunction)).not.toBeNull();
  });
  test('setFormControlDisplayProp', () => {
    expect(setFormControlDisplayProp('number')).toBe('flex');
    expect(setFormControlDisplayProp('')).toBe('none');
  });
  test('mapResponse', () => {
    arrOptions.forEach((item) => {
      expect(mapResponse(mockedMapResponse(item, 'string', 'string'))).not.toBeNull();
    });
    expect(
      mapResponse([
        {
          authority: 'string',
          checked: true,
          field: 'string',
          operator: 'string',
        },
      ])
    ).toBeDefined();

    arrOptions.forEach((item) => {
      expect(mapResponse(mockedMapResponse(item, undefined, undefined))).not.toBeNull();
    });
    expect(
      mapResponse([
        {
          authority: '',
          checked: true,
          field: 'string',
          operator: 'EQ',
        },
      ])
    ).toBeDefined();
  });

  test('updateInitialAutomatedCriteriaOnSelector', () => {
    expect(
      updateInitialAutomatedCriteriaOnSelector(
        mockedAutomatedCriteria,
        mockedSecondCriteriaParameter,
        'true'
      )
    ).toBeDefined();
  });

  test('setInitialOrderDirection', () => {
    enum OrderDirectionEnum {
      'ASC' = 'ASC',

      'DESC' = 'DESC',
    }
    expect(setInitialOrderDirection('true', OrderDirectionEnum.ASC)).toEqual('ASC');
    expect(setInitialOrderDirection('false', OrderDirectionEnum.ASC)).toEqual(undefined);
  });

  test('mapCriteriaToSend', () => {
    mockedManualCriteriaoptions.forEach((item) => {
      expect(
        mapCriteriaToSend(
          mockedMapResponse('ISEE', 'string', 'string'),
          mockedManualCriteria(item),
          'true',
          'aaa',
          'bbb'
        )
      ).not.toBeNull();
      expect(
        mapCriteriaToSend(
          mockedMapResponse('', '', ''),
          mockedManualCriteria(item),
          'true',
          'aaa',
          'bbb'
        )
      ).not.toBeNull();
    });
  });
});
