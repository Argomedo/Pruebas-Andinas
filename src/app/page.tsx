import Link from "next/link";
import "./page.css";

export default function Home() {
  return (
    <main className="landing-page flex-col items-center justify-between">
      {/* Navbar Minimalista */}
      <header className="navbar container flex justify-between items-center glass-panel fade-in">
        <div className="brand flex items-center gap-2">
          <div className="logo-icon" />
          <h1 className="brand-name">Andina SpA</h1>
        </div>
        <nav className="nav-links flex gap-6">
          <Link href="/dashboard" className="nav-link text-muted">Catálogo</Link>
          <Link href="/login" className="btn btn-outline">Ingresar</Link>
          <Link href="/login" className="btn btn-primary">Crear Cuenta</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero container flex-col items-center slide-up">
        <div className="hero-badge fade-in">Nuevo Portal B2B</div>
        <h2 className="hero-title">Gestión de Pedidos Inteligente</h2>
        <p className="hero-subtitle text-muted">
          Optimiza el abastecimiento de tu minimarket. Revisa nuestro catálogo, haz tus pedidos en segundos y sigue el despacho en tiempo real.
        </p>

        <div className="hero-cta flex gap-4 mt-4">
          <Link href="/login" className="btn btn-primary btn-large">
            Comenzar Ahora
          </Link>
          <Link href="/dashboard" className="btn btn-outline btn-large">
            Ver Productos
          </Link>
        </div>

        {/* Dashboard Mockup - Glassmorphism Display */}
        <div className="dashboard-mockup glass-panel mt-4">
          <div className="mockup-header flex justify-between items-center mb-4">
            <h3 className="mockup-title">Últimos Pedidos</h3>
            <span className="status-badge status-success">Sistema en línea</span>
          </div>

          <div className="mockup-table flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mockup-row flex justify-between items-center p-6 border-rounded">
                <div className="row-info flex gap-4 items-center">
                  <div className="row-icon" />
                  <div>
                    <p className="font-semibold">Pedido #{1024 + i}</p>
                    <p className="text-muted text-sm">Hace 2 horas</p>
                  </div>
                </div>
                <div className="row-amount font-semibold">$145.900</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
