import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { ROUTES } from '@/config/my-routes';
import mockProducts from '@/mocks/data/products-by-user.json';
import mockPriceChart from '@/mocks/data/price-history.json';
import { CardMedia } from '@/sections/core/desing-system/Card/CardMedia';
import { Card } from '@/sections/core/desing-system/Card/Card';
import { CardContent } from '@/sections/core/desing-system/Card/CardContent';
import { NotificationRuleType, ProductType } from '@/core/types/product';
import PriceChartClient from '@/sections/price-history/components/PriceChartClient';
import { ProductDetails } from '@/sections/products/components/ProductDetails';

async function getProduct(productId: string): Promise<ProductType | null> {
	await new Promise((resolve) => setTimeout(resolve, 2000));
	const foundProduct = mockProducts.data.find((p) => p.id === productId);

	if (!foundProduct) {
		throw new Error('Producto no encontrado');
	}

	const parsedProduct: ProductType = {
		...foundProduct,
		notificationRules: foundProduct.notificationRules.map((rule) => ({
			...rule,
			type: rule.type as NotificationRuleType,
		})),
	};
	return parsedProduct;
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	// TODO: Recuperar el producto de la base de datos
	const product = (await getProduct(id)) as ProductType;

	if (!product) {
		notFound();
	}

	const { imageUrl, notificationRules } = product;

	return (
		<section className="grid grid-rows-12 col-span-10 divide-gray-600 divide-y">
			<div className="row-span-2">
				<Link href={ROUTES.MY_PRODUCTS}>mis productos</Link>
				<Suspense fallback={<div>loading</div>}>
					<Card orientation="horizontal">
						<CardContent>
							<CardMedia component="img" src={imageUrl} height="200" />
							<h2>{product?.name}</h2>
						</CardContent>
					</Card>
				</Suspense>
			</div>
			{/* Contenido principal: Detalles y gráfica */}
			<article className="h-full row-span-10 grid grid-cols-12">
				<ProductDetails product={product} />
				<div className="col-span-4">
					<h2 className="text-2xl font-bold mb-4">Historial de Precios</h2>
					<PriceChartClient data={mockPriceChart} />
				</div>
			</article>
		</section>
	);
}
