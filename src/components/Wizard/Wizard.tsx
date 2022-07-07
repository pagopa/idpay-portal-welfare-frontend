import { Box, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WIZARD_ACTIONS } from '../../utils/constants';
import StepOneForm from './components/StepOneForm';

const Wizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [actionType, setActionType] = useState('');
  const { t } = useTranslation();

  const steps = [
    t('components.wizard.stepOne.title'),
    t('components.wizard.stepTwo.title'),
    t('components.wizard.stepThree.title'),
    t('components.wizard.stepFour.title'),
    t('components.wizard.stepFive.title'),
  ];

  const handleNext = () => {
    setActionType(WIZARD_ACTIONS.SUBMIT);
  };

  const handleDraft = () => {
    setActionType(WIZARD_ACTIONS.DRAFT);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderActiveStepBox = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <StepOneForm
            action={actionType}
            setAction={setActionType}
            currentStep={activeStep}
            setCurrentStep={setActiveStep}
          />
        );
      case 1:
        return <h1>{steps[activeStep]}</h1>;
      case 2:
        return <h1>{steps[activeStep]}</h1>;
      case 3:
        return <h1>{steps[activeStep]}</h1>;
      case 4:
        return <h1>{steps[activeStep]}</h1>;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Stepper sx={{ my: 2 }} activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>Inviato per la revisione</Typography>
          <Button onClick={handleReset}>{t('wizard.common.buttons.reset')}</Button>
        </>
      ) : (
        <>
          {renderActiveStepBox(activeStep)}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 2,
              gridTemplateRows: 'auto',
              gridTemplateAreas: `"back . . . draft continue"`,
            }}
          >
            <Box sx={{ gridArea: 'back' }}>
              <Button
                variant="outlined"
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                {t('components.wizard.common.buttons.back')}
              </Button>
            </Box>
            <Box sx={{ gridArea: 'draft', justifySelf: 'end' }}>
              <Button variant="text" startIcon={<SaveIcon />} onClick={handleDraft}>
                {t('components.wizard.common.buttons.skip')}
              </Button>
            </Box>
            <Box sx={{ gridArea: 'continue', justifySelf: 'end' }}>
              <Button variant="contained" onClick={handleNext}>
                {activeStep === steps.length - 1
                  ? t('components.wizard.common.buttons.send')
                  : t('components.wizard.common.buttons.continue')}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Wizard;
