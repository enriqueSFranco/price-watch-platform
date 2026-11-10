import { NextResponse } from 'next/server';
import mockProducts from '@/__mocks__/products.json';

export async function GET(req: Request) {
	return new Response(JSON.stringify(mockProducts), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

export async function POST(request: Request) {
	const body = request.json();
}
