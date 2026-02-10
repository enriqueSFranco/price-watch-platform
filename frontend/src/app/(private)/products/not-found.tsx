import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center flex-col bg-white text-black">
			<h1 className="text-4xl font-bold mb-4">Producto no encontrado</h1>
			<p className="text-lg mb-6">Lo sentimos, no pudimos encontrar el producto que estás buscando.</p>
			<Link href="/" className="text-blue-600 hover:underline">
				Volver al inicio
			</Link>
		</div>
	);
}
