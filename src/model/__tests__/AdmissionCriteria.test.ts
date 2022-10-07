import { FilterOperator } from '../../utils/constants';
import {
  admissionCriteria2AdmissionCriteriaModel,
  availableCriteria2AvailableCriteriaModel,
  dateOfBirth2DateOfBirthModel,
  isee2IseeModel,
  residency2ResidencyModel,
} from '../AdmissionCriteria';

const mockedAdmissionCriteria = {
  code: 'BIRTHDATE',
  authority: 'AUTH1',
  field: 'year',
  operator: FilterOperator.EQ,
  checked: false,
};

const mockedAvailableCriteria = {
  authorityLabel: 'AUTH1',
  fieldLabel: 'Year',
  operator: FilterOperator.EQ,
  value: '20000',
  value2: '',
  code: '',
  authority: '',
};

const mockedDateOfBirth = {
  dateOfBirthSelect: 1,
  dateOfBirthRelationSelect: FilterOperator.EQ,
  dateOfBirthStartValue: '2001',
  dateOfBirthEndValue: '',
};

const mockedResidency = {
  residencySelect: 2,
  residencyRelationSelect: FilterOperator.EQ,
  residencyValue: 'Milano',
};

const mockedIsee = {
  iseeRelationSelect: FilterOperator.EQ,
  iseeStartValue: '10000',
  iseeEndValue: '',
};
test('Test admissionCriteria2AdmissionCriteriaModel', () => {
  const admission = admissionCriteria2AdmissionCriteriaModel(mockedAdmissionCriteria);
  expect(admission).toStrictEqual({
    code: 'BIRTHDATE',
    authority: 'AUTH1',
    field: 'year',
    operator: 'EQ',
    checked: false,
  });
});

test('Test availableCriteria2AvailableCriteriaModel', () => {
  const available = availableCriteria2AvailableCriteriaModel(mockedAvailableCriteria);
  expect(available).toStrictEqual({
    authorityLabel: 'AUTH1',
    fieldLabel: 'Year',
    operator: 'EQ',
    value: '20000',
    value2: '',
    code: '',
    authority: '',
  });
});

test('test dateOfBirth2DateOfBirthModel', () => {
  const birth = dateOfBirth2DateOfBirthModel(mockedDateOfBirth);
  expect(birth).toStrictEqual({
    dateOfBirthSelect: 1,
    dateOfBirthRelationSelect: 'EQ',
    dateOfBirthStartValue: '2001',
    dateOfBirthEndValue: '',
  });
});

test('test residency2ResidencyModel', () => {
  const residency = residency2ResidencyModel(mockedResidency);
  expect(residency).toStrictEqual({
    residencySelect: 2,
    residencyRelationSelect: 'EQ',
    residencyValue: 'Milano',
  });
});

test('test isee2IseeModel', () => {
  const isee = isee2IseeModel(mockedIsee);
  expect(isee).toStrictEqual({
    iseeRelationSelect: 'EQ',
    iseeStartValue: '10000',
    iseeEndValue: '',
  });
});
