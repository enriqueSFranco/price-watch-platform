import Image from "next/image";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className={`flex flex-col items-center justify-center ${styles.hero}`}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Herramienta de Web Scraping</h1>
        <p className={styles.heroSubtitle}>
          Monitorea, ahorra, disfruta. Simplemente agrega la URL de cualquier
          producto y Price Watch te avisará por email cuando el precio baje. ¡Así de
          fácil!
        </p>
      </div>
      <div className={`mask-b-from-45% mask-b-to-80% self-end ${styles.heroImageWrapper}`}>
        <Image
          width={720}
          height={720}
          src="/assets/images/price-watch.png"
          alt="preview price watch"
          className={styles.heroImage}
        />
      </div>
    </section>
  );
}
