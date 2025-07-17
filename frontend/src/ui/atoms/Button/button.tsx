import clsx from "clsx"
import styles from "./button.module.css"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

export function Button({text, iconLeft, iconRight, ...rest}: ButtonProps) {
  return (
    <button {...rest} className={clsx(styles.button, {})}>
      {iconLeft && iconLeft}
      <label className={styles.buttonLabel}>{text}</label>
      {iconRight && iconRight}
    </button>
  )
}
