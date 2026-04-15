import { AdminService } from "@/services/admin.service";
import { TrendingUp, Package, AlertTriangle, DollarSign } from "lucide-react";

export default async function ReportesPage() {
  const reports = await AdminService.getSalesReport();

  return (
    <div className="admin-reports">
      <div className="admin-page-header">
        <h1>Reportes de Negocio</h1>
        <p>Análisis de rendimiento, ingresos y control de existencias críticas.</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon revenue-icon">
            <DollarSign size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Ingresos Totales (Neto)</span>
            <h2 className="metric-value">${reports.totalRevenue.toLocaleString("es-CL")}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon orders-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Pedidos Totales</span>
            <h2 className="metric-value">{reports.totalOrders}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon stock-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Items Stock Crítico</span>
            <h2 className="metric-value">{reports.criticalStockCount}</h2>
          </div>
        </div>
      </div>

      <div className="reports-details-grid">
        <div className="report-section glass-panel">
          <h3>Órdenes por Estado</h3>
          <div className="status-bars">
            {Object.entries(reports.ordersByStatus).map(([status, count]) => (
              <div key={status} className="status-bar-item">
                <div className="status-bar-label">
                  <span>{status}</span>
                  <span>{count}</span>
                </div>
                <div className="bar-bg">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${(count / reports.totalOrders) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="report-section glass-panel">
          <h3>Alerta de Reposición</h3>
          <ul className="critical-stock-list">
            {reports.criticalStock.length === 0 ? (
              <p className="text-muted">No hay items con stock crítico.</p>
            ) : (
              reports.criticalStock.map(product => (
                <li key={product.id} className="critical-item">
                  <Package size={16} />
                  <span>{product.name}</span>
                  <span className="stock-badge">Solo {product.stock} un.</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
