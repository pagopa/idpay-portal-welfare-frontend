import React, { useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import MerchantAutocomplete from '../MerchantAutocomplete';

const mockTooltip = jest.fn();
const mockAutocomplete = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  const MockTooltip = ({ children, onOpen, onClose, open, title }: any) => {
    mockTooltip({ open, title });

    return (
      <div
        data-testid="tooltip-wrapper"
        data-open={open ? 'true' : 'false'}
        onMouseEnter={() => onOpen?.()}
        onMouseLeave={() => onClose?.()}
      >
        {children}
      </div>
    );
  };

  const MockAutocomplete = (props: any) => {
    mockAutocomplete(props);

    const filteredOptions = props.filterOptions(props.options, {
      inputValue: props.inputValue ?? '',
    });

    return (
      <div data-testid="autocomplete-mock">
        {props.renderInput({
          id: 'merchant-autocomplete',
          inputProps: {
            role: 'combobox',
            value: props.inputValue ?? '',
            onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
              props.onInputChange?.(event, event.target.value),
          },
          InputProps: {},
        })}
        <div data-testid="filtered-count">{filteredOptions.length}</div>
        <div data-testid="filtered-options">
          {filteredOptions.map((option: string) => {
            const renderedOption = props.renderOption(
              {
                key: option,
                className: 'mock-option',
                role: 'option',
              },
              option
            );

            return (
              <button
                key={option}
                type="button"
                data-testid={`option-${option}`}
                onClick={() => props.onChange?.({}, option)}
              >
                {renderedOption}
              </button>
            );
          })}
        </div>
        <button type="button" onClick={() => props.onChange?.({}, null)}>
          Clear selection
        </button>
      </div>
    );
  };

  return {
    ...actual,
    Tooltip: MockTooltip,
    Autocomplete: MockAutocomplete,
  };
});

describe('MerchantAutocomplete', () => {
  const merchantNames = ['Esercente 1', 'Esercente 2', 'altro'];

  const renderComponent = ({
    initialMerchant = '',
    merchantError = null,
    onMerchantChange = jest.fn(),
    onBlurValidation = jest.fn(),
  }: {
    initialMerchant?: string;
    merchantError?: 'required' | 'invalid' | null;
    onMerchantChange?: jest.Mock;
    onBlurValidation?: jest.Mock;
  } = {}) => {
    const Harness = () => {
      const [selectedMerchant, setSelectedMerchant] = useState(initialMerchant);

      return (
        <MerchantAutocomplete
          merchantNames={merchantNames}
          selectedMerchant={selectedMerchant}
          merchantError={merchantError}
          onMerchantChange={(value) => {
            onMerchantChange(value);
            setSelectedMerchant(value);
          }}
          onBlurValidation={onBlurValidation}
        />
      );
    };

    return render(<Harness />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows required validation message', () => {
    renderComponent({ merchantError: 'required' });

    expect(screen.getByText('validation.required')).toBeInTheDocument();
  });

  test('shows invalid selection validation message', () => {
    renderComponent({ initialMerchant: 'Esercente non valido', merchantError: 'invalid' });

    expect(screen.getByText('validation.invalidSelection')).toBeInTheDocument();
  });

  test('renders without helper text when there is no validation error', () => {
    renderComponent({ initialMerchant: 'Esercente 1', merchantError: null });

    expect(screen.queryByText('validation.required')).not.toBeInTheDocument();
    expect(screen.queryByText('validation.invalidSelection')).not.toBeInTheDocument();
  });

  test('filters options only when the input has at least three characters', () => {
    renderComponent({ initialMerchant: 'Es' });

    expect(screen.getByTestId('filtered-count')).toHaveTextContent('0');

    fireEvent.change(screen.getByRole('combobox'), { target: { value: ' E s e ' } });

    expect(screen.getByTestId('filtered-count')).toHaveTextContent('2');
    expect(screen.getByText('Esercente 1')).toBeInTheDocument();
    expect(screen.getByText('Esercente 2')).toBeInTheDocument();
  });

  test('keeps the tooltip closed for empty selections and clears to an empty value', () => {
    jest.useFakeTimers();
    const onMerchantChange = jest.fn();
    const blurSpy = jest.spyOn(HTMLElement.prototype, 'blur').mockImplementation(() => undefined);

    renderComponent({
      initialMerchant: '',
      onMerchantChange,
    });

    const input = screen.getByRole('combobox');
    const tooltip = input.closest('[data-testid="tooltip-wrapper"]') as HTMLElement;

    fireEvent.mouseEnter(tooltip);

    expect(tooltip).toHaveAttribute('data-open', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(onMerchantChange).toHaveBeenLastCalledWith('');

    blurSpy.mockRestore();
    jest.useRealTimers();
  });

  test('opens and closes the tooltip for a valid merchant selection', async () => {
    renderComponent({ initialMerchant: 'Esercente 1' });

    const input = screen.getByRole('combobox');
    const tooltip = input.closest('[data-testid="tooltip-wrapper"]') as HTMLElement;

    fireEvent.mouseEnter(tooltip);

    await waitFor(() => expect(tooltip).toHaveAttribute('data-open', 'true'));

    fireEvent.focus(input);

    await waitFor(() => expect(tooltip).toHaveAttribute('data-open', 'false'));

    fireEvent.mouseLeave(tooltip);

    expect(tooltip).toHaveAttribute('data-open', 'false');
  });

  test('calls onMerchantChange on typing, selection and onBlurValidation on blur', async () => {
    jest.useFakeTimers();
    const onMerchantChange = jest.fn();
    const onBlurValidation = jest.fn();
    const blurSpy = jest.spyOn(HTMLElement.prototype, 'blur').mockImplementation(() => undefined);

    renderComponent({
      onMerchantChange,
      onBlurValidation,
    });

    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'Ese' } });
    fireEvent.blur(input);

    expect(onMerchantChange).toHaveBeenLastCalledWith('Ese');
    expect(onBlurValidation).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('option-Esercente 1'));

    expect(onMerchantChange).toHaveBeenLastCalledWith('Esercente 1');

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(blurSpy).toHaveBeenCalled();

    blurSpy.mockRestore();
    jest.useRealTimers();
  });
});

