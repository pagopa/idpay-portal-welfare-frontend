import { Dispatch, SetStateAction } from 'react';
import { FilterOperator } from '../../../../utils/constants';

export const handleCriteriaToSubmit = (
  criteriaToSubmit: Array<{ code: string | undefined; dispatched: boolean }>,
  code: string | undefined
) => {
  const newCriteriaToSubmit: Array<{ code: string | undefined; dispatched: boolean }> = [];
  criteriaToSubmit.forEach((oC) => {
    if (oC.code !== code) {
      // eslint-disable-next-line functional/immutable-data
      newCriteriaToSubmit.push(oC);
    } else {
      // eslint-disable-next-line functional/immutable-data
      newCriteriaToSubmit.push({ code: oC.code, dispatched: true });
    }
  });
  // setCriteriaToSubmit([...newCriteriaToSubmit]);
  return newCriteriaToSubmit;
};

export const setError = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && Boolean(errorText);

export const setErrorText = (touched: boolean | undefined, errorText: string | undefined) =>
  touched && errorText;

export const setFieldType = (
  value: string | number,
  setterFunction: Dispatch<SetStateAction<string>>
) => {
  if (value === FilterOperator.IN || value === 6) {
    setterFunction('number');
  } else {
    setterFunction('hidden');
  }
};

export const setFormControlDisplayProp = (inputType: string) =>
  inputType === 'number' ? 'flex' : 'none';
