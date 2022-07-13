import { Box, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { grey } from '@mui/material/colors';
import { Dispatch, SetStateAction, MouseEvent, MouseEventHandler } from 'react';
import useAdmissionCriteriaFieldSets from './useAdmissionCriteriaFieldSets';

type Props = {
  id: string | number;
  title: string | number;
  handleCriteriaRemoved: MouseEventHandler<Element>;
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
};

const AdmissionCriteriaItem = ({
  id,
  title,
  handleCriteriaRemoved,
  action,
  setAction,
  currentStep,
  setCurrentStep,
}: Props) => {
  const fieldset = useAdmissionCriteriaFieldSets({
    id,
    action,
    setAction,
    currentStep,
    setCurrentStep,
  });

  return (
    <Box
      key={id}
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
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
        <DeleteOutlineIcon
          color="error"
          data-id={id}
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
