export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return <section className="container mx-auto min-h-screen">{children}</section>;
}
