import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const body = await request.json();

	if (body.email === 'demo@demo.com' && body.password === 'qwerty1234') {
		return NextResponse.json({
			ok: true,
			user: {
				id: 'fake-id-123',
				email: 'test@test.com',
			},
		});
	}
	return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 });
}
