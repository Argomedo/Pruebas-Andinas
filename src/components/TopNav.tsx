"use client";

import { LogOut, ShoppingCart, Package } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/actions/auth.actions";
import { useCart } from "@/lib/store/CartContext";

export function TopNav({ userRole }: { userRole: string }) {
  const { totalItems, setCartOpen } = useCart();

  return (
    <header className="topnav">
      <div className="topnav-left">
        <Link href="/dashboard" className="topnav-brand">
          <Package size={24} className="text-primary" />
          <span>Andina B2B</span>
        </Link>
        <nav className="topnav-links">
          <Link href="/dashboard" className="nav-link">Catálogo</Link>
          <Link href="/dashboard/pedidos" className="nav-link">Mis Pedidos</Link>
          {userRole === "ADMIN" && (
            <span className="nav-badge admin">Modo Admin</span>
          )}
        </nav>
      </div>

      <div className="topnav-right">
        <button className="cart-trigger" onClick={() => setCartOpen(true)}>
          <ShoppingCart size={20} />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
        
        <form action={logoutAction}>
          <button type="submit" className="logout-btn">
            <LogOut size={18} />
            <span className="hide-mobile">Salir</span>
          </button>
        </form>
      </div>
    </header>
  );
}
