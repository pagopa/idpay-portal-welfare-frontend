import { Paper } from '@mui/material';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { WIZARD_ACTIONS } from '../../../../utils/constants';

interface Props {
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setDisabledNext: Dispatch<SetStateAction<boolean>>;
}

const ServiceConfig = ({
  action,
  setAction,
  currentStep,
  setCurrentStep,
  setDisabledNext,
}: Props) => {
  useEffect(() => {
    setDisabledNext(false);
  }, []);

  useEffect(() => {
    if (action === WIZARD_ACTIONS.SUBMIT) {
      setCurrentStep(currentStep + 1);
    }
    setAction('');
  }, [action]);

  return <Paper sx={{ display: 'grid', width: '100%', my: 4, px: 3 }}>test</Paper>;
};

export default ServiceConfig;
