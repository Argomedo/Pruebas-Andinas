import { ToastProvider } from "@/lib/store/ToastContext";
import "./admin.css"; // Admin Specific styles
import { cookies } from "next/headers";
import { AuthService } from "@/services/auth.service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Package, ShoppingBag, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session-token")?.value;

  if (!token) redirect("/login");

  let session;
  try {
    session = await AuthService.verifyToken(token);
    if (session.role !== "ADMIN") throw new Error();
  } catch {
    redirect("/dashboard");
  }

  return (
    <ToastProvider>
      <div className="admin-layout">
        
        {/* Sidebar exclusiva de Admin */}
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <ShieldCheck size={28} className="text-primary" />
            <h2>B2B Central</h2>
            <span className="brand-badge">Admin</span>
          </div>

          <nav className="admin-nav">
            <Link href="/admin" className="admin-nav-item">
              <ShoppingBag size={20} /> Pedidos Entrantes
            </Link>
            <Link href="/admin/inventario" className="admin-nav-item">
              <Package size={20} /> Gestión de Inventario
            </Link>
          </nav>

          <div className="admin-sidebar-footer">
            <form action={logoutAction}>
              <button type="submit" className="admin-logout-btn">
                <LogOut size={18} /> Salir del Sistema
              </button>
            </form>
          </div>
        </aside>

        {/* Content Area */}
        <main className="admin-main">
          {children}
        </main>
        
      </div>
    </ToastProvider>
  );
}
