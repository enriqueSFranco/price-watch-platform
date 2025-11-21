import { Store } from "../../infrastructure/store.enums";

const DOMAIN_MAP: { [key: string]: Store } = {
  liverpool: Store.Liverpool,
  amazon: Store.Amazon,
};

export class ScrapedProductURL {
  private readonly MULTI_PART_TLDS = ["com.mx", "com.ar", "co.uk", "com.br"];

  constructor(private readonly value: string) {
    if (!value.startsWith("https") || value === null || value === undefined) {
      throw new Error("URL inválida");
    }
  }

  static create(value: string): ScrapedProductURL {
    return new ScrapedProductURL(value);
  }

  getParsedUrl() {
    return new URL(this.value);
  }

  /**
   * @description Extrae el nombre del sitio web de una URL de producto
   * Esta función es fundamental para saber que scraper utilizar
   * @param url - Es la URL del producto
   * @returns El valor Store correspondiente o null si el sitio no esta sorpotado
   */
  private getSecondLevelDomain(): string {
    const hostname = this.getParsedUrl().hostname.toLowerCase();

    const parts = hostname.replace(/^www\./, "").split(".");

    const tld = parts.slice(-2).join(".");
    if (this.MULTI_PART_TLDS.includes(tld)) return parts[parts.length - 3];
    return parts[parts.length - 2];
  }

  public getStore(): Store | null {
    const slDomain = this.getSecondLevelDomain();

    if (slDomain === "") return null;

    return DOMAIN_MAP[slDomain] || null;
  }

  /**
   * @description Extrae el host limpio (sin 'www.') y el path de la URL.
   * @returns
   */
  extractHostAndPath = (): { urlHost: string; urlPath: string } => {
    const parsedUrl = this.getParsedUrl();
    const cleanHost = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();
    const cleanPath = parsedUrl.pathname;
    return { urlHost: cleanHost, urlPath: cleanPath };
  };

  equals(other: ScrapedProductURL) {
    if (!(other instanceof ScrapedProductURL)) return false;
    return this.value === other.value;
  }
}
