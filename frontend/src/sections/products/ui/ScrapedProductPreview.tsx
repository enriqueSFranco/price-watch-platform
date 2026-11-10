'use client';
import { useState } from 'react';
import { Product } from '@/modules/products/domain/Product.schema';
import { ProductWorkflow } from './ProductWorkFlow';
import { CardMedia } from '@/components/desing-system/Card/CardMedia';
import { CardContent } from '@/components/desing-system/Card/CardContent';
import { Card } from '@/components/desing-system/Card/Card';

export function ScrapedProductPreview() {
	const [product, setProduct] = useState<Product | null>(null);
	// TODO: recuperar la información del producto scrapeado

	return (
		<section className="flex flex-col gap-8 w-full">
			<ProductWorkflow />
			{!product && (
				<article className="flex flex-col gap-2">
					<h2 className="text-md text-left text-black">Datos extraidos del producto</h2>
					<Card orientation="horizontal">
						<CardMedia
							component="img"
							height="100"
							src="https://ss423.liverpool.com.mx/xl/1180664480.jpg"
							alt="Consola PS5 de 1 TB edición Bundle Call of Duty"
						/>
						<CardContent>
							<footer className="flex flex-col gap-2 text-black">
								<span className="font-bold text-sm capitalize">Consola PS5 de 1 TB edición Bundle Call of Duty</span>
								<span>$18600</span>
							</footer>
						</CardContent>
					</Card>
				</article>
			)}
		</section>
	);
}
