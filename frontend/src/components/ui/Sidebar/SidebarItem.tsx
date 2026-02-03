import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';

interface SidebarItemProps {
	label: string;
	href: string;
	icon?: React.ComponentType | null;
}

export function SidebarItem({ label, href, icon: Icon }: SidebarItemProps) {
	const pathname = usePathname();
	const active = pathname === href;

	return (
    <li>
      {/* Es clave que tenga data-href para la búsqueda */}
      <Link data-href={href} href={href} className={`${styles.linkBase} ${active ? styles.linkActive : ''}`}>
        {label}
      </Link>
    </li>
  );
}
