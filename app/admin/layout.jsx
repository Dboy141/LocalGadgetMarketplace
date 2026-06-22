import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="adminLayout">
      <AdminSidebar />
      <div className="adminContent">{children}</div>
    </div>
  );
}
