/* eslint-disable react/jsx-no-bind */
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { AutomatedCriteriaDtoOrderDirectionEnum } from '../../../../api/generated/initiative/apiClient';
import { IseeTypologyEnum } from '../../../../components/Wizard/components/StepThree/helpers';
import { mockedInitiative } from '../../../../model/__tests__/Initiative.test';
import { createStore } from '../../../../redux/store';
import { FilterOperator } from '../../../../utils/constants';
import BeneficiaryRuleContentBody from '../StepThree/BeneficiaryRuleContentBody';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<BeneficiaryRuleContentBody />', (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();

  it('renders without crashing', () => {
    // eslint-disable-next-line functional/immutable-data
    window.scrollTo = jest.fn();
  });

  test('should render with props', async () => {
    render(
      <Provider store={store}>
        <BeneficiaryRuleContentBody initiativeDetail={mockedInitiative} />
      </Provider>
    );
  });

  test('should cover btw_closed and ranking direction branches for automated criteria', () => {
    const initiativeWithAutomatedBranches = {
      ...mockedInitiative,
      beneficiaryRule: {
        ...mockedInitiative.beneficiaryRule,
        automatedCriteria: [
          {
            authority: 'AUTH1',
            code: 'BIRTHDATE',
            field: 'year',
            operator: FilterOperator.BTW_CLOSED,
            value: '18',
            value2: '65',
          },
          {
            authority: 'INPS',
            code: 'ISEE',
            field: 'ISEE',
            operator: FilterOperator.BTW_CLOSED,
            value: '1000',
            value2: '2000',
            orderDirection: AutomatedCriteriaDtoOrderDirectionEnum.ASC,
            iseeTypes: [],
          },
          {
            authority: 'INPS',
            code: 'ISEE',
            field: 'ISEE',
            operator: FilterOperator.EQ,
            value: '3000',
            orderDirection: AutomatedCriteriaDtoOrderDirectionEnum.DESC,
            iseeTypes: [],
          },
        ],
      },
    };

    const { container } = render(
      <Provider store={store}>
        <BeneficiaryRuleContentBody initiativeDetail={initiativeWithAutomatedBranches} />
      </Provider>
    );

    const text = container.textContent ?? '';
    expect(
      text.split('pages.initiativeDetail.accordion.step3.content.between').length - 1
    ).toBeGreaterThanOrEqual(2);
    expect(container).toHaveTextContent('pages.initiativeDetail.accordion.step3.content.rankingAsc');
    expect(container).toHaveTextContent('pages.initiativeDetail.accordion.step3.content.rankingDesc');
  });

  test('should cover all isee typologies and default branch', () => {
    const initiativeWithIseeTypes = {
      ...mockedInitiative,
      beneficiaryRule: {
        ...mockedInitiative.beneficiaryRule,
        automatedCriteria: [
          {
            authority: 'INPS',
            code: 'ISEE',
            field: 'ISEE',
            operator: FilterOperator.EQ,
            value: '1000',
            iseeTypes: [
              IseeTypologyEnum.Minorenne,
              IseeTypologyEnum.Residenziale,
              IseeTypologyEnum.SocioSanitario,
              IseeTypologyEnum.Universitario,
              'UNKNOWN_TYPE',
            ],
          },
        ],
      },
    };

    const { container } = render(
      <Provider store={store}>
        <BeneficiaryRuleContentBody initiativeDetail={initiativeWithIseeTypes} />
      </Provider>
    );

    expect(container).toHaveTextContent('pages.initiativeDetail.accordion.step3.content.iseeMinorenne');
    expect(container).toHaveTextContent('pages.initiativeDetail.accordion.step3.content.iseeResidenziale');
    expect(container).toHaveTextContent('pages.initiativeDetail.accordion.step3.content.iseeSocioSanitario');
    expect(container).toHaveTextContent('pages.initiativeDetail.accordion.step3.content.iseeUniversitario');
    expect(container).toHaveTextContent("''");
  });

  test('should print manual multi criteria values when provided', () => {
    const initiativeWithMultiValue = {
      ...mockedInitiative,
      beneficiaryRule: {
        ...mockedInitiative.beneficiaryRule,
        selfDeclarationCriteria: [
          {
            _type: 'multi',
            description: 'manual description',
            code: 'MULTI_1',
            multiValue: [{ value: 'A' }, { value: 'B' }],
          },
        ],
      },
    };

    const { container } = render(
      <Provider store={store}>
        <BeneficiaryRuleContentBody initiativeDetail={initiativeWithMultiValue} />
      </Provider>
    );

    expect(container).toHaveTextContent(
      'pages.initiativeDetail.accordion.step3.content.multi - manual description (A, B)'
    );
  });
});
