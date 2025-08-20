import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API endpoints following the backend structure
export const productApi = {
  getAll: () => api.get("/products"),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (product: any) => api.post("/products", product),
  update: (id: number, product: any) => api.put(`/products/${id}`, product),
  delete: (id: number) => api.delete(`/products/${id}`),
};

export const orderApi = {
  getAll: () => api.get("/orders"),
  getById: (id: number) => api.get(`/orders/${id}`),
  getByUser: (userId: number) => api.get(`/orders/user/${userId}`),
  create: (order: any) => api.post("/orders", order),
  update: (id: number, order: any) => api.put(`/orders/${id}`, order),
  delete: (id: number) => api.delete(`/orders/${id}`),
  receive: (id: number) => api.post(`/orders/${id}/receive`),
  ship: (id: number) => api.post(`/orders/${id}/ship`),
  close: (id: number) => api.post(`/orders/${id}/close`),
};

export const customerApi = {
  getAll: () => api.get("/customers"),
  getById: (id: number) => api.get(`/customers/${id}`),
  create: (customer: any) => api.post("/customers", customer),
  update: (id: number, customer: any) => api.put(`/customers/${id}`, customer),
  delete: (id: number) => api.delete(`/customers/${id}`),
  createOrder: (order: any) => api.post("/customers/orders", order),
  getOrders: () => api.get("/customers/orders"),
  deleteOrder: (id: number) => api.delete(`/customers/orders/${id}`),
};

export const paymentApi = {
  getAll: () => api.get("/payments"),
  getById: (id: number) => api.get(`/payments/${id}`),
  getByInvoice: (invoiceId: number) =>
    api.get(`/payments/invoices/${invoiceId}`),
  create: (payment: any) => api.post("/payments", payment),
  update: (id: number, payment: any) => api.put(`/payments/${id}`, payment),
  delete: (id: number) => api.delete(`/payments/${id}`),
  accept: (id: number) => api.post(`/payments/accept/${id}`),
};

export const invoiceApi = {
  getAll: () => api.get("/invoices"),
  getById: (id: number) => api.get(`/invoices/${id}`),
  getByOrder: (orderId: number) => api.get(`/invoices/order/${orderId}`),
  create: (invoice: any) => api.post("/invoices", invoice),
  update: (id: number, invoice: any) => api.put(`/invoices/${id}`, invoice),
  delete: (id: number) => api.delete(`/invoices/${id}`),
  send: (orderId: number) => api.post(`/invoices/send/${orderId}`),
};
