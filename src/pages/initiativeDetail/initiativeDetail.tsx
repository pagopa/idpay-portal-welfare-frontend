import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Button,
  Typography,
  Chip,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { SyntheticEvent, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useHistory } from 'react-router-dom';
import { useInitiative } from '../../hooks/useInitiative';
import { initiativeSelector } from '../../redux/slices/initiativeSlice';
import { useAppSelector } from '../../redux/hooks';
import ROUTES from '../../routes';
import SummaryContentBody from './components/Summary/SummaryContentBody';
import AdditionalInfoContentBody from './components/StepOne/AdditionalInfoContentBody';
import GeneralInfoContentBody from './components/StepTwo/GeneralInfoContentBody';
import BeneficiaryListContentBody from './components/StepThree/BeneficiaryListContentBody';
import BeneficiaryRuleContentBody from './components/StepThree/BeneficiaryRuleContentBody';
import ShopRuleContentBody from './components/StepFour/ShopRuleContentBody';
import RefundRuleContentBody from './components/StepFive/RefundRuleContentBody';

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

  const renderInitiativeStatus = (status: string | undefined) => {
    switch (status) {
      case 'DRAFT':
        return <Chip label={t('pages.initiativeList.status.draft')} color="default" />;
      case 'IN_REVISION':
        return <Chip label={t('pages.initiativeList.status.inRevision')} color="warning" />;
      case 'TO_CHECK':
        return <Chip label={t('pages.initiativeList.status.toCheck')} color="error" />;
      case 'APPROVED':
        return <Chip label={t('pages.initiativeList.status.approved')} color="success" />;
      case 'PUBLISHED':
        return <Chip label={t('pages.initiativeList.status.published')} color="secondary" />;
      case 'CLOSED':
        return <Chip label={t('pages.initiativeList.status.closed')} color="default" />;
      case 'SUSPENDED':
        return <Chip label={t('pages.initiativeList.status.suspended')} color="error" />;
      default:
        return null;
    }
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
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 2' }}>
          {renderInitiativeStatus(initiativeDetail.status)}
        </Box>
        <Box sx={{ display: 'grid', gridColumn: 'span 12', rowGap: 2 }}>
          <Typography variant="body1">{t('pages.initiativeDetail.subtitle')}</Typography>
        </Box>
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
              <SummaryContentBody
                heading={t('pages.initiativeDetail.accordion.step1.heading')}
                title={t('pages.initiativeDetail.accordion.step1.title')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <AdditionalInfoContentBody initiativeDetail={initiativeDetail} />
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
              <SummaryContentBody
                heading={t('pages.initiativeDetail.accordion.step2.heading')}
                title={t('pages.initiativeDetail.accordion.step2.title')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <GeneralInfoContentBody initiativeDetail={initiativeDetail} />
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
              <SummaryContentBody
                heading={t('pages.initiativeDetail.accordion.step3.heading')}
                title={t('pages.initiativeDetail.accordion.step3.title')}
              />
            </AccordionSummary>
            <AccordionDetails>
              {initiativeDetail.generalInfo.beneficiaryKnown === 'true' ? (
                <BeneficiaryListContentBody initiativeDetail={initiativeDetail} />
              ) : (
                <BeneficiaryRuleContentBody initiativeDetail={initiativeDetail} />
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel4'}
            onChange={handleChange('panel4')}
            sx={accordionSx}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls="panel4-content"
              id="panel4-header"
            >
              <SummaryContentBody
                heading={t('pages.initiativeDetail.accordion.step4.heading')}
                title={t('pages.initiativeDetail.accordion.step4.title')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <ShopRuleContentBody initiativeDetail={initiativeDetail} />
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
              aria-controls="panel5-content"
              id="panel5-header"
            >
              <SummaryContentBody
                heading={t('pages.initiativeDetail.accordion.step5.heading')}
                title={t('pages.initiativeDetail.accordion.step5.title')}
              />
            </AccordionSummary>
            <AccordionDetails>
              <RefundRuleContentBody initiativeDetail={initiativeDetail} />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mt: 2 }}>
        <Box sx={{ gridColumn: 'span 1' }}>
          <Button variant="outlined" onClick={() => history.replace(ROUTES.HOME)}>
            {t('components.wizard.common.buttons.back')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InitiativeDetail;
