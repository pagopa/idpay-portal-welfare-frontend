import { Box, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { grey } from '@mui/material/colors';
import { MouseEvent, MouseEventHandler } from 'react';

type Props = {
  id: string;
  title: string;
  handleCriteriaRemoved: MouseEventHandler<Element>;
};

const AdmissionCriteriaItem = ({ id, title, handleCriteriaRemoved }: Props) => {
  const renderFieldSet = () => {
    switch (id) {
      case '1':
        return <Box>{title}</Box>;
      case '2':
        return <Box>{title}</Box>;
      case '3':
        return <Box>{title}</Box>;
      default:
        return null;
    }
  };

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
          onClick={(event: MouseEvent<Element, globalThis.MouseEvent>) =>
            handleCriteriaRemoved(event)
          }
        />
      </Box>
      {renderFieldSet()}
    </Box>
  );
};
export default AdmissionCriteriaItem;
