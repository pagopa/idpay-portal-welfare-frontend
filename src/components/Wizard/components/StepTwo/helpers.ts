import { Dispatch, SetStateAction } from 'react';
import { AdmissionCriteriaModel, AvailableCriteria } from '../../../../model/AdmissionCriteria';
import { AutomatedCriteriaItem } from '../../../../model/Initiative';
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

export const updateInitialAutomatedCriteriaOnSelector = (
  automatedCriteria: Array<AutomatedCriteriaItem>,
  responseData: Array<AvailableCriteria>
) => {
  const updatedResponseData: Array<AvailableCriteria> = [];
  automatedCriteria.forEach((a) => {
    responseData.forEach((r) => {
      if (a.code === r.code) {
        const criteria = {
          code: r.code,
          authority: r.authority,
          authorityLabel: r.authorityLabel,
          field: r.field,
          fieldLabel: r.fieldLabel,
          operator: a.operator ? a.operator : r.operator,
          checked: true,
          value: a.value ? a.value : r.value,
          value2: a.value2 ? a.value2 : r.value2,
        };
        // eslint-disable-next-line functional/immutable-data
        updatedResponseData.push(criteria);
      } else {
        const criteria = { ...r };
        // eslint-disable-next-line functional/immutable-data
        updatedResponseData.push(criteria);
      }
    });
  });
  return updatedResponseData;
};
