import { Box, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { grey } from '@mui/material/colors';
import { Dispatch, SetStateAction, MouseEvent, MouseEventHandler } from 'react';
import DateOfBirthCriteriaItem from './DateOfBirthCriteriaItem';
import ResidencyCriteriaItem from './ResidencyCriteriaItem';
import IseeCriteriaItem from './IseeCriteriaItem';

type Props = {
  code: string | undefined;
  field: string | undefined;
  authority: string | undefined;
  dateOfBirthCriteria: {
    code?: string | undefined;
    field?: string | undefined;
    operator?: string | undefined;
    value?: string | undefined;
  };
  setDateOfBirthCriteria: Dispatch<
    SetStateAction<{
      code?: string | undefined;
      field?: string | undefined;
      operator?: string | undefined;
      value?: string | undefined;
    }>
  >;
  residencyCriteria: {
    code?: string | undefined;
    field?: string | undefined;
    operator?: string | undefined;
    value?: string | undefined;
  };
  setResidencyCriteria: Dispatch<
    SetStateAction<{
      code?: string | undefined;
      field?: string | undefined;
      operator?: string | undefined;
      value?: string | undefined;
    }>
  >;
  iseeCriteria: {
    code?: string | undefined;
    field?: string | undefined;
    operator?: string | undefined;
    value?: string | undefined;
  };
  setIseeCriteria: Dispatch<
    SetStateAction<{
      code?: string | undefined;
      field?: string | undefined;
      operator?: string | undefined;
      value?: string | undefined;
    }>
  >;
  handleCriteriaRemoved: MouseEventHandler<Element>;
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  // criteriaToSubmit: Array<{ code: string | undefined; dispatched: boolean }>;
  // setCriteriaToSubmit: Dispatch<
  //   SetStateAction<Array<{ code: string | undefined; dispatched: boolean }>>
  // >;
};

const AdmissionCriteriaItem = ({
  code,
  field,
  authority,
  dateOfBirthCriteria,
  setDateOfBirthCriteria,
  residencyCriteria,
  setResidencyCriteria,
  iseeCriteria,
  setIseeCriteria,
  handleCriteriaRemoved,
  action,
  setAction,
  currentStep,
  setCurrentStep,
}: // criteriaToSubmit,
// setCriteriaToSubmit,
Props) => {
  const criteria = (code: string | undefined) => {
    switch (code) {
      case 'BIRTHDATE':
        return (
          <DateOfBirthCriteriaItem
            code={code}
            field={field}
            authority={authority}
            action={action}
            initialFormValues={dateOfBirthCriteria}
            setFormValues={setDateOfBirthCriteria}
            setAction={setAction}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            // criteriaToSubmit={criteriaToSubmit}
            // setCriteriaToSubmit={setCriteriaToSubmit}
          />
        );
      case 'RESIDENCE':
        return (
          <ResidencyCriteriaItem
            code={code}
            field={field}
            authority={authority}
            initialFormValues={residencyCriteria}
            setFormValues={setResidencyCriteria}
            action={action}
            setAction={setAction}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            // criteriaToSubmit={criteriaToSubmit}
            // setCriteriaToSubmit={setCriteriaToSubmit}
          />
        );
      case 'ISEE':
        return (
          <IseeCriteriaItem
            code={code}
            field={field}
            authority={authority}
            initialFormValues={iseeCriteria}
            setFormValues={setIseeCriteria}
            action={action}
            setAction={setAction}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            // criteriaToSubmit={criteriaToSubmit}
            // setCriteriaToSubmit={setCriteriaToSubmit}
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
