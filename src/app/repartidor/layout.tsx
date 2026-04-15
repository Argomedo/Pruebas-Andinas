import { cookies } from "next/headers";
import { AuthService } from "@/services/auth.service";
import { UserRepository } from "@/db/repositories/user.repository";
import { redirect } from "next/navigation";
import { LogOut, Truck } from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import { ToastProvider } from "@/lib/store/ToastContext";

export default async function RepartidorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session-token")?.value;

  if (!token) redirect("/login");

  let session;
  let userName = "Repartidor";
  try {
    session = await AuthService.verifyToken(token);
    if (session.role !== "DISPATCHER" && session.role !== "ADMIN") {
      throw new Error();
    }
    const user = await UserRepository.findById(session.sub);
    if (user) userName = user.name;
  } catch {
    redirect("/dashboard");
  }

  return (
    <ToastProvider>
      <div className="mobile-app-layout">
        <header className="mobile-header">
          <div className="flex items-center gap-2">
            <Truck className="text-primary" />
            <h1 className="text-lg font-bold">Andina Go!</h1>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="mobile-logout">
              <LogOut size={20} />
            </button>
          </form>
        </header>

        <main className="mobile-content">
          <div className="mobile-user-banner">
            <p>Hola, <strong>{userName}</strong></p>
            <span className="text-xs opacity-70">Repartidor Oficial</span>
          </div>
          {children}
        </main>
        
        <style dangerouslySetInnerHTML={{ __html: `
          .mobile-app-layout {
            min-height: 100vh;
            background: #0a0a0b;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
          }
          .mobile-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: rgba(20, 20, 22, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
          }
          .mobile-logout {
            background: none;
            border: none;
            color: #ef4444;
            cursor: pointer;
            padding: 0.5rem;
          }
          .mobile-content {
            padding: 1rem;
            padding-bottom: 4rem;
          }
          .mobile-user-banner {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1));
            border-radius: 12px;
            border: 1px solid rgba(59, 130, 246, 0.3);
          }
          .mobile-logout:hover {
            opacity: 0.8;
          }
        `}} />
      </div>
    </ToastProvider>
  );
}
