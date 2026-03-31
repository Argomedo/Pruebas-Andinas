import { ProductService } from "@/services/product.service";
import { ProductCard } from "@/components/ProductCard";

export default async function DashboardPage() {
  const catalog = await ProductService.getCatalog();

  return (
    <div className="catalog-view">
      <div className="catalog-header">
        <h1>Catálogo de Productos</h1>
        <p>Añade los productos que necesitas reabastecer a tu carrito de compras B2B.</p>
      </div>

      <div className="catalog-grid">
        {catalog.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
