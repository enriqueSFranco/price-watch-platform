import { Sidebar } from "@/components/ui/Sidebar/Sidebar";
import { ModalProvider } from "@/context/modal-context";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

export const SIDEBAR_ITEMS = [
  { id: "home", label: "Home", href: "/dashboard", icon: null },
  { id: "products", label: "Products", href: "/products", icon: null },
];

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) redirect("/signin");

	return (
    // TODO: Arreglar las clases de colores para el layout con css modules
    <ModalProvider>
      <section className="w-full min-h-screen grid grid-cols-[260px_1fr] bg-black">
        <Sidebar items={SIDEBAR_ITEMS} />
        <article className="">
          {children}
        </article>
      </section>
    </ModalProvider>
  )
}
