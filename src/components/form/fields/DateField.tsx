import { useId } from "react";

import styles from "./FieldControls.module.css";

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  errorText?: string;
}

const DateField = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  helperText,
  errorText,
}: DateFieldProps) => {
  const inputId = useId();

  return (
    <div className={styles.fieldRoot}>
      <label htmlFor={inputId} className={styles.labelRow}>
        <span>{label}</span>
        {required ? <span className={styles.required}>*</span> : null}
      </label>
      <input
        id={inputId}
        className={styles.input}
        type="date"
        value={value}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(errorText)}
        onChange={(event) => onChange(event.target.value)}
      />
      {helperText ? <p className={styles.helperText}>{helperText}</p> : null}
      {errorText ? <p className={styles.errorText}>{errorText}</p> : null}
    </div>
  );
};

export default DateField;
