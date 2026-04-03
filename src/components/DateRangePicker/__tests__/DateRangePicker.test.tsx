import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { addDays, endOfDay, startOfDay, subDays } from 'date-fns';
import DateRangePicker from '../DateRangePicker';

const mockDatePicker = jest.fn();
const mockInputMouseDown = jest.fn();
let mockIncludeInputMouseDown = true;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: (props: any) => {
    mockDatePicker(props);
    const TextFieldSlot = props.slots?.textField;
    return (
      <div data-testid={`picker-${props.label}`}>
        {TextFieldSlot ? (
          <TextFieldSlot
            {...props.slotProps?.textField}
            label={props.label}
            value={props.value ? 'seed value' : ''}
            inputProps={{
              ...(props.slotProps?.textField?.inputProps ?? {}),
              value: 'seed value',
              ...(mockIncludeInputMouseDown ? { onMouseDown: mockInputMouseDown } : {}),
            }}
            InputProps={props.slotProps?.textField?.InputProps}
          />
        ) : null}
        <button
          data-testid={`open-${props.label}`}
          onClick={() => props.onOpen?.()}
        >
          open
        </button>
        <button
          data-testid={`close-${props.label}`}
          onClick={() => props.onClose?.()}
        >
          close
        </button>
        <button
          data-testid={`change-${props.label}`}
          onClick={() => props.onChange(new Date('2026-03-15T10:00:00.000Z'))}
        >
          change
        </button>
        <button data-testid={`accept-${props.label}`} onClick={() => props.onAccept?.()}>
          accept
        </button>
      </div>
    );
  },
}));

describe('DateRangePicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIncludeInputMouseDown = true;
  });

  test('sets min/max date for "to" picker when dateFrom is empty and not users', () => {
    const yesterday = new Date('2026-03-20T23:59:59.999Z');
    const minDateFrom = new Date('2025-11-18T00:00:00.000Z');

    render(
      <DateRangePicker
        dateFrom={null}
        dateTo={null}
        dateFromError={false}
        dateToError={false}
        minDateFrom={minDateFrom}
        yesterday={yesterday}
        onDateFromChange={jest.fn()}
        onDateToChange={jest.fn()}
      />
    );

    const toPickerProps = mockDatePicker.mock.calls[1][0];
    expect(toPickerProps.minDate.getTime()).toBe(startOfDay(subDays(yesterday, 90)).getTime());
    expect(toPickerProps.maxDate).toEqual(yesterday);
  });

  test('uses the users date limits when dateFrom is missing', () => {
    const yesterday = new Date('2026-03-20T23:59:59.999Z');
    const minDateFrom = new Date('2025-11-18T00:00:00.000Z');

    render(
      <DateRangePicker
        dateFrom={null}
        dateTo={null}
        dateFromError={false}
        dateToError={false}
        minDateFrom={minDateFrom}
        yesterday={yesterday}
        onDateFromChange={jest.fn()}
        onDateToChange={jest.fn()}
        isUsers
      />
    );

    const toPickerProps = mockDatePicker.mock.calls
      .map(([callProps]) => callProps)
      .find((callProps) => callProps.label === 'pages.initiativeUsers.form.to');

    expect(toPickerProps?.minDate).toEqual(startOfDay(minDateFrom));
    expect(toPickerProps?.maxDate).toEqual(yesterday);
  });

  test('prefers dateFrom over the users minimum and still caps the maximum at yesterday', () => {
    const yesterday = new Date('2026-03-20T23:59:59.999Z');
    const minDateFrom = new Date('2025-11-18T00:00:00.000Z');
    const dateFrom = new Date('2026-03-15T00:00:00.000Z');

    render(
      <DateRangePicker
        dateFrom={dateFrom}
        dateTo={null}
        dateFromError={false}
        dateToError={false}
        minDateFrom={minDateFrom}
        yesterday={yesterday}
        onDateFromChange={jest.fn()}
        onDateToChange={jest.fn()}
        isUsers
      />
    );

    const toPickerProps = mockDatePicker.mock.calls
      .map(([callProps]) => callProps)
      .find((callProps) => callProps.label === 'pages.initiativeUsers.form.to');

    expect(toPickerProps?.minDate).toEqual(startOfDay(dateFrom));
    expect(toPickerProps?.maxDate).toEqual(yesterday);
  });

  test('caps the "to" picker max date when dateFrom would exceed the allowed range', () => {
    const yesterday = new Date('2026-03-20T23:59:59.999Z');
    const minDateFrom = new Date('2025-11-18T00:00:00.000Z');
    const dateFrom = new Date('2026-03-15T00:00:00.000Z');

    render(
      <DateRangePicker
        dateFrom={dateFrom}
        dateTo={null}
        dateFromError={false}
        dateToError={false}
        minDateFrom={minDateFrom}
        yesterday={yesterday}
        onDateFromChange={jest.fn()}
        onDateToChange={jest.fn()}
      />
    );

    const toPickerProps = mockDatePicker.mock.calls
      .map(([callProps]) => callProps)
      .find((callProps) => callProps.label === 'pages.initiativeUsers.form.to');

    expect(toPickerProps?.minDate).toEqual(startOfDay(dateFrom));
    expect(toPickerProps?.maxDate).toEqual(yesterday);
  });

  test('uses the 90-day limit when it stays within yesterday', () => {
    const yesterday = new Date('2026-07-31T23:59:59.999Z');
    const minDateFrom = new Date('2025-11-18T00:00:00.000Z');
    const dateFrom = new Date('2026-03-01T00:00:00.000Z');

    render(
      <DateRangePicker
        dateFrom={dateFrom}
        dateTo={null}
        dateFromError={false}
        dateToError={false}
        minDateFrom={minDateFrom}
        yesterday={yesterday}
        onDateFromChange={jest.fn()}
        onDateToChange={jest.fn()}
      />
    );

    const toPickerProps = mockDatePicker.mock.calls
      .map(([callProps]) => callProps)
      .find((callProps) => callProps.label === 'pages.initiativeUsers.form.to');

    expect(toPickerProps?.minDate).toEqual(startOfDay(dateFrom));
    expect(toPickerProps?.maxDate).toEqual(endOfDay(addDays(dateFrom, 90)));
  });

  test('passes validation state to both pickers', () => {
    const yesterday = new Date('2026-03-20T23:59:59.999Z');
    const minDateFrom = new Date('2025-11-18T00:00:00.000Z');

    render(
      <DateRangePicker
        dateFrom={null}
        dateTo={null}
        dateFromError
        dateToError
        minDateFrom={minDateFrom}
        yesterday={yesterday}
        onDateFromChange={jest.fn()}
        onDateToChange={jest.fn()}
      />
    );

    const fromPickerProps = mockDatePicker.mock.calls
      .map(([callProps]) => callProps)
      .find((callProps) => callProps.label === 'pages.initiativeUsers.form.from');
    const toPickerProps = mockDatePicker.mock.calls
      .map(([callProps]) => callProps)
      .find((callProps) => callProps.label === 'pages.initiativeUsers.form.to');

    expect(fromPickerProps?.slotProps?.textField?.error).toBe(true);
    expect(fromPickerProps?.slotProps?.textField?.helperText).toBe('validation.required');
    expect(toPickerProps?.slotProps?.textField?.error).toBe(true);
    expect(toPickerProps?.slotProps?.textField?.helperText).toBe('validation.required');
  });

  test('renders read-only text fields and wires picker open/close handlers', async () => {
    const onDateFromChange = jest.fn();
    const onDateToChange = jest.fn();
    const yesterday = new Date('2026-03-20T23:59:59.999Z');
    const minDateFrom = new Date('2025-11-18T00:00:00.000Z');

    render(
      <DateRangePicker
        dateFrom={null}
        dateTo={new Date('2026-03-11T00:00:00.000Z')}
        dateFromError={false}
        dateToError={false}
        minDateFrom={minDateFrom}
        yesterday={yesterday}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
      />
    );

    const [fromInput, toInput] = screen.getAllByRole('textbox');

    expect(fromInput).toHaveValue('');
    expect(toInput).toHaveValue('seed value');

    fireEvent.mouseDown(fromInput);
    expect(mockInputMouseDown).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('open-pages.initiativeUsers.form.from'));
    fireEvent.click(screen.getByTestId('close-pages.initiativeUsers.form.from'));
    fireEvent.click(screen.getByTestId('accept-pages.initiativeUsers.form.from'));
    fireEvent.click(screen.getByTestId('accept-pages.initiativeUsers.form.to'));

    await waitFor(() => {
      const latestFromPickerCall = mockDatePicker.mock.calls
        .map(([callProps]) => callProps)
        .filter((callProps) => callProps.label === 'pages.initiativeUsers.form.from')
        .slice(-1)[0];
      const latestToPickerCall = mockDatePicker.mock.calls
        .map(([callProps]) => callProps)
        .filter((callProps) => callProps.label === 'pages.initiativeUsers.form.to')
        .slice(-1)[0];

      expect(latestFromPickerCall?.open).toBe(false);
      expect(latestToPickerCall?.open).toBe(false);
    });
  });

  test('opens "to" picker after accepting "from" picker and forwards date change callbacks', async () => {
    const onDateFromChange = jest.fn();
    const onDateToChange = jest.fn();
    const yesterday = new Date('2026-03-20T23:59:59.999Z');
    const minDateFrom = new Date('2025-11-18T00:00:00.000Z');

    const { getByTestId } = render(
      <DateRangePicker
        dateFrom={new Date('2026-03-01T00:00:00.000Z')}
        dateTo={null}
        dateFromError={false}
        dateToError={false}
        minDateFrom={minDateFrom}
        yesterday={yesterday}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
      />
    );

    fireEvent.click(getByTestId('change-pages.initiativeUsers.form.from'));
    fireEvent.click(getByTestId('change-pages.initiativeUsers.form.to'));
    expect(onDateFromChange).toHaveBeenCalled();
    expect(onDateToChange).toHaveBeenCalled();

    fireEvent.click(getByTestId('accept-pages.initiativeUsers.form.from'));

    await waitFor(() => {
      const latestToPickerCall = mockDatePicker.mock.calls[mockDatePicker.mock.calls.length - 1][0];
      expect(latestToPickerCall.label).toBe('pages.initiativeUsers.form.to');
      expect(latestToPickerCall.open).toBe(true);
    });
  });

  test('does not require an input mouseDown handler to prevent default', () => {
    mockIncludeInputMouseDown = false;

    render(
      <DateRangePicker
        dateFrom={null}
        dateTo={null}
        dateFromError={false}
        dateToError={false}
        minDateFrom={new Date('2025-11-18T00:00:00.000Z')}
        yesterday={new Date('2026-03-20T23:59:59.999Z')}
        onDateFromChange={jest.fn()}
        onDateToChange={jest.fn()}
      />
    );

    fireEvent.mouseDown(screen.getAllByRole('textbox')[0]);
    expect(mockInputMouseDown).not.toHaveBeenCalled();
  });
});
