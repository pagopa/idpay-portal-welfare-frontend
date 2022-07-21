import { Box, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { grey } from '@mui/material/colors';
import { Dispatch, SetStateAction, MouseEvent, MouseEventHandler } from 'react';
import useAdmissionCriteriaFieldSets from './useAdmissionCriteriaFieldSets';

type Props = {
  code: string | number;
  field: string | number;
  authority: string | number;
  handleCriteriaRemoved: MouseEventHandler<Element>;
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
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
}: Props) => {
  const fieldset = useAdmissionCriteriaFieldSets({
    code,
    field,
    authority,
    action,
    setAction,
    currentStep,
    setCurrentStep,
  });

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
      {fieldset}
    </Box>
  );
};

export default AdmissionCriteriaItem;
