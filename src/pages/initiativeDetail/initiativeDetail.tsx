import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Divider,
  Typography,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { Fragment, SyntheticEvent, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useHistory } from 'react-router-dom';
import { useInitiative } from '../../hooks/useInitiative';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import { useAppSelector } from '../../redux/hooks';
import ROUTES from '../../routes';
import {
  AutomatedCriteriaItem,
  DaysOfWeekInterval,
  ManualCriteriaItem,
  RefundRule,
  RewardLimit,
  RewardRule,
} from '../../model/Initiative';
import { FilterOperator } from '../../utils/constants';
import { MccFilterDTO } from '../../api/generated/initiative/MccFilterDTO';

// eslint-disable-next-line sonarjs/cognitive-complexity
const InitiativeDetail = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useInitiative();
  const initiativeDetail = useAppSelector(initiativeSelector);
  const [expanded, setExpanded] = useState<string | boolean>(false);

  const handleChange = (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const accordionSx = {
    borderRadius: 4,
    boxShadow:
      '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
    my: 2,
  };

  const printAssistanceChannelLabel = (type: string): string => {
    switch (type) {
      case 'web':
        return t('pages.initiativeDetail.accordion.step1.content.webUrl');
      case 'mobile':
        return t('pages.initiativeDetail.accordion.step1.content.mobile');
      case 'email':
        return t('pages.initiativeDetail.accordion.step1.content.email');
      default:
        return '';
    }
  };

  const printAutomatedAdmissionCriteriaLabel = (code: string): string => {
    switch (code) {
      case 'BIRTHDATE':
        return t('pages.initiativeDetail.accordion.step3.content.birthdate');
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
        } else if (automatedCriteria.operator === FilterOperator.BTW_OPEN) {
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
        } else if (automatedCriteria.operator === FilterOperator.BTW_OPEN) {
          dataAsString = `${dataAsString}${t(
            'pages.initiativeDetail.accordion.step3.content.between'
          )} ${automatedCriteria.value} € ${t(
            'pages.initiativeDetail.accordion.step3.content.and'
          )} ${automatedCriteria.value2} €`;
        }
        return dataAsString;
      default:
        return '';
    }
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

  const printRewardRuleAsString = (rewardRule: RewardRule): string =>
    `${t('pages.initiativeDetail.accordion.step4.content.rewardRuleFixed')} ${
      rewardRule.rewardValue
    }%`;

  const printMccFilterAsString = (mccFilter: MccFilterDTO): string => {
    // eslint-disable-next-line functional/no-let
    let dataAsString = '';
    if (mccFilter.allowedList) {
      dataAsString = `${t('pages.initiativeDetail.accordion.step4.content.everybodyExceptItem')}`;
    } else {
      dataAsString = `${t('pages.initiativeDetail.accordion.step4.content.nobodyExceptItem')}`;
    }
    const mccList = Array.isArray(mccFilter.values) ? mccFilter.values.join(', ') : '';
    return `${dataAsString} ${mccList}`;
  };

  const printTimeLimitAsString = (rewardLimit: RewardLimit): string => {
    const freqLower = rewardLimit.frequency.toLowerCase();
    const freqPlaceholder = `pages.initiativeDetail.accordion.step4.content.${freqLower}`;
    return `${t(freqPlaceholder)} ${rewardLimit.rewardLimit} €`;
  };

  const printTransactionTimeAsString = (daysOfWeekInterval: DaysOfWeekInterval): string => {
    const dayLower = daysOfWeekInterval.daysOfWeek.toLowerCase();
    const dayPlaceholder = `pages.initiativeDetail.accordion.step4.content.${dayLower}`;
    return `${t(dayPlaceholder)} ${t(
      'pages.initiativeDetail.accordion.step4.content.timeInterval',
      { minTime: daysOfWeekInterval.startTime, maxTime: daysOfWeekInterval.endTime }
    )}`;
  };

  const printRefundParameterAsString = (refundRule: RefundRule): string => {
    // eslint-disable-next-line functional/no-let
    let dataAsString = '';
    dataAsString = 'a';
    if (refundRule.reimbursmentQuestionGroup === 'true') {
      if (refundRule.accumulatedAmount === 'THRESHOLD_REACHED') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.certainThreshold')}`;
      } else if (refundRule.accumulatedAmount === 'BUDGET_EXHAUSTED') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.balanceExhausted')}`;
      }
    } else {
      if (refundRule.timeParameter === 'CLOSED') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.initiativeDone')}`;
      } else if (refundRule.timeParameter === 'DAILY') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.everyDay')}`;
      } else if (refundRule.timeParameter === 'WEEKLY') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.everyWeek')}`;
      } else if (refundRule.timeParameter === 'MONTHLY') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.everyMonth')}`;
      } else if (refundRule.timeParameter === 'QUARTERLY') {
        dataAsString = `${t('pages.initiativeDetail.accordion.step5.content.everyThreeMonths')}`;
      }
    }
    return dataAsString;
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'auto',
        width: '100%',
        alignContent: 'start',
        justifyContent: 'space-between',
        rowGap: 4,
      }}
    >
      <Box sx={{ display: 'grid', gridColumn: 'span 12' }}>
        <Breadcrumbs aria-label="breadcrumb">
          <ButtonNaked
            component="button"
            onClick={() => history.replace(ROUTES.HOME)}
            startIcon={<ArrowBackIcon />}
            sx={{ color: 'primary.main' }}
            weight="default"
          >
            {t('breadcrumbs.exit')}
          </ButtonNaked>
          <Typography color="text.primary" variant="body2">
            {t('breadcrumbs.initiatives')}
          </Typography>
          <Typography color="text.primary" variant="body2">
            {initiativeDetail.additionalInfo.serviceName}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {t('breadcrumbs.initiativeDetail')}
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridColumn: 'span 12',
        }}
      >
        <Box sx={{ display: 'grid', gridColumn: 'span 10', rowGap: 2 }}>
          <Typography variant="h4"> {initiativeDetail.additionalInfo.serviceName}</Typography>
          <Typography variant="body1">{t('pages.initiativeDetail.subtitle')}</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 2' }}>{initiativeDetail.status}</Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridColumn: 'span 12',
        }}
      >
        <Box sx={{ display: 'grid', gridColumn: 'span 12' }}>
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
            sx={{
              ...accordionSx,
              '&:first-of-type': {
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                marginTop: 0,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Box sx={{ flexDirection: 'column', px: 2 }}>
                <Typography variant="subtitle2" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step1.heading')}
                </Typography>
                <Typography variant="h6" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step1.title')}
                </Typography>
                {/* <Typography variant="body2" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step1.description')}
                </Typography> */}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
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
                  {t('pages.initiativeDetail.accordion.step1.content.description')}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gridColumn: 'span 12',
                    rowGap: 2,
                    columnGap: 3,
                    alignItems: 'start',
                  }}
                >
                  <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                    {t('pages.initiativeDetail.accordion.step1.content.serviceDeliver')}
                  </Typography>
                  <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                    {initiativeDetail.additionalInfo.initiativeOnIO
                      ? t('pages.initiativeDetail.accordion.step1.content.serviceOnIO')
                      : t('pages.initiativeDetail.accordion.step1.content.serviceNotOnIO')}
                  </Typography>

                  <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                    {t('pages.initiativeDetail.accordion.step1.content.serviceName')}
                  </Typography>
                  <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                    {initiativeDetail.additionalInfo.serviceName}
                  </Typography>

                  <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                    {t('pages.initiativeDetail.accordion.step1.content.serviceArea')}
                  </Typography>
                  <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                    {initiativeDetail.additionalInfo.serviceArea === 'NATIONAL'
                      ? t('pages.initiativeDetail.accordion.step1.content.serviceAreaNational')
                      : t('pages.initiativeDetail.accordion.step1.content.serviceAreaLocal')}
                  </Typography>

                  <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                    {t('pages.initiativeDetail.accordion.step1.content.serviceDescription')}
                  </Typography>
                  <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                    {initiativeDetail.additionalInfo.serviceDescription}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ gridColumn: 'span 12', fontWeight: 600, mt: 1 }}>
                  {t('pages.initiativeDetail.accordion.step1.content.legalInfo')}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gridColumn: 'span 12',
                    rowGap: 2,
                    columnGap: 3,
                    alignItems: 'start',
                  }}
                >
                  <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                    {t('pages.initiativeDetail.accordion.step1.content.privacyPolicyURL')}
                  </Typography>
                  <ButtonNaked
                    size="medium"
                    href={initiativeDetail.additionalInfo.privacyPolicyUrl}
                    target="_blank"
                    sx={{ color: 'primary.main', gridColumn: 'span 7', justifyContent: 'start' }}
                    weight="default"
                  >
                    {initiativeDetail.additionalInfo.privacyPolicyUrl}
                  </ButtonNaked>
                  <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                    {t('pages.initiativeDetail.accordion.step1.content.tosURL')}
                  </Typography>
                  <ButtonNaked
                    size="medium"
                    href={initiativeDetail.additionalInfo.termsAndConditions}
                    target="_blank"
                    sx={{ color: 'primary.main', gridColumn: 'span 7', justifyContent: 'start' }}
                    weight="default"
                  >
                    {initiativeDetail.additionalInfo.termsAndConditions}
                  </ButtonNaked>
                </Box>
                <Typography variant="body1" sx={{ gridColumn: 'span 12', fontWeight: 600, mt: 1 }}>
                  {t('pages.initiativeDetail.accordion.step1.content.assistanceChannels')}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gridColumn: 'span 12',
                    rowGap: 2,
                    columnGap: 3,
                    alignItems: 'start',
                  }}
                >
                  {initiativeDetail.additionalInfo.assistanceChannels.map((a, index) => (
                    <Fragment key={index}>
                      <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                        {printAssistanceChannelLabel(a.type)}
                      </Typography>
                      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                        {a.contact}
                      </Typography>
                    </Fragment>
                  ))}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
            sx={accordionSx}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Box sx={{ flexDirection: 'column', px: 2 }}>
                <Typography variant="subtitle2" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step2.heading')}
                </Typography>
                <Typography variant="h6" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step2.title')}
                </Typography>
                {/* <Typography variant="body2" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step2.description')}
                </Typography> */}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
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
                <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                  {t('pages.initiativeDetail.accordion.step2.content.beneficiaryType')}
                </Typography>
                <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                  {initiativeDetail.generalInfo.beneficiaryType === 'PF'
                    ? t('pages.initiativeDetail.accordion.step2.content.person')
                    : t('pages.initiativeDetail.accordion.step2.content.family')}
                </Typography>

                <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                  {t('pages.initiativeDetail.accordion.step2.content.beneficiaryknown')}
                </Typography>
                <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                  {initiativeDetail.generalInfo.beneficiaryKnown === 'true'
                    ? t('pages.initiativeDetail.accordion.step2.content.taxCodeList')
                    : t('pages.initiativeDetail.accordion.step2.content.manualSelection')}
                </Typography>

                <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                  {t('pages.initiativeDetail.accordion.step2.content.budget')}
                </Typography>
                <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                  {`${initiativeDetail.generalInfo.budget} €`}
                </Typography>

                <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                  {t('pages.initiativeDetail.accordion.step2.content.beneficiaryBudget')}
                </Typography>
                <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                  {`${initiativeDetail.generalInfo.beneficiaryBudget} €`}
                </Typography>

                <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                  {t('pages.initiativeDetail.accordion.step2.content.rankingStartDate')}
                </Typography>
                <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                  {typeof initiativeDetail.generalInfo.rankingStartDate === 'object'
                    ? initiativeDetail.generalInfo.rankingStartDate?.toLocaleDateString('fr-BE')
                    : '-'}
                </Typography>

                <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                  {t('pages.initiativeDetail.accordion.step2.content.rankingEndDate')}
                </Typography>
                <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                  {typeof initiativeDetail.generalInfo.rankingEndDate === 'object'
                    ? initiativeDetail.generalInfo.rankingEndDate?.toLocaleDateString('fr-BE')
                    : '-'}
                </Typography>

                <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                  {t('pages.initiativeDetail.accordion.step2.content.startDate')}
                </Typography>
                <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                  {typeof initiativeDetail.generalInfo.startDate === 'object'
                    ? initiativeDetail.generalInfo.startDate?.toLocaleDateString('fr-BE')
                    : '-'}
                </Typography>

                <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                  {t('pages.initiativeDetail.accordion.step2.content.endDate')}
                </Typography>
                <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                  {typeof initiativeDetail.generalInfo.endDate === 'object'
                    ? initiativeDetail.generalInfo.endDate?.toLocaleDateString('fr-BE')
                    : '-'}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
            sx={accordionSx}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Box sx={{ flexDirection: 'column', px: 2 }}>
                <Typography variant="subtitle2" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step3.heading')}
                </Typography>
                <Typography variant="h6" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step3.title')}
                </Typography>
                {/* <Typography variant="body2" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step3.description')}
                </Typography> */}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
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
                {initiativeDetail.generalInfo.beneficiaryKnown === 'true' ? (
                  <span>FILE INFO</span>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ gridColumn: 'span 12', fontWeight: 600 }}>
                      {t('pages.initiativeDetail.accordion.step3.content.admissionCriteria')}
                    </Typography>
                    {initiativeDetail.beneficiaryRule.automatedCriteria.map((at) => (
                      <Fragment key={at.code}>
                        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                          {typeof at.code === 'string' &&
                            printAutomatedAdmissionCriteriaLabel(at.code)}
                        </Typography>
                        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                          {printAutomatedCriteriaDataAsString(at)}
                        </Typography>
                      </Fragment>
                    ))}
                    {initiativeDetail.beneficiaryRule.selfDeclarationCriteria.map((sd) => (
                      <Fragment key={sd.code}>
                        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                          {`${t('pages.initiativeDetail.accordion.step3.content.manual')} ${
                            sd.code
                          }`}
                        </Typography>
                        <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                          {printManualCriteriaAsString(sd)}
                        </Typography>
                      </Fragment>
                    ))}
                  </>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel4'}
            onChange={handleChange('panel4')}
            sx={accordionSx}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Box sx={{ flexDirection: 'column', px: 2 }}>
                <Typography variant="subtitle2" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step4.heading')}
                </Typography>
                <Typography variant="h6" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step4.title')}
                </Typography>
                {/* <Typography variant="body2" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step4.description')}
                </Typography> */}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
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
                <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                  {t('pages.initiativeDetail.accordion.step4.content.percentageRecognized')}
                </Typography>
                <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                  {printRewardRuleAsString(initiativeDetail.rewardRule)}
                </Typography>

                {initiativeDetail.trxRule.threshold && (
                  <Fragment>
                    <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                      {t('pages.initiativeDetail.accordion.step4.content.spentLimit')}
                    </Typography>
                    <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                      {t('pages.initiativeDetail.accordion.step4.content.threshold', {
                        minValue: initiativeDetail.trxRule.threshold.from,
                        maxValue: initiativeDetail.trxRule.threshold.to,
                      })}
                    </Typography>
                  </Fragment>
                )}

                {initiativeDetail.trxRule.mccFilter && (
                  <Fragment>
                    <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                      {t('pages.initiativeDetail.accordion.step4.content.mcc')}
                    </Typography>
                    <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                      {printMccFilterAsString(initiativeDetail.trxRule.mccFilter)}
                    </Typography>
                  </Fragment>
                )}

                {initiativeDetail.trxRule.trxCount && (
                  <Fragment>
                    <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                      {t('pages.initiativeDetail.accordion.step4.content.transactionNumber')}
                    </Typography>
                    <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                      {t(
                        'pages.initiativeDetail.accordion.step4.content.transactionNumberInterval',
                        {
                          minValue: initiativeDetail.trxRule.trxCount.from,
                          maxValue: initiativeDetail.trxRule.trxCount.to,
                        }
                      )}
                    </Typography>
                  </Fragment>
                )}

                {initiativeDetail.trxRule.rewardLimits?.map((rl, index) =>
                  typeof rl.rewardLimit === 'number' ? (
                    <Fragment key={index}>
                      {index === 0 ? (
                        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                          {t('pages.initiativeDetail.accordion.step4.content.timeLimit')}
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}></Typography>
                      )}
                      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                        {printTimeLimitAsString(rl)}
                      </Typography>
                    </Fragment>
                  ) : null
                )}

                {initiativeDetail.trxRule.daysOfWeekIntervals.map((dw, index) =>
                  dw.startTime !== '' && dw.endTime !== '' ? (
                    <Fragment key={index}>
                      {index === 0 ? (
                        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                          {t('pages.initiativeDetail.accordion.step4.content.transactionTime')}
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ gridColumn: 'span 3' }}></Typography>
                      )}
                      <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                        {printTransactionTimeAsString(dw)}
                      </Typography>
                    </Fragment>
                  ) : null
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel5'}
            onChange={handleChange('panel5')}
            sx={{
              ...accordionSx,
              '&:last-of-type': {
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls="panel5bh-content"
              id="panel5bh-header"
            >
              <Box sx={{ flexDirection: 'column', px: 2 }}>
                <Typography variant="subtitle2" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step5.heading')}
                </Typography>
                <Typography variant="h6" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step5.title')}
                </Typography>
                {/* <Typography variant="body2" sx={{ width: '100%', my: 1 }}>
                  {t('pages.initiativeDetail.accordion.step5.description')}
                </Typography> */}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
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
                <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                  {t('pages.initiativeDetail.accordion.step5.content.disbursement')}
                </Typography>
                <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                  {initiativeDetail.refundRule.reimbursmentQuestionGroup === 'true'
                    ? t('pages.initiativeDetail.accordion.step5.content.accumulatedAmount')
                    : t('pages.initiativeDetail.accordion.step5.content.timeParameter')}
                </Typography>

                <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                  {t('pages.initiativeDetail.accordion.step5.content.timeParam')}
                </Typography>
                <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                  {printRefundParameterAsString(initiativeDetail.refundRule)}
                </Typography>

                {initiativeDetail.refundRule.reimbursmentQuestionGroup === 'true' &&
                initiativeDetail.refundRule.accumulatedAmount === 'THRESHOLD_REACHED' ? (
                  <Fragment>
                    <Typography variant="body2" sx={{ gridColumn: 'span 3' }}>
                      {t('pages.initiativeDetail.accordion.step5.content.refundThreshold')}
                    </Typography>
                    <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                      {`${initiativeDetail.refundRule.reimbursementThreshold} €`}
                    </Typography>
                  </Fragment>
                ) : null}

                {initiativeDetail.refundRule.additionalInfo !== '' && (
                  <Fragment>
                    <Typography
                      variant="body1"
                      sx={{ gridColumn: 'span 12', fontWeight: 600, mt: 1 }}
                    >
                      {t('pages.initiativeDetail.accordion.step5.content.addtitionalInfo')}
                    </Typography>
                    <Typography variant="body2" sx={{ gridColumn: 'span 3', pr: 3 }}>
                      {t('pages.initiativeDetail.accordion.step5.content.idCode')}
                    </Typography>
                    <Typography variant="body2" sx={{ gridColumn: 'span 7', fontWeight: 600 }}>
                      {initiativeDetail.refundRule.additionalInfo}
                    </Typography>
                  </Fragment>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
};

export default InitiativeDetail;
