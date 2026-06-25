"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/products", label: "Products" },
        { href: "/admin/locations", label: "Locations" },
        { href: "/admin/inventory", label: "Inventory" },
        { href: "/admin/orders", label: "Orders" },
        { href: "/admin/alerts", label: "Alerts" },
    ];

    return (
        <aside className="adminSidebar">
            <div className="adminSidebarHeader">
                <h2>Admin Panel</h2>
                <p>Manage store data</p>
            </div>

            <div className="adminSidebarLinks">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={pathname === link.href ? "adminLink activeAdminLink" : "adminLink"}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </aside>
    );
}