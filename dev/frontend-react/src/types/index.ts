// Import types from modules in parent directory
export type { Product } from "../../../modules/product/Product";
export type { Customer } from "../../../modules/customer/Customer";
export type { Order, OrderItem, OrderData } from "../../../modules/order/Order";
export type { Invoice, InvoiceData } from "../../../modules/invoice/Invoice";
export type { Payment, PaymentData } from "../../../modules/payment/Payment";

// Type aliases for convenience
export type OrderStatus =
  | "pending"
  | "accepted"
  | "paid"
  | "shipped"
  | "closed";
export type InvoiceStatus = "pending" | "issued" | "paid";
export type PaymentStatus = "pending" | "completed" | "failed";
export type PaymentMethod = "bank" | "card" | "cash";

// Cart types for local state management
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

// User role types
export type UserRole = "customer" | "accountant" | "";

export interface CreateOrderRequest {
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
  }>;
  paymentMethod: PaymentMethod;
  customerId?: number;
}
