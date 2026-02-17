import { Box, TextField, Autocomplete, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MerchantAutocompleteProps {
  merchantNames: Array<string>;
  selectedMerchant: string;
  merchantError: 'required' | 'invalid' | null;
  onMerchantChange: (value: string) => void;
  onBlurValidation: () => void;
}

const MerchantAutocomplete = ({
  merchantNames,
  selectedMerchant,
  merchantError,
  onMerchantChange,
  onBlurValidation,
}: MerchantAutocompleteProps) => {
  const { t } = useTranslation();
  const [searchFocused, setSearchFocused] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const normalizeString = (str: string) => str.toLowerCase().replace(/\s+/g, '');

  const isMerchantValid = (value: string) => {
    const v = value.trim().toLowerCase();
    if (!v) { return false; }
    return merchantNames.some((m) => m.trim().toLowerCase() === v);
  };

  const handleTooltipOpen = () => {
    if (!searchFocused && isMerchantValid(selectedMerchant)) {
      setTooltipOpen(true);
    }
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleFocus = () => {
    setSearchFocused(true);
    setTooltipOpen(false);
  };

  const handleBlur = () => {
    setSearchFocused(false);
    onBlurValidation();
  };

  return (
    <Box
      sx={{
        flex: '1 1 280px',
        minWidth: 280,
        maxWidth: { xs: '100%', md: 450 },
      }}
    >
      <Autocomplete
        freeSolo
        options={merchantNames}
        noOptionsText=""
        filterOptions={(options, { inputValue }) => {
          const normalizedInput = normalizeString(inputValue);
          if (normalizedInput.length < 3) { return []; }
          return options.filter((option) => normalizeString(option).includes(normalizedInput));
        }}
        inputValue={selectedMerchant}
        onInputChange={(_, value) => onMerchantChange(value)}
        onChange={(_, value) => {
          onMerchantChange(value ?? '');
          setTimeout(() => {
            (document.activeElement as HTMLElement)?.blur();
          }, 0);
        }}
        ListboxProps={{
          sx: {
            maxHeight: 250,
            padding: 0.5,
          },
        }}
        slotProps={{
          popper: {
            placement: 'bottom-start',
            modifiers: [
              {
                name: 'flip',
                enabled: false,
              },
              {
                name: 'preventOverflow',
                enabled: false,
              },
            ],
          },
        }}
        sx={{
          '& .MuiInputBase-root': { minWidth: 0 },
          '& .MuiAutocomplete-input': {
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: searchFocused ? 'normal' : 'nowrap',
          },
        }}
        renderOption={(props, option) => (
          <Tooltip title={option} arrow placement="left" enterDelay={200} key={option}>
            <Box
              component="li"
              {...props}
              sx={{
                display: 'block !important',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {option}
            </Box>
          </Tooltip>
        )}
        renderInput={(params) => (
          <Tooltip
            title={selectedMerchant}
            arrow
            placement="top"
            open={tooltipOpen}
            onOpen={handleTooltipOpen}
            onClose={handleTooltipClose}
          >
            <TextField
              {...params}
              required
              fullWidth
              label={t('pages.initiativeExportReport.exportFiltersCard.merchant')}
              error={!!merchantError}
              helperText={
                merchantError === 'required'
                  ? t('validation.required')
                  : merchantError === 'invalid'
                    ? t('validation.invalidSelection')
                    : ''
              }
              onFocus={handleFocus}
              onBlur={handleBlur}
              InputLabelProps={{
                shrink: searchFocused || !!selectedMerchant,
              }}
              inputProps={{
                ...params.inputProps,
                style: {
                  ...(params.inputProps as any)?.style,
                  display: 'block',
                  minWidth: 0,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                },
              }}
            />
          </Tooltip>
        )}
      />
    </Box>
  );
};

export default MerchantAutocomplete;
