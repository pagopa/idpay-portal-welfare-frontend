import { Dispatch, SetStateAction } from 'react';
import { grey } from '@mui/material/colors';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { OrderDirectionEnum } from '../../../../api/generated/initiative/AutomatedCriteriaDTO';
import { ConfigBeneficiaryRuleArrayDTO } from '../../../../api/generated/initiative/ConfigBeneficiaryRuleArrayDTO';
import { AvailableCriteria } from '../../../../model/AdmissionCriteria';
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

export const mapResponse = (response: ConfigBeneficiaryRuleArrayDTO): Array<AvailableCriteria> =>
  // eslint-disable-next-line sonarjs/cognitive-complexity
  response.map((r) => {
    // eslint-disable-next-line no-prototype-builtins
    if (r.hasOwnProperty('code') && typeof r.code !== undefined) {
      switch (r.code) {
        case 'ISEE':
          return {
            authority: r.authority || '',
            checked: r.checked || false,
            code: r.code,
            operator: r.operator || 'EQ',
            field: 'ISEE',
            fieldLabel: i18n.t('components.wizard.stepThree.chooseCriteria.modal.isee.fieldLabel'),
            authorityLabel: i18n.t(
              'components.wizard.stepThree.chooseCriteria.modal.isee.authorityLabel'
            ),
            value: '',
            value2: '',
          };
        case 'BIRTHDATE':
          return {
            authority: r.authority || '',
            checked: r.checked || false,
            code: r.code,
            operator: r.operator || 'EQ',
            field: r.field?.toLowerCase() || '',
            fieldLabel: i18n.t(
              'components.wizard.stepThree.chooseCriteria.modal.birthDate.fieldLabel'
            ),
            authorityLabel: i18n.t(
              'components.wizard.stepThree.chooseCriteria.modal.birthDate.authorityLabel'
            ),
            value: '',
            value2: '',
          };
        case 'RESIDENCE':
          return {
            authority: r.authority || '',
            checked: r.checked || false,
            code: r.code,
            operator: r.operator || 'EQ',
            field: r.field?.toLowerCase() || '',
            fieldLabel: i18n.t(
              'components.wizard.stepThree.chooseCriteria.modal.residency.fieldLabel'
            ),
            authorityLabel: i18n.t(
              'components.wizard.stepThree.chooseCriteria.modal.residency.authorityLabel'
            ),
            value: '',
            value2: '',
          };
        default:
          return {
            authority: '',
            checked: false,
            code: '',
            operator: 'EQ',
            field: '',
            fieldLabel: '',
            authorityLabel: '',
            value: '',
            value2: '',
          };
      }
    } else {
      return {
        authority: '',
        checked: false,
        code: '',
        operator: 'EQ',
        field: '',
        fieldLabel: '',
        authorityLabel: '',
        value: '',
        value2: '',
      };
    }
  });

const mapIseeTypes = (
  iseeTypes: Array<IseeTypologyEnum | string>
): Array<{ value: IseeTypologyEnum; label: string }> =>
  iseeTypes.map((item) => {
    switch (item) {
      case IseeTypologyEnum.Dottorato:
        return {
          value: IseeTypologyEnum.Dottorato,
          label: i18n.t('components.wizard.stepThree.chooseCriteria.form.iseeDottorato'),
        };
      case IseeTypologyEnum.Minorenne:
        return {
          value: IseeTypologyEnum.Minorenne,
          label: i18n.t('components.wizard.stepThree.chooseCriteria.form.iseeMinorenne'),
        };
      case IseeTypologyEnum.Ordinario:
        return {
          value: IseeTypologyEnum.Ordinario,
          label: i18n.t('components.wizard.stepThree.chooseCriteria.form.iseeOrdinario'),
        };
      case IseeTypologyEnum.Residenziale:
        return {
          value: IseeTypologyEnum.Residenziale,
          label: i18n.t('components.wizard.stepThree.chooseCriteria.form.iseeResidenziale'),
        };
      case IseeTypologyEnum.SocioSanitario:
        return {
          value: IseeTypologyEnum.SocioSanitario,
          label: i18n.t('components.wizard.stepThree.chooseCriteria.form.iseeSocioSanitario'),
        };
      case IseeTypologyEnum.Universitario:
      default:
        return {
          value: IseeTypologyEnum.Universitario,
          label: i18n.t('components.wizard.stepThree.chooseCriteria.form.iseeUniversitario'),
        };
    }
  });

export const updateInitialAutomatedCriteriaOnSelector = (
  automatedCriteria: Array<AutomatedCriteriaItem>,
  responseData: Array<AvailableCriteria>,
  rankingEnabled: string | undefined
) => {
  const updatedResponseData: Array<AvailableCriteria> = [];
  // eslint-disable-next-line sonarjs/cognitive-complexity
  automatedCriteria.forEach((a) => {
    responseData.forEach((r) => {
      if (a.code === r.code) {
        const criteria = {
          code: r.code,
          authority: r.authority,
          authorityLabel: r.authorityLabel,
          field: a.field ? a.field : r.field,
          fieldLabel: r.fieldLabel,
          operator: a.operator ? a.operator : r.operator,
          checked: true,
          value: a.value ? a.value : r.value,
          value2: a.value2 ? a.value2 : r.value2,
          orderDirection:
            typeof rankingEnabled === 'string' && rankingEnabled === 'true'
              ? a.orderDirection
              : undefined,
          iseeTypes:
            Array.isArray(a.iseeTypes) && a.iseeTypes.length > 0
              ? [...mapIseeTypes(a.iseeTypes)]
              : undefined,
        };
        // eslint-disable-next-line functional/immutable-data
        updatedResponseData.push(criteria);
      }
    });
  });

  responseData.forEach((r) => {
    /* eslint-disable functional/no-let */
    let found = false;
    let i = 0;
    while (i < updatedResponseData.length && found === false) {
      if (r.code === updatedResponseData[i].code) {
        found = true;
      }
      i++;
    }
    if (!found) {
      // eslint-disable-next-line functional/immutable-data
      updatedResponseData.push({ ...r });
    }
  });
  return updatedResponseData;
};

export const setInitialOrderDirection = (
  rankingEnabled: string | undefined,
  orderDirection: OrderDirectionEnum | undefined
) => {
  if (typeof rankingEnabled === 'string' && rankingEnabled === 'true') {
    if (typeof orderDirection === 'string') {
      return orderDirection;
    } else {
      return OrderDirectionEnum.ASC;
    }
  } else {
    return undefined;
  }
};

// export const mapCriteriaToSend = (
//   automatedCriteria: Array<any>,
//   manualCriteria: Array<any>,
//   rankingEnabled: string | undefined,
//   apiKeyClientId: string | undefined,
//   apiKeyClientAssertion: string | undefined
// ) => {

export const mapCriteriaToSend = (
  automatedCriteria: Array<any>,
  manualCriteria: Array<any>,
  rankingEnabled: string | undefined
) => {
  const criteriaToSave: Array<AutomatedCriteriaItem> = [];

  automatedCriteria.forEach((c) => {
    if (c.checked === true && c.code !== 'ISEE') {
      const criteria = {
        authority: c.authority,
        code: c.code,
        field: c.field,
        operator: c.operator,
        value: c.value,
        value2: c.value2,
      };
      // eslint-disable-next-line functional/immutable-data
      criteriaToSave.push({ ...criteria });
    }
    if (c.checked === true && c.code === 'ISEE') {
      const criteria = {
        authority: c.authority,
        code: c.code,
        operator: c.operator,
        value: c.value,
        value2: c.value2,
        orderDirection: setInitialOrderDirection(rankingEnabled, c.orderDirection),
        iseeTypes: c.iseeTypes.map(
          (item: { value: IseeTypologyEnum; label: string }) => item.value
        ),
      };
      // eslint-disable-next-line functional/immutable-data
      criteriaToSave.push({ ...criteria });
    }
  });

  const manualCriteriaToSend: Array<{
    _type: string;
    description: string;
    value: Array<string> | boolean;
    code: string;
  }> = [];
  manualCriteria.forEach((m) => {
    // eslint-disable-next-line no-underscore-dangle
    if (m._type === 'boolean') {
      const criteria = {
        // eslint-disable-next-line no-underscore-dangle
        _type: m._type,
        description: m.description,
        value: m.boolValue,
        code: m.code,
      };
      // eslint-disable-next-line functional/immutable-data
      manualCriteriaToSend.push({ ...criteria });
      // eslint-disable-next-line no-underscore-dangle
    } else if (m._type === 'multi') {
      const multiValue: Array<string> = [];
      if (Array.isArray(m.multiValue)) {
        m.multiValue.forEach((m: { value: string }) => {
          // eslint-disable-next-line functional/immutable-data
          multiValue.push(m.value);
        });
      }

      const criteria = {
        // eslint-disable-next-line no-underscore-dangle
        _type: m._type,
        description: m.description,
        value: [...multiValue],
        code: m.code,
      };
      // eslint-disable-next-line functional/immutable-data
      manualCriteriaToSend.push({ ...criteria });
    }
  });

  return {
    // apiKeyClientId: criteriaToSave.length > 0 ? apiKeyClientId : undefined,
    // apiKeyClientAssertion: criteriaToSave.length > 0 ? apiKeyClientAssertion : undefined,
    automatedCriteria: [...criteriaToSave],
    selfDeclarationCriteria: [...manualCriteriaToSend],
  };
};

export const boxItemStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  alignItems: 'center',
  borderColor: grey.A200,
  borderStyle: 'solid',
  borderWidth: '1px',
  borderRadius: 2,
  my: 3,
  p: 3,
};

export enum IseeTypologyEnum {
  Corrente = 'CORRENTE',
  Ordinario = 'ORDINARIO',
  Minorenne = 'MINORENNE',
  Universitario = 'UNIVERSITARIO',
  SocioSanitario = 'SOCIOSANITARIO',
  Dottorato = 'DOTTORATO',
  Residenziale = 'RESIDENZIALE',
}
