import { Box, IconButton, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { grey } from '@mui/material/colors';
import { renderShopRuleIcon } from './helpers';

type Props = {
  title: string;
  code: string;
  handleShopListItemRemoved: any;
};

const MCCItem = ({ title, code, handleShopListItemRemoved }: Props) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(24, 1fr)',
      alignItems: 'start',
      borderColor: grey.A200,
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: 2,
      my: 3,
      p: 3,
    }}
    data-testid="mcc-item-test"
  >
    <Box sx={{ gridColumn: 'span 1' }}>{renderShopRuleIcon(code, 0, 'inherit')}</Box>
    <Box sx={{ gridColumn: 'span 22' }}>
      <Typography variant="subtitle1">{title}</Typography>
    </Box>
    <Box sx={{ gridColumn: 'span 1', justifySelf: 'end' }}>
      <IconButton onClick={() => handleShopListItemRemoved(code)}>
        <DeleteOutlineIcon
          color="error"
          sx={{
            cursor: 'pointer',
          }}
          data-testid="delete-button-test"
        />
      </IconButton>
    </Box>
  </Box>
);

export default MCCItem;
