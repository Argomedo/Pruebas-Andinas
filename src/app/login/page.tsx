"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth.actions";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import "./login.css"; // Usa los estilos dedicados
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Plataforma Logística B2B</h1>
          <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
        </div>

        {state?.error && (
          <div className="error-banner">
            <AlertCircle size={16} />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="cliente@elsol.cl"
              className="form-input"
              required
              disabled={isPending}
              autoComplete="email"
            />
          </div>

          <div className="form-group" style={{ opacity: 0.6 }}>
            <label htmlFor="password" className="form-label">
              Contraseña (Mock: cualquier valor)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="form-input"
              disabled={isPending}
            />
          </div>

          <button type="submit" className="form-button" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Validando...
              </>
            ) : (
              <>
                Iniciar Sesión
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
