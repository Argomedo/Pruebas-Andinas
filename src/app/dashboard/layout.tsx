import { ToastProvider } from "@/lib/store/ToastContext";
import { CartProvider } from "@/lib/store/CartContext";
import { TopNav } from "@/components/TopNav";
import { CartSidebar } from "@/components/CartSidebar";
import "./dashboard.css"; // Estilos exclusivos del dashboard
import { cookies } from "next/headers";
import { AuthService } from "@/services/auth.service";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session-token")?.value;

  if (!token) {
    redirect("/login");
  }

  let session;
  try {
    session = await AuthService.verifyToken(token);
  } catch {
    redirect("/login");
  }

  return (
    <ToastProvider>
      <CartProvider>
        <div className="dashboard-layout">
          {/* Top navigation containing User Profile & Logout */}
          <TopNav userRole={session.role} />
          
          <main className="dashboard-main">
            {children}
          </main>
          
          {/* El carrito lateral deslizable */}
          <CartSidebar />
        </div>
      </CartProvider>
    </ToastProvider>
  );
}
