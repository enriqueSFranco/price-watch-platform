import { useId, useState } from "react";
import clsx from "clsx";
import styles from "./floating-input.module.css";

type InputSize = "sm" | "md" | "lg";
type InputVariant = "outlined" | "filled" | "standard";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  hasError?: boolean;
  isValid?: boolean;
  variant?: InputVariant;
  sx?: InputSize;
}

export function FloatingInput({
  label,
  description,
  startIcon,
  endIcon,
  hasError = false,
  isValid = false,
  variant = "outlined",
  sx = "md",
  ...props
}: FloatingInputProps) {
  const inputHintId = useId();
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <div
      className={clsx(
        styles.input,
        styles[`input--size-${sx}`],
        styles[`input--variant-${variant}`],
        {
          [styles["input--error"]]: hasError,
          [styles["input--valid"]]: isValid && !hasError,
          [styles["input--disabled"]]: props.disabled,
        }
      )}
    >
      <div className={styles.input__box}>
        {startIcon && (
          <span className={styles["input__icon--start"]}>{startIcon}</span>
        )}
        <div className={styles["input__field-group"]}>
          <input
            type="text"
            id={inputHintId}
            autoComplete="off"
            placeholder=" "
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={clsx(
              styles.input__element,
              props.disabled && styles["input__element--disabled"]
            )}
            {...props}
          />
          <label
            htmlFor={inputHintId}
            className={clsx(
              styles.input__label,
              !startIcon && styles["input__label--without-icon"]
            )}
          >
            {label}
          </label>
        </div>
        {endIcon && (
          <span className={styles["input__icon--end"]}>{endIcon}</span>
        )}
      </div>
      {description && (
        <p className={styles.input__description}>{description}</p>
      )}
    </div>
  );
}
