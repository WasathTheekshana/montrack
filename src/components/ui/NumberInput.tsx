'use client';

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: string;
  onChange: (raw: string) => void;
}

export function NumberInput({ value, onChange, ...props }: NumberInputProps) {
  const parts = value.split('.');
  const formatted =
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    (parts.length > 1 ? '.' + parts[1] : '');

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      value={formatted}
      onChange={(e) => {
        const raw = e.target.value.replace(/,/g, '');
        if (raw === '' || /^\d*\.?\d*$/.test(raw)) onChange(raw);
      }}
    />
  );
}
