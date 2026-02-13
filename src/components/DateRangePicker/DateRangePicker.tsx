import { TextField, InputAdornment, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addDays, startOfDay, endOfDay, subDays } from 'date-fns';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface DateRangePickerProps {
  dateFrom: Date | null;
  dateTo: Date | null;
  dateFromError: boolean;
  dateToError: boolean;
  minDateFrom: Date;
  yesterday: Date;
  onDateFromChange: (date: Date | null) => void;
  onDateToChange: (date: Date | null) => void;
}

const DateRangePicker = ({
  dateFrom,
  dateTo,
  dateFromError,
  dateToError,
  minDateFrom,
  yesterday,
  onDateFromChange,
  onDateToChange,
}: DateRangePickerProps) => {
  const { t } = useTranslation();
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const getMinDateTo = () => {
    if (dateFrom) { return startOfDay(dateFrom); }
    return startOfDay(subDays(yesterday, 90));
  };

  const getMaxDateTo = () => {
    if (!dateFrom) { return yesterday; }
    const maxAllowed = endOfDay(addDays(dateFrom, 90));
    return maxAllowed > yesterday ? yesterday : maxAllowed;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexShrink: 0,
        width: { xs: '100%', md: 'auto' },
      }}
    >
      <DatePicker
        label={t('pages.initiativeUsers.form.from')}
        value={dateFrom}
        onChange={onDateFromChange}
        minDate={minDateFrom}
        maxDate={yesterday}
        inputFormat="dd/MM/yyyy"
        views={['year', 'month', 'day']}
        defaultCalendarMonth={dateFrom ?? yesterday}
        open={openFrom}
        onOpen={() => setOpenFrom(true)}
        onClose={() => setOpenFrom(false)}
        onAccept={() => {
          setOpenFrom(false);
          setOpenTo(true);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            required
            sx={{
              width: { xs: '100%', md: '200px' },
              minWidth: 180,
              cursor: 'pointer',
              '& .MuiInputBase-root': {
                cursor: 'pointer',
              },
            }}
            error={dateFromError}
            helperText={dateFromError ? t('validation.required') : ''}
            onClick={() => setOpenFrom(true)}
            InputProps={{
              ...params.InputProps,
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <ArrowDropDownIcon />
                </InputAdornment>
              ),
            }}
            inputProps={{
              ...params.inputProps,
              readOnly: true,
              placeholder: '',
              style: {
                ...(params.inputProps as any)?.style,
                pointerEvents: 'none',
                caretColor: 'transparent',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              },
            }}
          />
        )}
      />

      <DatePicker
        label={t('pages.initiativeUsers.form.to')}
        value={dateTo}
        onChange={onDateToChange}
        minDate={getMinDateTo()}
        maxDate={getMaxDateTo()}
        inputFormat="dd/MM/yyyy"
        views={['year', 'month', 'day']}
        defaultCalendarMonth={dateFrom ? startOfDay(dateFrom) : yesterday}
        open={openTo}
        onOpen={() => setOpenTo(true)}
        onClose={() => setOpenTo(false)}
        onAccept={() => setOpenTo(false)}
        renderInput={(params) => (
          <TextField
            {...params}
            required
            sx={{
              width: { xs: '100%', md: '200px' },
              minWidth: 180,
              cursor: 'pointer',
              '& .MuiInputBase-root': {
                cursor: 'pointer',
              },
            }}
            error={dateToError}
            helperText={dateToError ? t('validation.required') : ''}
            onClick={() => setOpenTo(true)}
            InputProps={{
              ...params.InputProps,
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <ArrowDropDownIcon />
                </InputAdornment>
              ),
            }}
            inputProps={{
              ...params.inputProps,
              readOnly: true,
              placeholder: '',
              style: {
                ...(params.inputProps as any)?.style,
                pointerEvents: 'none',
                caretColor: 'transparent',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default DateRangePicker;