import { IconScraper } from "./icon-scraper";
import styles from "./icon-app.module.css"
import clsx from "clsx";

export function IconRaspinApp() {

  return (
    <div className={clsx(styles.wrapperIcon)}>
      <IconScraper />
      <h2 className="text-2xl md:text-5xl lg:text-3xl font-sans font-bold tracking-tighter">Raspín</h2>
    </div>
  );
}
