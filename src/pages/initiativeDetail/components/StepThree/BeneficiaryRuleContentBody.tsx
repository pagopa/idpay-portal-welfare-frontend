/* eslint-disable complexity */
import { Box, Divider, Typography } from '@mui/material';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderDirectionEnum } from '../../../../api/generated/initiative/AutomatedCriteriaDTO';
import {
  AutomatedCriteriaItem,
  Initiative,
  ManualCriteriaItem,
} from '../../../../model/Initiative';
import { FilterOperator } from '../../../../utils/constants';
import { IseeTypologyEnum } from '../../../../components/Wizard/components/StepThree/helpers';

type Props = {
  initiativeDetail: Initiative;
};

const BeneficiaryRuleContentBody = ({ initiativeDetail }: Props) => {
  const { t } = useTranslation();

  const printAutomatedAdmissionCriteriaLabel = (code: string): string => {
    switch (code) {
      case 'BIRTHDATE':
        return t('pages.initiativeDetail.accordion.step3.content.birthDate');
      case 'ISEE':
        return t('pages.initiativeDetail.accordion.step3.content.isee');
      case 'RESIDENCE':
        return t('pages.initiativeDetail.accordion.step3.content.residency');
      default:
        return '';
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const printAutomatedCriteriaDataAsString = (automatedCriteria: AutomatedCriteriaItem): string => {
    // eslint-disable-next-line functional/no-let
    let dataAsString = '';
    const field = `pages.initiativeDetail.accordion.step3.content.${automatedCriteria.field}`;
    switch (automatedCriteria.code) {
      case 'BIRTHDATE':
        dataAsString = `${dataAsString}${t(field)} `;
        if (automatedCriteria.operator === FilterOperator.EQ) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.exact'
          )} ${automatedCriteria.value}`;
        } else if (automatedCriteria.operator === FilterOperator.GT) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.majorTo'
          )} ${automatedCriteria.value}`;
        } else if (automatedCriteria.operator === FilterOperator.LT) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.minorTo'
          )} ${automatedCriteria.value}`;
        } else if (automatedCriteria.operator === FilterOperator.GE) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.majorOrEqualTo'
          )} ${automatedCriteria.value}`;
        } else if (automatedCriteria.operator === FilterOperator.LE) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.minorOrEqualTo'
          )} ${automatedCriteria.value}`;
        } else if (automatedCriteria.operator === FilterOperator.BTW_CLOSED) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.between'
          )} ${automatedCriteria.value} ${t(
            'pages.initiativeDetail.accordion.step3.content.and'
          )} ${automatedCriteria.value2}`;
        }
        return dataAsString;
      case 'RESIDENCE':
        dataAsString = `${dataAsString}${t(field)} `;
        if (automatedCriteria.operator === FilterOperator.EQ) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.is'
          )} ${automatedCriteria.value}`;
        } else if (automatedCriteria.operator === FilterOperator.NOT_EQ) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.isNot'
          )} ${automatedCriteria.value}`;
        }
        return dataAsString;
      case 'ISEE':
        // eslint-disable-next-line functional/no-let
        let rankingOrderDirectionAsString = '';
        if (automatedCriteria.operator === FilterOperator.EQ) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.exact'
          )} ${automatedCriteria.value} €`;
        } else if (automatedCriteria.operator === FilterOperator.GT) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.majorTo'
          )} ${automatedCriteria.value} €`;
        } else if (automatedCriteria.operator === FilterOperator.LT) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.minorTo'
          )} ${automatedCriteria.value} €`;
        } else if (automatedCriteria.operator === FilterOperator.GE) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.majorOrEqualTo'
          )} ${automatedCriteria.value}`;
        } else if (automatedCriteria.operator === FilterOperator.LE) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.minorOrEqualTo'
          )} ${automatedCriteria.value} €`;
        } else if (automatedCriteria.operator === FilterOperator.BTW_CLOSED) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.between'
          )} ${automatedCriteria.value} € ${t(
            'pages.initiativeDetail.accordion.step3.content.and'
          )} ${automatedCriteria.value2} €`;
        }
        if (typeof automatedCriteria.orderDirection !== 'undefined') {
          if (automatedCriteria.orderDirection === OrderDirectionEnum.ASC) {
            rankingOrderDirectionAsString = t(
              'pages.initiativeDetail.accordion.step3.content.rankingAsc'
            );
          } else if (automatedCriteria.orderDirection === OrderDirectionEnum.DESC) {
            rankingOrderDirectionAsString = t(
              'pages.initiativeDetail.accordion.step3.content.rankingDesc'
            );
          }
        }
        return `${dataAsString} ${rankingOrderDirectionAsString}`;
      default:
        return '';
    }
  };

  const printIseeTypes = (item: AutomatedCriteriaItem): string => {
    // eslint-disable-next-line functional/no-let
    let dataAsString = '';
    item.iseeTypes?.forEach((it) => {
      switch (it) {
        case IseeTypologyEnum.Dottorato:
          dataAsString = `${dataAsString}, ${t(
            'pages.initiativeDetail.accordion.step3.content.iseeDottorato'
          )}`;
          break;
        case IseeTypologyEnum.Minorenne:
          dataAsString = `${dataAsString}, ${t(
            'pages.initiativeDetail.accordion.step3.content.iseeMinorenne'
          )}`;
          break;
        case IseeTypologyEnum.Ordinario:
          dataAsString = `${dataAsString}, ${t(
            'pages.initiativeDetail.accordion.step3.content.iseeOrdinario'
          )}`;
          break;
        case IseeTypologyEnum.Residenziale:
          dataAsString = `${dataAsString}, ${t(
            'pages.initiativeDetail.accordion.step3.content.iseeResidenziale'
          )}`;
          break;
        case IseeTypologyEnum.SocioSanitario:
          dataAsString = `${dataAsString}, ${t(
            'pages.initiativeDetail.accordion.step3.content.iseeSocioSanitario'
          )}`;
          break;
        case IseeTypologyEnum.Universitario:
          dataAsString = `${dataAsString}, ${t(
            'pages.initiativeDetail.accordion.step3.content.iseeUniversitario'
          )}`;
          break;
        default:
          dataAsString = `${dataAsString}, ''`;
      }
    });
    return dataAsString.length ? dataAsString : '-';
  };

  const printManualCriteriaAsString = (manualCriteria: ManualCriteriaItem): string => {
    // eslint-disable-next-line no-underscore-dangle
    const field = `pages.initiativeDetail.accordion.step3.content.${manualCriteria._type}`;
    // eslint-disable-next-line functional/no-let
    const multiValue: Array<string> = [];
    // eslint-disable-next-line no-underscore-dangle
    if (manualCriteria._type === 'multi' && Array.isArray(manualCriteria.multiValue)) {
      manualCriteria.multiValue.forEach((mv) => {
        // eslint-disable-next-line functional/immutable-data
        multiValue.push(mv.value);
      });
    }
    const multiValueStr = multiValue.join(`, `);
    return multiValueStr.length > 0
      ? `${t(field)} - ${manualCriteria.description} (${multiValueStr})`
      : `${t(field)} - ${manualCriteria.description}`;
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        rowGap: 2,
        pb: 2,
        px: 2,
      }}
    >
      <Divider sx={{ gridColumn: 'span 12', mb: 1 }} />
      <Typography variant="body1" sx={{ gridColumn: 'span 12', fontWeight: 600 }}>
        {t('pages.initiativeDetail.accordion.step3.content.admissionCriteria')}
      </Typography>
      {initiativeDetail.beneficiaryRule.automatedCriteria.map((at) =>
        at.code !== 'ISEE' ? (
          <Fragment key={at.code}>
            <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
              {typeof at.code === 'string' && printAutomatedAdmissionCriteriaLabel(at.code)}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {printAutomatedCriteriaDataAsString(at)}
            </Typography>
          </Fragment>
        ) : (
          <Fragment key={at.code}>
            <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
              {typeof at.code === 'string' && printAutomatedAdmissionCriteriaLabel(at.code)}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {printAutomatedCriteriaDataAsString(at)}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
              {t('pages.initiativeDetail.accordion.step3.content.typology')}
            </Typography>
            <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
              {printIseeTypes(at).replace(',', '')}
            </Typography>
          </Fragment>
        )
      )}
      {initiativeDetail.beneficiaryRule.selfDeclarationCriteria.map((sd) => (
        <Fragment data-testId={`selfDeclarationCriteria-${sd.code}`} key={sd.code}>
          <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
            {`${t('pages.initiativeDetail.accordion.step3.content.manual')} ${sd.code}`}
          </Typography>
          <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
            {printManualCriteriaAsString(sd)}
          </Typography>
        </Fragment>
      ))}
      {initiativeDetail.beneficiaryRule.apiKeyClientId &&
        initiativeDetail.beneficiaryRule.apiKeyClientAssertion && (
          <>
            <Typography variant="body1" sx={{ gridColumn: 'span 12', fontWeight: 600, mt: 1 }}>
              {t('pages.initiativeDetail.accordion.step3.content.apiClientTitle')}
            </Typography>
            <Fragment>
              <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                {t('pages.initiativeDetail.accordion.step3.content.apiKeyClientId')}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  gridColumn: 'span 7',
                  fontWeight: 600,
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {initiativeDetail.beneficiaryRule.apiKeyClientId}
              </Typography>
            </Fragment>
            <Fragment>
              <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                {t('pages.initiativeDetail.accordion.step3.content.apiKeyClientAssertion')}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  gridColumn: 'span 7',
                  fontWeight: 600,
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {initiativeDetail.beneficiaryRule.apiKeyClientAssertion}
              </Typography>
            </Fragment>
          </>
        )}
    </Box>
  );
};

export default BeneficiaryRuleContentBody;
