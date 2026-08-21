import { useEffect, useId, useState } from "react";

import styles from "./FieldControls.module.css";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  errorText?: string;
}

const TextField = ({
  label,
  value,
  onChange,
  onDebouncedChange,
  debounceMs = 120,
  placeholder,
  required = false,
  disabled = false,
  helperText,
  errorText,
}: TextFieldProps) => {
  const inputId = useId();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (!onDebouncedChange) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onDebouncedChange(localValue);
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [debounceMs, localValue, onDebouncedChange]);

  return (
    <div className={styles.fieldRoot}>
      <label htmlFor={inputId} className={styles.labelRow}>
        <span>{label}</span>
        {required ? <span className={styles.required}>*</span> : null}
      </label>
      <input
        id={inputId}
        className={styles.input}
        type="text"
        value={localValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(errorText)}
        onChange={(event) => {
          const nextValue = event.target.value;
          setLocalValue(nextValue);
          onChange(nextValue);
        }}
      />
      {helperText ? <p className={styles.helperText}>{helperText}</p> : null}
      {errorText ? <p className={styles.errorText}>{errorText}</p> : null}
    </div>
  );
};

export default TextField;
