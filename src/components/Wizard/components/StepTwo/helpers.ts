import { Dispatch, SetStateAction } from 'react';
import { AdmissionCriteriaModel, AvailableCriteria } from '../../../../model/AdmissionCriteria';
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
  if (value === FilterOperator.BTW_CLOSED) {
    setterFunction('number');
  } else {
    setterFunction('hidden');
  }
};

export const setFormControlDisplayProp = (inputType: string) =>
  inputType === 'number' ? 'flex' : 'none';

export const mapResponse = (response: Array<AdmissionCriteriaModel>): Array<AvailableCriteria> =>
  response.map((r) => {
    if (r.code === 'ISEE') {
      return {
        ...r,
        field: 'ISEE',
        fieldLabel: 'ISEE',
        authorityLabel: 'INPS',
        value: '',
        value2: '',
      };
    } else if (r.code === 'BIRTHDATE') {
      return {
        ...r,
        fieldLabel: 'Data di nascita',
        authorityLabel: "Ministero dell'interno",
        value: '',
        value2: '',
      };
    } else if (r.code === 'RESIDENCE') {
      return {
        ...r,
        fieldLabel: 'Residenza',
        authorityLabel: "Ministero dell'interno",
        value: '',
        value2: '',
      };
    } else {
      return {
        ...r,
        fieldLabel: '',
        authorityLabel: '',
        value: '',
        value2: '',
      };
    }
  });
