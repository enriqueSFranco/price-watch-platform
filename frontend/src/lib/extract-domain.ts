import { EcommerceEnum } from "@/shared/types/e-commerce.enum";

export const extractDomain = (url: string): EcommerceEnum | null => {
  try {
    const parsedUrl = new URL(url);
    const { hostname } = parsedUrl;
    const hostnameLower = hostname.toLowerCase();

    for (const domain of Object.values(EcommerceEnum)) {
      // TODO: Validar que `ecommerceDomain` sea de tipo `EcommerceEnum`
      if (hostnameLower.includes(domain)) {
        return domain;
      }
    }
    return null;
  } catch (error) {
    console.error("URL de scraping inválida", error);
    return null;
  }
};
