import { z } from "zod";

export const UserRoleSchema = z.enum(["CLIENT", "DISPATCHER", "ADMIN"]);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2),
  role: UserRoleSchema,
  createdAt: z.date(),
});

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  category: z.string(),
});

export const OrderStatusSchema = z.enum([
  "PENDING",
  "IN_PREPARATION",
  "READY_FOR_DISPATCH",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
]);

export const OrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

export const OrderSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  status: OrderStatusSchema,
  items: z.array(OrderItemSchema).min(1),
  total: z.number().positive(),
  dispatcherId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Tipos Inferidos
export type User = z.infer<typeof UserSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
