import {useId} from "react"
import styles from "./floating-input.module.css";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function FloatingInput({label, ...props}: FloatingInputProps) {
  const inputHintId = useId()

  return (
    <div className={styles.inputGroup}>
      <input
        type="text"
        id={inputHintId}
        placeholder=" "
        className={styles.inputGroup__input}
        {...props}
      />
      <label className={styles.inputGroup__label}>{label}</label>
    </div>
  );
}
