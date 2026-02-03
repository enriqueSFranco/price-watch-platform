import { Button } from '@/components/desing-system/Button/button';
import { TextInput } from '@/components/desing-system/TextInput/TextInput';
import { extractDomain } from '@/modules/scraper/extract-domain';
// import { IconGlobe } from "@/ui/atoms/Icons/icon-globe";

interface ScraperFormProps {
	onSuccess: (data: any) => void;
}

export function ScraperForm({ onSuccess }: ScraperFormProps) {
	// const [triggerScrape, { isLoading, error, isError }] = useScrapeProductMutation();

	// Función para manejar el scraping
	const handleScrapeRequest = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const $form = e.currentTarget as HTMLFormElement;
	};

	return (
		<div className="flex flex-col w-full">
			<form onSubmit={handleScrapeRequest} className="w-full flex items-start justify-center gap-4">
				<TextInput
					type="url"
					description="Ej. www.amazon.com.mx/mi-producto-xyz"
					prefixIcon={
						<span className="h-full inline-flex items-center bg-gray-300 text-gray-600 text-sm">https://</span>
					}
					label="url del producto"
					name="product_url"
					autoFocus={true}
				/>
				<Button color="success" disabled={false}>
        <span>▶️</span>
				</Button>
			</form>
		</div>
	);
}
