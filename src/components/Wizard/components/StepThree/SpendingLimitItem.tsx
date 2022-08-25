import { Box, FormControl, IconButton, TextField, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { renderShopRuleIcon } from './helpers';

type Props = {
  title: string;
  code: string;
  handleShopListItemRemoved: any;
  formik: any;
};

const SpendingLimitItem = ({ title, code, handleShopListItemRemoved, formik }: Props) => {
  const { t } = useTranslation();

  return (
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
      data-testid="spending-limit-item-test"
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
      <Box
        sx={{
          gridColumn: 'span 24',
          display: 'grid',
          gridTemplateColumns: 'repeat( 4, 1fr)',
          gridTemplateRows: 'auto',
          gridTemplateAreas: `"minSpeningLimitField minSpendingLimitTooltip . . "
                              "maxSpendingLimitField maxSpendingLimitTooltip . . "`,
          alignItems: 'center',
          gap: 3,
          my: 2,
        }}
      >
        <FormControl sx={{ gridArea: 'minSpeningLimitField' }}>
          <TextField
            inputProps={{
              step: 0.01,
              min: 0,
              type: 'number',
              'data-testid': 'min-spending-limit',
            }}
            placeholder={t('components.wizard.stepThree.form.minSpeningLimit')}
            name="minSpeningLimit"
            value={formik.values.minSpeningLimit}
            onChange={(e) => formik.handleChange(e)}
          />
        </FormControl>
        <Tooltip
          title={t('components.wizard.stepThree.form.minSpendingLimitTooltip')}
          placement="right"
          sx={{ gridArea: 'minSpendingLimitTooltip' }}
          arrow
        >
          <InfoOutlinedIcon color="primary" />
        </Tooltip>
        <FormControl sx={{ gridArea: 'maxSpendingLimitField' }}>
          <TextField
            inputProps={{
              step: 0.01,
              min: 0,
              type: 'number',
              'data-testid': 'max-spending-limit',
            }}
            placeholder={t('components.wizard.stepThree.form.maxSpeningLimit')}
            name="maxSpeningLimit"
            value={formik.values.maxSpeningLimit}
            onChange={(e) => formik.handleChange(e)}
          />
        </FormControl>
        <Tooltip
          title={t('components.wizard.stepThree.form.maxSpendingLimitTooltip')}
          placement="right"
          sx={{ gridArea: 'maxSpendingLimitTooltip' }}
          arrow
        >
          <InfoOutlinedIcon color="primary" />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default SpendingLimitItem;
