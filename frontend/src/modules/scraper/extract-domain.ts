import { Provider } from '@/modules/spider/domain/enums';

export const extractDomain = (url: string): Provider | null => {
	try {
		const parsedUrl = new URL(url);
		const { hostname } = parsedUrl;
		const hostnameLower = hostname.toLowerCase();

		for (const domain of Object.values(Provider)) {
			// TODO: Validar que `ProviderDomain` sea de tipo `Provider`
			if (hostnameLower.includes(domain)) {
				return domain;
			}
		}
		return null;
	} catch (error) {
		console.error('URL de scraping inválida', error);
		return null;
	}
};
