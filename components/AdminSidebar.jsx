import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="adminSidebar">
      <h2>Admin Panel</h2>
      <Link href="/admin">Dashboard</Link>
      <Link href="/admin/products">Products</Link>
      <Link href="/admin/locations">Locations</Link>
      <Link href="/admin/inventory">Inventory</Link>
      <Link href="/admin/orders">Orders</Link>
      <Link href="/admin/alerts">Alerts</Link>
    </aside>
  );
}
