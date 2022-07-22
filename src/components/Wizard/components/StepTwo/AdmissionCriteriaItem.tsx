import { Box, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { grey } from '@mui/material/colors';
import { Dispatch, SetStateAction, MouseEvent, MouseEventHandler } from 'react';
import DateOfBirthCriteriaItem from './DateOfBirthCriteriaItem';
import ResidencyCriteriaItem from './ResidencyCriteriaItem';
import IseeCriteriaItem from './IseeCriteriaItem';

type Props = {
  code: string | number;
  field: string | number;
  authority: string | number;
  handleCriteriaRemoved: MouseEventHandler<Element>;
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  criteriaToSubmit: Array<{ code: string; dispatched: boolean }>;
  setCriteriaToSubmit: Dispatch<SetStateAction<Array<{ code: string; dispatched: boolean }>>>;
};

const AdmissionCriteriaItem = ({
  code,
  field,
  authority,
  handleCriteriaRemoved,
  action,
  setAction,
  currentStep,
  setCurrentStep,
  criteriaToSubmit,
  setCriteriaToSubmit,
}: Props) => {
  const criteria = (code: string | number) => {
    switch (code) {
      case '1':
        return (
          <DateOfBirthCriteriaItem
            code={code}
            field={field}
            authority={authority}
            action={action}
            setAction={setAction}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            criteriaToSubmit={criteriaToSubmit}
            setCriteriaToSubmit={setCriteriaToSubmit}
          />
        );
      case '2':
        return (
          <ResidencyCriteriaItem
            code={code}
            field={field}
            authority={authority}
            action={action}
            setAction={setAction}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            criteriaToSubmit={criteriaToSubmit}
            setCriteriaToSubmit={setCriteriaToSubmit}
          />
        );
      case '3':
        return (
          <IseeCriteriaItem
            code={code}
            field={field}
            authority={authority}
            action={action}
            setAction={setAction}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            criteriaToSubmit={criteriaToSubmit}
            setCriteriaToSubmit={setCriteriaToSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      key={code}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        alignItems: 'center',
        borderColor: grey.A200,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: 2,
        my: 3,
        p: 3,
      }}
    >
      <Box sx={{ gridColumn: 'span 11' }}>
        <Typography variant="subtitle1">{field}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
        <DeleteOutlineIcon
          color="error"
          data-id={code}
          sx={{
            cursor: 'pointer',
          }}
          onClick={(event: MouseEvent<Element, globalThis.MouseEvent>) =>
            handleCriteriaRemoved(event)
          }
        />
      </Box>
      {criteria(code)}
    </Box>
  );
};

export default AdmissionCriteriaItem;
