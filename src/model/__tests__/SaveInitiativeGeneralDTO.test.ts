import { BeneficiaryTypeEnum } from '../../utils/constants';
import { saveInitiativeGeneral2SaveInitiativeGeneralDTO } from '../saveInitiativeGeneralDTO';

const mockedSaveInitiativeGeneral = {
  beneficiaryType: BeneficiaryTypeEnum.PF,
  beneficiaryKnown: false,
  budget: 8515,
  name: '',
  beneficiaryBudget: 801,
  rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
  rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
  startDate: new Date('2022-10-01T00:00:00.000Z'),
  endDate: new Date('2023-01-31T00:00:00.000Z'),
};

test('Test saveInitiativeGeneral2SaveInitiativeGeneralDTO', () => {
  const saveInitiativeGeneral = saveInitiativeGeneral2SaveInitiativeGeneralDTO(
    mockedSaveInitiativeGeneral
  );
  expect(saveInitiativeGeneral).toStrictEqual({
    beneficiaryType: BeneficiaryTypeEnum.PF,
    beneficiaryKnown: false,
    budget: 8515,
    name: '',
    beneficiaryBudget: 801,
    rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
    rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
    startDate: new Date('2022-10-01T00:00:00.000Z'),
    endDate: new Date('2023-01-31T00:00:00.000Z'),
  });
});
