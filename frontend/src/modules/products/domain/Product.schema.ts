import { z } from 'zod';

// siempre datos primitivos (lo que viene de la DB/API)
const MonitoringStatus = z.enum(['active', 'paused', 'error', 'completed']);

const Store = z.enum(['liverpool', 'amazon']);

const parsePriceToCents = (v: string | number | undefined | null) => {
	if (v === undefined || v === null) return null;
	if (typeof v === 'number') return Math.round(v * 100);

	// strip non-digits except dot and comma
	const cleaned = String(v).replace(/[^0-9.,-]/g, '');
	if (cleaned === '') return null;

	// replace comma decimals with dot when needed (very simplistic)
	const normalized = cleaned.replace(/,(?=\d{3})/g, '').replace(',', '.');
	const n = Number(normalized);

	if (Number.isNaN(n)) return null;

	return Math.round(n * 100);
};

export const ProductSchema = z.object({
	id: z.uuidv4(),
	userId: z.uuidv4(),
	name: z.string().min(2, 'El nombre es demasiado corto.').max(200, 'El nombre es demasiado largo.'),
	initialPrice: z.number().nonnegative().nullable(), // precio inicial
	currentPrice: z.number().positive('El precio actual debe ser mayor a 0.'), // precio actualmente con descuento
	url: z.url().refine((u) => u.startsWith('https'), 'URL inválida o no soportada'),
	store: Store,
	imageUrl: z.url(),
	inStock: z.boolean().default(true),
	monitoringStatus: MonitoringStatus.default('active'),
	priceHistory: z
		.array(
			z.object({
				price: z.number().positive(),
				date: z.date(),
			}),
		)
		.default([]),
	lastScrapedAt: z.date().nullable().default(new Date()),
	createdAt: z.date(),
});

export type Product = z.infer<typeof ProductSchema>;
