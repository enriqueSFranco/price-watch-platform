import { IconScraper } from "./icon-scraper";
import styles from "./icon-app.module.css"

export function IconRaspinApp() {
  return (
    <div className={styles.wrapperIcon}>
      <IconScraper />
      <h3 className={styles.titleApp}>Raspín</h3>
    </div>
  );
}
