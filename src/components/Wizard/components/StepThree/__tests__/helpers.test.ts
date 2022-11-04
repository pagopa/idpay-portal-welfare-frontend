import {
  handleCriteriaToSubmit,
  setError,
  setErrorText,
  setFieldType,
  setFormControlDisplayProp,
  mapResponse,
  updateInitialAutomatedCriteriaOnSelector,
  mapCriteriaToSend,
} from '../helpers';
// import {FilterOperator} from "../../../../../utils/constants";
const setterFunction = jest.fn();
const mockedMapResponse = (stringOrUndefined: string | undefined) => {
  return [
    {
      authority: 'string',
      checked: true,
      code: stringOrUndefined,
      field: 'string',
      operator: 'string',
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
      expect(mapResponse(mockedMapResponse(item))).not.toBeNull();
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
  });
  test('updateInitialAutomatedCriteriaOnSelector', () => {
    expect(
      updateInitialAutomatedCriteriaOnSelector(
        mockedAutomatedCriteria,
        mockedSecondCriteriaParameter
      )
    ).toBeDefined();
  });
  test('mapCriteriaToSend', () => {
    mockedManualCriteriaoptions.forEach((item) => {
      expect(
        mapCriteriaToSend(mockedMapResponse('ISEE'), mockedManualCriteria(item))
      ).not.toBeNull();
      expect(mapCriteriaToSend(mockedMapResponse(''), mockedManualCriteria(item))).not.toBeNull();
    });
  });
});
