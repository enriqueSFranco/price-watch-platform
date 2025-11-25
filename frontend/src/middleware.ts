import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/dashboard', '/products'];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Permitir archivos internos de Next
	if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
		return NextResponse.next();
	}

	// Revisar sesión
	const session = request.cookies.get('session')?.value;
	const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

	if (isProtected && !session) {
		const url = request.nextUrl.clone();
		url.pathname = '/signin';
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*', '/products/:path*'],
};
