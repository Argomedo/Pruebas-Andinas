import type { User, Product, Order } from "@/types";

type MockDatabase = {
  users: Map<string, User>;
  products: Map<string, Product>;
  orders: Map<string, Order>;
};

const globalForDb = globalThis as unknown as {
  mockDb: MockDatabase | undefined;
};

// Seed Data definition
function seedData(db: MockDatabase) {
  if (db.users.size > 0) return;

  // -- Usuarios --
  const adminId = "00000000-0000-0000-0000-000000000001";
  const dispatcherId = "00000000-0000-0000-0000-000000000002";
  const clientId = "00000000-0000-0000-0000-000000000003";

  db.users.set(adminId, {
    id: adminId,
    name: "Admin Distribuidora",
    email: "admin@andina.cl",
    role: "ADMIN",
    createdAt: new Date(),
  });

  db.users.set(dispatcherId, {
    id: dispatcherId,
    name: "Juan Pérez (Repartidor)",
    email: "despacho@andina.cl",
    role: "DISPATCHER",
    createdAt: new Date(),
  });

  db.users.set(clientId, {
    id: clientId,
    name: "Minimarket El Sol",
    email: "cliente@elsol.cl",
    role: "CLIENT",
    createdAt: new Date(),
  });

  // -- Productos --
  const p1 = "11111111-1111-1111-1111-111111111111";
  const p2 = "22222222-2222-2222-2222-222222222222";
  const p3 = "33333333-3333-3333-3333-333333333333";
  const p4 = "44444444-4444-4444-4444-444444444444";
  const p5 = "55555555-5555-5555-5555-555555555555";

  db.products.set(p1, { id: p1, name: "Bebida Cola 2.5L", price: 1800, stock: 50, category: "Bebidas" });
  db.products.set(p2, { id: p2, name: "Papas Fritas Corte Americano 500g", price: 2500, stock: 30, category: "Snacks" });
  db.products.set(p3, { id: p3, name: "Cerveza Cristal Lata 473cc (Pack 6)", price: 4200, stock: 100, category: "Bebidas" });
  db.products.set(p4, { id: p4, name: "Galletas de Chocolate 150g", price: 850, stock: 0, category: "Alimentos" }); // Sin stock intencionalmente para pruebas
  db.products.set(p5, { id: p5, name: "Agua Mineral sin gas 1.5L", price: 900, stock: 200, category: "Bebidas" });
}

export const mockDb =
  globalForDb.mockDb ??
  {
    users: new Map(),
    products: new Map(),
    orders: new Map(),
  };

if (process.env.NODE_ENV !== "production") globalForDb.mockDb = mockDb;

seedData(mockDb);

export async function simulateQueryLatency(ms: number = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
