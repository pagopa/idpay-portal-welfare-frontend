import { Box, Stepper, Step, StepLabel, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { MouseEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { WIZARD_ACTIONS } from '../../utils/constants';
import { stepTwoBeneficiaryKnownSelector } from '../../redux/slices/initiativeSlice';
import ServiceConfig from './components/StepOne/ServiceConfig';
import Generalnfo from './components/StepTwo/Generalnfo';
import AdmissionCriteria from './components/StepThree/AdmissionCriteria';
import FileUpload from './components/StepThree/FileUpload';
import ShopRules from './components/StepFour/ShopRules';
import RefundRules from './components/StepFive/RefundRules';

type Props = {
  handleOpenExitModal: MouseEventHandler;
};

const Wizard = ({ handleOpenExitModal }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [actionType, setActionType] = useState('');
  const [beneficiaryKnown, setBeneficiaryKnown] = useState('');
  const [disabledNext, setDisabledNext] = useState(true);
  const { t } = useTranslation();
  const selectedCriteria = useSelector(stepTwoBeneficiaryKnownSelector);

  useEffect(() => {
    if (selectedCriteria) {
      setBeneficiaryKnown(selectedCriteria);
    }
  }, [selectedCriteria]);

  const steps = [
    t('components.wizard.stepOne.title'),
    t('components.wizard.stepTwo.title'),
    t('components.wizard.stepThree.title'),
    t('components.wizard.stepFour.title'),
    t('components.wizard.stepFive.title1'),
  ];

  const handleNext = () => {
    setActionType(() => WIZARD_ACTIONS.SUBMIT);
    setDisabledNext(true);
  };

  const handleDraft = () => {
    setActionType(() => WIZARD_ACTIONS.DRAFT);
  };

  const handleBack = (e: any) => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      setActionType(() => WIZARD_ACTIONS.BACK);
    } else {
      handleOpenExitModal(e);
    }
  };

  const renderActiveStepBox = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <ServiceConfig
            action={actionType}
            setAction={setActionType}
            currentStep={activeStep}
            setCurrentStep={setActiveStep}
            setDisabledNext={setDisabledNext}
          />
        );
      case 1:
        return (
          <Generalnfo
            action={actionType}
            setAction={setActionType}
            currentStep={activeStep}
            setCurrentStep={setActiveStep}
            setDisabledNext={setDisabledNext}
          />
        );
      case 2:
        if (beneficiaryKnown === 'true') {
          return (
            <FileUpload
              action={actionType}
              setAction={setActionType}
              currentStep={activeStep}
              setCurrentStep={setActiveStep}
              setDisabledNext={setDisabledNext}
            />
          );
        } else if (beneficiaryKnown === 'false') {
          return (
            <AdmissionCriteria
              action={actionType}
              setAction={setActionType}
              currentStep={activeStep}
              setCurrentStep={setActiveStep}
              setDisabledNext={setDisabledNext}
            />
          );
        }
        return null;
      case 3:
        return (
          <ShopRules
            action={actionType}
            setAction={setActionType}
            currentStep={activeStep}
            setCurrentStep={setActiveStep}
            setDisabledNext={setDisabledNext}
          />
        );
      case 4:
        return (
          <RefundRules
            action={actionType}
            setAction={setActionType}
            currentStep={activeStep}
            setCurrentStep={setActiveStep}
            setDisableNext={setDisabledNext}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Stepper sx={{ my: 2 }} activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index} sx={{ px: 0 }}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep < steps.length && (
        <>
          {renderActiveStepBox(activeStep)}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 2,
              gridTemplateRows: 'auto',
              gridTemplateAreas: `"back . . . draft continue"`,
            }}
          >
            <Box sx={{ gridArea: 'back' }}>
              <Button
                variant="outlined"
                onClick={(e) => handleBack(e)}
                data-testid="back-action-test"
              >
                {t('components.wizard.common.buttons.back')}
              </Button>
            </Box>
            <Box sx={{ gridArea: 'draft', justifySelf: 'end' }}>
              <Button
                variant="text"
                startIcon={<SaveIcon />}
                onClick={handleDraft}
                data-testid="skip-action-test"
                sx={{ display: activeStep > 0 ? 'inline-flex' : 'none' }}
              >
                {t('components.wizard.common.buttons.skip')}
              </Button>
            </Box>
            <Box sx={{ gridArea: 'continue', justifySelf: 'end' }}>
              <Button
                variant="contained"
                onClick={handleNext}
                data-testid="continue-action-test"
                disabled={disabledNext}
              >
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
