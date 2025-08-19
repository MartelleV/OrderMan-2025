import { Customer } from './customer/Customer';
import { Order } from './order/Order';
import { Invoice } from './invoice/Invoice';
import { Payment } from './payment/Payment';
import { Product } from './product/Product';

class DomModel {
	private static instance: DomModel;
	public customers: Map<number, Customer> = new Map();
	public orders: Map<number, Order> = new Map();
	public invoices: Map<number, Invoice> = new Map();
	public payments: Map<number, Payment> = new Map();
	public products: Map<number, Product> = new Map();

	private constructor() {
		// Private constructor for singleton pattern
	}

	public static getInstance(): DomModel {
		if (!DomModel.instance) {
			DomModel.instance = new DomModel();
		}
		return DomModel.instance;
	}

	// Customer methods
	public addCustomer(customer: Customer): void {
		if (!this.customers.has(customer.id)) {
			this.customers.set(customer.id, customer);
		}
	}

	public getCustomerById(id: number): Customer | null {
		return this.customers.get(id) || null;
	}

	// Order methods
	public addOrder(order: Order): void {
		if (!this.orders.has(order.id)) {
			this.orders.set(order.id, order);
		}
	}

	public getOrderById(id: number): Order | null {
		return this.orders.get(id) || null;
	}

	// Invoice methods
	public addInvoice(invoice: Invoice): void {
		if (!this.invoices.has(invoice.id)) {
			this.invoices.set(invoice.id, invoice);
		}
	}

	public getInvoiceById(id: number): Invoice | null {
		return this.invoices.get(id) || null;
	}

	public getInvoiceByOrderId(orderId: number): Invoice | null {
		for (const invoice of this.invoices.values()) {
			if (invoice.orderId === orderId) {
				return invoice;
			}
		}
		return null;
	}

	// Payment methods
	public addPayment(payment: Payment): void {
		if (!this.payments.has(payment.id)) {
			this.payments.set(payment.id, payment);
		}
	}

	public getPaymentById(id: number): Payment | null {
		return this.payments.get(id) || null;
	}

	// Product methods
	public addProduct(product: Product): void {
		if (!this.products.has(product.id)) {
			this.products.set(product.id, product);
		}
	}

	public getProductById(id: number): Product | undefined {
		return this.products.get(id);
	}
}

export default DomModel.getInstance();
