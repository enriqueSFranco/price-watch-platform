import { useScrapeProductMutation } from "@/store/features/products/products.api";
import { extractDomain } from "@/lib/extract-domain";
import { CustomError } from "@/shared/custom-error";
import { ScrapedProduct } from "@/shared/types/product";
import { Button } from "@/ui/atoms/Button/button";
import { FloatingInput } from "@/ui/molecules/FloatingInput/floating-input";
import { IconGlobe } from "@/ui/atoms/Icons/icon-globe";
import { IconLoaderCircle } from "@/ui/atoms/Icons/icon-loader-circle";
import { IconPlay } from "@/ui/atoms/Icons/icon-play";
import styles from "./scraper-form.module.css";

interface ScraperFormProps {
  onSuccess: (data: ScrapedProduct | null) => void;
}

export function ScraperForm({ onSuccess }: ScraperFormProps) {
  const [triggerScrape, { isLoading, error, isError }] =
    useScrapeProductMutation();

  // Función para manejar el scraping
  const handleScrapeRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const $form = e.currentTarget as HTMLFormElement;

    const formData = new FormData($form);
    const productUrl = formData.get("product_url") as string;
    if (!productUrl) return;

    try {
      console.log("🕷️ scraper en acción en la url: ", productUrl);
      const ecommerceDomain = extractDomain(productUrl);
      console.log({ ecommerceDomain });

      if (!ecommerceDomain) {
        throw new CustomError("Dominio no soportado", {
          code: "VALIDATION_ERROR",
        });
      }

      const scrapedResult = await triggerScrape({
        site: ecommerceDomain,
        productUrl,
      }).unwrap();

      if (!scrapedResult) return;

      onSuccess(scrapedResult);
    } catch (error) {
      console.error("Error al realizar el scraping:", error);
      onSuccess(null);
    }
  };
  return (
    <>
      <form onSubmit={handleScrapeRequest} className={styles.scraperForm}>
        <FloatingInput
          type="url"
          description="Ej. www.amazon.com.mx/mi-producto-xyz"
          startIcon={<IconGlobe />}
          label="Url del producto"
          name="product_url"
          autoFocus={true}
        />
        <Button
          disabled={isLoading}        >
          {isLoading ? <IconLoaderCircle /> : <IconPlay />}
          <span>{isLoading ? "Scrapeando producto" : "Inicar scraper"}</span>
        </Button>
      </form>
      {isError && (
        <p>{(error as CustomError).message}</p>
      )}
    </>
  );
}
