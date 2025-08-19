import { Invoice } from '../../modules/invoice/Invoice';
import { Order } from '../../modules/order/Order';
import { Payment, PaymentData } from '../../modules/payment/Payment';
import PaymentService from './PaymentService';

class PaymentController {
	private paymentService: PaymentService;

	constructor() {
		this.paymentService = new PaymentService();
	}

	async makePayment(invoiceId: number): Promise<Payment> {
		return this.paymentService.makePayment(invoiceId);
	}

	async getPayment(paymentId: number): Promise<Payment | null> {
		return this.paymentService.getPayment(paymentId);
	}

	async getPaymentsByInvoices(invoiceId: number): Promise<Payment[]> {
		return this.paymentService.getPaymentsByInvoices(invoiceId);
	}

	async updatePayment(
		paymentId: number,
		update: Partial<PaymentData>
	): Promise<Payment | null> {
		return this.paymentService.updatePayment(paymentId, update);
	}

	async deletePayment(paymentId: number): Promise<boolean> {
		return this.paymentService.deletePayment(paymentId);
	}

	async acceptPayment(paymentId: number): Promise<{
		payment: Payment;
		invoice: Invoice;
		order: Order;
	}> {
		return this.paymentService.acceptPayment(paymentId);
	}
}

export default PaymentController;
