import {
  AdditionalInfo,
  AutomatedCriteriaItem,
  GeneralInfo,
  automatedCriteria2AutomatedCriteriaItem,
  InitiativeAdditional2AdditionalInfo,
  initiativeGeneral2GeneralInfo,
  //   Initiative2Initiative,
  //   Initiative,
} from '../Initiative';
import { TypeEnum } from '../../api/generated/initiative/ChannelDTO';
import { ServiceScopeEnum } from '../../api/generated/initiative/InitiativeAdditionalDTO';
import { BeneficiaryTypeEnum } from '../../utils/constants';
// import { AccumulatedTypeEnum } from '../../api/generated/initiative/AccumulatedAmountDTO';

const mockedGeneralBody: GeneralInfo = {
  beneficiaryType: BeneficiaryTypeEnum.PF,
  beneficiaryKnown: 'false',
  budget: '8515',
  beneficiaryBudget: '801',
  rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
  rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
  startDate: new Date('2022-10-01T00:00:00.000Z'),
  endDate: new Date('2023-01-31T00:00:00.000Z'),
};

const mockedAdditionalInfo: AdditionalInfo = {
  initiativeOnIO: true,
  serviceName: 'newStepOneTest',
  serviceArea: ServiceScopeEnum.NATIONAL,
  serviceDescription: 'newStepOneTest',
  privacyPolicyUrl: 'http://test.it',
  termsAndConditions: 'http://test.it',
  assistanceChannels: [{ type: TypeEnum.web, contact: 'http://test.it' }],
};

const mockedAutomatedCriteria: AutomatedCriteriaItem = {
  authority: 'AUTH1',
  code: 'BIRTHDATE',
  field: 'year',
  operator: 'GT',
  value: '18',
  value2: '',
};

// const mockedInitiative: Initiative = {
//     initiativeId: '62e29002aac2e94cfa3763dd',
//     initiativeName: 'prova313',
//     organizationId: '2f63a151-da4e-4e1e-acf9-adecc0c4d727',
//     status: 'DRAFT',
//     creationDate: new Date('2022-07-28T13:32:50.002'),
//     updateDate: new Date('2022-08-09T08:35:36.516'),
//     generalInfo: {
//         beneficiaryType: BeneficiaryTypeEnum.PF,
//         beneficiaryKnown: 'false',
//         budget: '8515',
//         beneficiaryBudget: '801',
//         rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
//         rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
//         startDate: new Date('2022-10-01T00:00:00.000Z'),
//         endDate: new Date('2023-01-31T00:00:00.000Z'),
//     },
//     additionalInfo: {
//         initiativeOnIO: true,
//         serviceName: 'prova313',
//         serviceArea: ServiceScopeEnum.NATIONAL,
//         serviceDescription: 'newStepOneTest',
//         privacyPolicyUrl: 'http://test.it',
//         termsAndConditions: 'http://test.it',
//         assistanceChannels: [{ type: TypeEnum.web, contact: 'http://test.it' }],
//     },
//     beneficiaryRule: {
//         selfDeclarationCriteria: [],
//         automatedCriteria: [
//             {
//                 authority: 'AUTH1',
//                 code: 'BIRTHDATE',
//                 field: 'year',
//                 operator: 'GT',
//                 value: '18',
//             },
//             {
//                 authority: 'INPS',
//                 code: 'ISEE',
//                 field: 'ISEE',
//                 operator: 'GT',
//                 value: '40000',
//             },
//         ],
//     },
//     rewardRule: { _type: 'rewardValue', rewardValue: 1 },
//     trxRule: {
//         mccFilter: undefined,
//         rewardLimits: undefined,
//         threshold: undefined,
//         trxCount: undefined,
//         daysOfWeekIntervals: []
//     },
//     refundRule: {
//             accumulatedType: AccumulatedTypeEnum.BUDGET_EXHAUSTED,
//             refundThreshold: 10000,
//            identificationCode: 'test',
//            timeParameter: TimeTypeEnum.CLOSED },
//     }
// };

test('Test initiativeGeneral2GeneralInfo', () => {
  const generalInfo = initiativeGeneral2GeneralInfo(mockedGeneralBody);
  expect(generalInfo).toStrictEqual({
    beneficiaryType: BeneficiaryTypeEnum.PF,
    beneficiaryKnown: 'false',
    budget: '8515',
    beneficiaryBudget: '801',
    rankingStartDate: new Date('2022-09-01T00:00:00.000Z'),
    rankingEndDate: new Date('2022-09-30T00:00:00.000Z'),
    startDate: new Date('2022-10-01T00:00:00.000Z'),
    endDate: new Date('2023-01-31T00:00:00.000Z'),
  });
});

test('Test InitiativeAdditional2AdditionalInfo', () => {
  const additionalInfo = InitiativeAdditional2AdditionalInfo(mockedAdditionalInfo);
  expect(additionalInfo).toStrictEqual({
    initiativeOnIO: true,
    serviceName: 'newStepOneTest',
    serviceArea: ServiceScopeEnum.NATIONAL,
    serviceDescription: 'newStepOneTest',
    privacyPolicyUrl: 'http://test.it',
    termsAndConditions: 'http://test.it',
    assistanceChannels: [{ type: TypeEnum.web, contact: 'http://test.it' }],
  });
});

test('Test automatedCriteria2AutomatedCriteriaItem', () => {
  const automatedCriteria = automatedCriteria2AutomatedCriteriaItem(mockedAutomatedCriteria);
  expect(automatedCriteria).toStrictEqual({
    authority: 'AUTH1',
    code: 'BIRTHDATE',
    field: 'year',
    operator: 'GT',
    value: '18',
    value2: '',
  });
});

// test('Test initiative2Initiative', () => {
//   const initiative = Initiative2Initiative(mockedInitiative);
//   expect(initiative).toStrictEqual({
//     initiativeId: '62e29002aac2e94cfa3763dd',
//     initiativeName: 'prova313',
//     organizationId: '2f63a151-da4e-4e1e-acf9-adecc0c4d727',
//     status: 'DRAFT',
//     creationDate: new Date('2022-07-28T13:32:50.002'),
//     updateDate: new Date('2022-08-09T08:35:36.516'),
//     general: {
//       budget: 8515,
//       beneficiaryType: BeneficiaryTypeEnum.PF,
//       beneficiaryKnown: false,
//       beneficiaryBudget: 801,
//       startDate: new Date('2022-10-01'),
//       endDate: new Date('2023-01-31'),
//       rankingStartDate: new Date('2022-09-01'),
//       rankingEndDate: new Date('2022-09-30'),
//     },
//     additionalInfo: {
//       serviceIO: true,
//       serviceId: 'provaaaaa316',
//       serviceName: 'prova313',
//       serviceScope: ServiceScopeEnum.LOCAL,
//       description: 'culpa non sint',
//       privacyLink: 'https://www.google.it',
//       tcLink: 'https://www.google.it',
//       channels: [
//         {
//           type: TypeEnum.mobile,
//           contact: '336754625',
//         },
//       ],
//     },
//     beneficiaryRule: {
//       selfDeclarationCriteria: [],
//       automatedCriteria: [
//         {
//           authority: 'AUTH1',
//           code: 'BIRTHDATE',
//           field: 'year',
//           operator: 'GT',
//           value: '18',
//         },
//         {
//           authority: 'INPS',
//           code: 'ISEE',
//           field: 'ISEE',
//           operator: 'GT',
//           value: '40000',
//         },
//       ],
//     },
//   });
// });
