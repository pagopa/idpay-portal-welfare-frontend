import { Box, TextField, InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, forwardRef } from 'react';
import type { CSSProperties, InputHTMLAttributes, MouseEvent } from 'react';
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
  isUsers?: boolean;
}

const fieldSx = {
  width: { xs: '100%', md: '200px' },
  minWidth: 180,
  cursor: 'pointer',
  '& .MuiInputBase-root': { cursor: 'pointer' },
  '& .MuiInputBase-input, & input': {
    cursor: 'pointer',
    caretColor: 'transparent',
    userSelect: 'none',
  },
} as const;

type ReadOnlyTextFieldProps = {
  hasValue?: boolean;
  [key: string]: unknown;
};

const ReadOnlyTextField = forwardRef<HTMLDivElement, ReadOnlyTextFieldProps>(
  ({ hasValue = false, ...params }, ref) => {
    const textFieldParams = params as {
      inputProps?: InputHTMLAttributes<HTMLInputElement> & {
        style?: CSSProperties;
        value?: string;
      };
      InputProps?: Record<string, unknown>;
    };

    const rawInputProps = textFieldParams.inputProps ?? {};

    const htmlInputStyle: CSSProperties = {
      ...rawInputProps.style,
      cursor: 'pointer',
      caretColor: 'transparent',
      userSelect: 'none',
    };

    const htmlInputProps: InputHTMLAttributes<HTMLInputElement> & {
      style: CSSProperties;
      value?: string;
    } = {
      ...rawInputProps,
      readOnly: true,
      placeholder: '',
      onMouseDown: (event: MouseEvent<HTMLInputElement>) => {
        rawInputProps.onMouseDown?.(event);
        event.preventDefault();
      },
      style: htmlInputStyle,
    };

    if (!hasValue) {
      htmlInputProps.value = '';
    }

    return (
      <TextField
        {...(params as object)}
        ref={ref}
        InputProps={{
          ...(textFieldParams.InputProps ?? {}),
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <ArrowDropDownIcon />
            </InputAdornment>
          ),
        }}
        inputProps={htmlInputProps}
      />
    );
  }
);

const DateRangePicker = ({
  dateFrom,
  dateTo,
  dateFromError,
  dateToError,
  minDateFrom,
  yesterday,
  onDateFromChange,
  onDateToChange,
  isUsers = false,
}: DateRangePickerProps) => {
  const { t } = useTranslation();
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const getMinDateTo = () => {
    if (dateFrom) { return startOfDay(dateFrom); }
    if (isUsers) { return startOfDay(minDateFrom); }
    return startOfDay(subDays(yesterday, 90));
  };

  const getMaxDateTo = () => {
    if (isUsers) { return yesterday; }
    if (!dateFrom) { return yesterday; }
    const maxAllowed = endOfDay(addDays(dateFrom, 90));
    return maxAllowed > yesterday ? yesterday : maxAllowed;
  };

  const makeSlotProps = (hasError: boolean, hasValue: boolean, onClickOpen: () => void) => ({
    field: {
      readOnly: true,
    },
    textField: {
      hasValue,
      required: true,
      error: hasError,
      helperText: hasError ? t('validation.required') : '',
      onClick: onClickOpen,
      sx: fieldSx,
    },
  });

  const commonPickerProps = {
    format: 'dd/MM/yyyy',
    views: ['year', 'month', 'day'] as const,
    enableAccessibleFieldDOMStructure: false,
    slots: {
      textField: ReadOnlyTextField as never,
      openPickerIcon: ArrowDropDownIcon,
    },
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
        {...commonPickerProps}
        referenceDate={dateFrom ?? yesterday}
        open={openFrom}
        onOpen={() => setOpenFrom(true)}
        onClose={() => setOpenFrom(false)}
        onAccept={() => {
          setOpenFrom(false);
          setOpenTo(true);
        }}
        slotProps={makeSlotProps(dateFromError, Boolean(dateFrom), () => setOpenFrom(true))}
      />

      <DatePicker
        label={t('pages.initiativeUsers.form.to')}
        value={dateTo}
        onChange={onDateToChange}
        minDate={getMinDateTo()}
        maxDate={getMaxDateTo()}
        {...commonPickerProps}
        referenceDate={dateFrom ? startOfDay(dateFrom) : yesterday}
        open={openTo}
        onOpen={() => setOpenTo(true)}
        onClose={() => setOpenTo(false)}
        onAccept={() => setOpenTo(false)}
        slotProps={makeSlotProps(dateToError, Boolean(dateTo), () => setOpenTo(true))}
      />
    </Box>
  );
};

export default DateRangePicker;