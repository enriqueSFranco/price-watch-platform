import clsx from "clsx"
import styles from "./navbar.module.css"
import Link from "next/link"

interface MenuItems {
  text: string
  icon?: React.ReactNode
}

interface NavbarProps {
  children: React.ReactNode

}

export function Navbar({children}: NavbarProps) {
  return (
    <div className={clsx(styles.navbar, {
      [styles.sticky_navbar]: true
    })}>
      {children}
    </div>
  )
}
