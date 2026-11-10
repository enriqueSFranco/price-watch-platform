'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import { submitScreapedProduct } from "@/actions/submitScrapedProduct";
// import { useAddProductMutation } from '@/sections/products/states/products.api';
// import { CustomError } from '@/modules/products/domain/errors/custom-error';
import { ScraperForm } from '@/sections/scraper/components/ScrapeProductForm';
import { AddRulesForm } from '@/sections/scraper/components/AddRulesForm';
import { Button } from '@/components/desing-system/Button/button';
import { ScrapedProduct } from '@/modules/scraper/domain/ScrapedProduct.schema';
import styles from './product-workflow.module.css';

// enums
enum CurrentStep {
	SCRAPER = 'scraper',
	RULES = 'rules',
}

// componente orquestador
export function ProductWorkflow() {
	const router = useRouter();
	const [productDetails, setProductDetails] = useState<ScrapedProduct | null>(null);
	// const [triggerAddProduct, { isLoading, error: addError, isError: hasAddError }] = useAddProductMutation();

	// Función para manejar la adición del producto
	const handleAddProduct = async () => {
	};

	const currentStep: CurrentStep = !productDetails ? CurrentStep.SCRAPER : CurrentStep.RULES;

	return (
		<>
			{currentStep === CurrentStep.SCRAPER && <ScraperForm onSuccess={setProductDetails} />}
			{currentStep === CurrentStep.RULES && (
				<div>
					<AddRulesForm />
					<Button onClick={handleAddProduct}>
						<span>Agregar producto</span>
					</Button>
				</div>
			)}
		</>
	);
}
