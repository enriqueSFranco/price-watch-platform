'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { cn } from '@/lib/cn';
import type { Product } from '@/modules/products/domain/Product.schema';
import { useOptimisticProducts } from '@/sections/products/hooks/use-optimistic-products';
import { useModalDispatch } from '@/context/modal-context';

import { ProductActions } from '@/sections/products/ui/product-actions';
import { ScrapedProductPreview } from '@/sections/products/ui/ScrapedProductPreview';

import { ProductTable } from '@/sections/products/components/ProductTable';
import { Button } from '@/components/desing-system/Button/button';
import { Navbar } from '@/components/desing-system/Navbar/navbar';
import { TextInput } from '@/components/desing-system/TextInput/TextInput';
import { Pagination } from '@/components/ui/pagination/Pagination';
import styles from './products.module.css';

export default function Page() {
	const [searchQuery, setSearchQuery] = useState('');
	const router = useRouter();
	const debouncedSearch = useDebouncedCallback((value) => {
		setSearchQuery(value);
	}, 500);
	const { openModal } = useModalDispatch();
	// const { data, isLoading, isError } = useSearchProductsQuery(searchQuery);
	// const [editProduct] = useEditProductMutation();
	// const [deleteProduct] = useDeleteProductMutation();
	// const [optimisticProducts, { optimisticUpdateProduct, optimisticDeleteProduct }] = useOptimisticProducts(data?.data);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSearch(e.target.value);
		console.log(`busqueda con debounced ${e.target.value}`);
	};

	// const handleDeleteProduct = async (productId: string) => {
	// 	optimisticDeleteProduct(productId);
	// 	try {
	// 		// await deleteProduct(productId).unwrap();
	// 		console.log('eliminando el producto: ', productId);
	// 	} catch (error) {
	// 		console.error('Error al eliminar el producto', error);
	// 	}
	// };

	// const handleViewProduct = (product: Product) => {
	// 	console.log(`detalles del product ${product.id}`);

	// 	router.push(`${ROUTES.MY_PRODUCTS}/${product.id}`);
	// };

	// const handleUpdateProduct = async (product: Product) => {
	// 	optimisticUpdateProduct(product);
	// };

	const handleOpenModal = () => {
		openModal({
			title: 'Agregar producto',
			content: <ScrapedProductPreview />,
			footerButtons: (
				<Button color="error">
					<span>cancelar</span>
				</Button>
			),
		});
	};

	return (
		<div className={cn('flex flex-col', styles.dashboard)}>
			<Button color="secondary" onClick={handleOpenModal}>
				<span className="text-xs font-light">Agregar producto</span>
			</Button>
			<div className="px-3 py-1.5 flex flex-col justify-between gap-3 h-full max-h-screen overflow-hidden">
				<Navbar>
					<Navbar.Left>
						<TextInput sx="lg" value={searchQuery} onChange={handleSearchChange} />
					</Navbar.Left>
					<Navbar.Right>
						<Button color="secondary" onClick={handleOpenModal}>
							<span className="text-xs font-light">Agregar producto</span>
						</Button>
					</Navbar.Right>
				</Navbar>
				<ProductTable />
				{/* <Pagination currentPage={1} totalPages={data?.data ? data?.data.length / 5 : 1} onPageChange={() => {}} /> */}
			</div>
		</div>
	);
}
/**
Productos

Objetivo: Listado de todos los productos que estás monitoreando.

Qué mostrar en UI:
  -Lista de productos con: nombre, tienda, precio actual, último scrape, estado
  -Filtros por tienda, estado, fecha de creación
  -Buscar por nombre o URL
  -Botones de acción: editar, eliminar, volver a scrapeear

Componentes UI:
  -Table / List
  -Filter bar
  -Buttons para acciones rápidas
  -Modal para ver detalle de producto
  -Extras UX: color de estado (verde = activo, naranja = pausado, rojo = error)
 */
