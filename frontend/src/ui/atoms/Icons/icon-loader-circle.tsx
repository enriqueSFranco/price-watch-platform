import clsx from "clsx";
import styles from "./icon-app.module.css"

export function IconLoaderCircle() {
  const loaderClasses = clsx(styles.loader)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-loader-circle-icon lucide-loader-circle ${loaderClasses}`}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
