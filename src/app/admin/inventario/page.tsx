import { AdminService } from "@/services/admin.service";
import { StockRow } from "./StockRow";

export default async function InventarioPage() {
  const catalog = await AdminService.getCatalog();

  return (
    <div className="admin-view">
      <div className="admin-page-header">
        <div>
          <h1>Gestión de Inventario (Bodega Central)</h1>
          <p>Supervisa las alertas de stock crítico y reabastece productos manualmente.</p>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ref. Venta</th>
              <th>Nombre del Producto</th>
              <th>Precio Unit.</th>
              <th>Categoría</th>
              <th>Stock Actual (Alerta)</th>
              <th>Ac. Rápida</th>
            </tr>
          </thead>
          <tbody>
            {catalog.map(product => (
              <StockRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
