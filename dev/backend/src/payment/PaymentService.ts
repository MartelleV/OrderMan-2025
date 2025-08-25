import { PrismaClient } from '@prisma/client';
import { Payment, PaymentData } from '../../../modules/payment/Payment';
import DomModel from '../../../modules/DomModel';
import OrderService from '../order/OrderService';
import { Invoice } from '../../../modules/invoice/Invoice';
import InvoiceService from '../invoice/InvoiceService';
import { Order } from '../../../modules/order/Order';

const prisma = new PrismaClient();

class PaymentService {
	private createPaymentFromRecord(record: any): Payment {
		const payment = new Payment({
			...record,
			amount: Number(record.amount),
		});
		DomModel.addPayment(payment);
		return payment;
	}

	async makePayment(paymentData: PaymentData): Promise<Payment> {
		// Find the invoice
		const invoice = await prisma.invoice.findUnique({
			where: { id: paymentData.invoiceId },
			include: { order: true },
		});

		if (!invoice) {
			throw new Error('Invoice not found');
		}

		// Create payment record
		const paymentRecord = await prisma.payment.create({
			data: {
				invoiceId: paymentData.invoiceId,
				amount: paymentData.amount,
				date: new Date(),
				status: 'completed', // Simple: payment is immediately completed
				method: paymentData.method,
			},
		});

		// Simple logic: Update order status to "paid"
		await prisma.order.update({
			where: { id: invoice.orderId },
			data: { status: 'paid' },
		});

		// Update invoice status to "paid"
		await prisma.invoice.update({
			where: { id: paymentData.invoiceId },
			data: { status: 'paid' },
		});

		return this.createPaymentFromRecord(paymentRecord);
	}

	async getPayment(paymentId: number): Promise<Payment | null> {
		let payment = DomModel.getPaymentById(paymentId);
		if (!payment) {
			const paymentRecord = await prisma.payment.findUnique({
				where: { id: paymentId },
			});

			if (paymentRecord) {
				payment = this.createPaymentFromRecord(paymentRecord);
			}
		}
		return payment || null;
	}

	async getPaymentsByInvoices(orderId: number): Promise<Payment[]> {
		const invoiceService = new InvoiceService();
		const invoices = await invoiceService.getInvoicesByOrder(orderId);
		const payments: Payment[] = [];

		for (const invoice of invoices) {
			const paymentRecords = await prisma.payment.findMany({
				where: { invoiceId: invoice.id },
				orderBy: { createdAt: 'desc' },
			});

			paymentRecords.forEach(record => {
				const payment = new Payment({
					id: record.id,
					invoiceId: record.invoiceId,
					amount: Number(record.amount),
					date: record.date,
					status: record.status as any,
					method: record.method as any,
					createdAt: record.createdAt,
					updatedAt: record.updatedAt,
				});
				DomModel.addPayment(payment);
				payments.push(payment);
			});
		}
		return payments;
	}

	async updatePayment(
		paymentId: number,
		update: Partial<PaymentData>
	): Promise<Payment | null> {
		try {
			const paymentRecord = await prisma.payment.update({
				where: { id: paymentId },
				data: {
					...update,
					amount: update.amount,
					status: update.status,
					method: update.method,
				},
			});

			const payment = new Payment({
				id: paymentRecord.id,
				invoiceId: paymentRecord.invoiceId,
				amount: Number(paymentRecord.amount),
				date: paymentRecord.date,
				status: paymentRecord.status as any,
				method: paymentRecord.method as any,
				createdAt: paymentRecord.createdAt,
				updatedAt: paymentRecord.updatedAt,
			});

			DomModel.addPayment(payment);
			return payment;
		} catch (error) {
			console.error('Error updating payment:', error);
			return null;
		}
	}

	async deletePayment(paymentId: number): Promise<boolean> {
		try {
			await prisma.payment.delete({
				where: { id: paymentId },
			});
			return true;
		} catch (error) {
			console.error('Error deleting payment:', error);
			return false;
		}
	}

	async acceptPayment(paymentId: number): Promise<{
		payment: Payment;
		invoice: Invoice;
		order: Order;
	}> {
		let payment = DomModel.getPaymentById(paymentId);
		if (!payment) {
			payment = await this.getPayment(paymentId);
			if (!payment) throw new Error('Payment not found');
		}

		const updatedPaymentRecord = await prisma.payment.update({
			where: { id: paymentId },
			data: { status: 'completed' },
		});

		payment.status = 'completed';

		const invoiceService = new InvoiceService();
		let invoice = DomModel.getInvoiceById(payment.invoiceId);
		if (!invoice) {
			invoice = await invoiceService.getInvoice(payment.invoiceId);
			if (!invoice) throw new Error('Invoice not found');
		}

		await prisma.invoice.update({
			where: { id: invoice.id },
			data: { status: 'paid' },
		});
		invoice.status = 'paid';

		const orderService = new OrderService();
		let order = DomModel.getOrderById(invoice.orderId);
		if (!order) {
			order = await orderService.getOrder(invoice.orderId);
			if (!order) throw new Error('Order not found');
		}

		await prisma.order.update({
			where: { id: order.id },
			data: { status: 'paid' },
		});
		order.status = 'paid';

		return { payment, invoice, order };
	}

	async getAllPayments(): Promise<Payment[]> {
		const paymentRecords = await prisma.payment.findMany({
			orderBy: { createdAt: 'desc' },
		});

		return paymentRecords.map(record => {
			const payment = new Payment({
				id: record.id,
				invoiceId: record.invoiceId,
				amount: Number(record.amount),
				date: record.date,
				status: record.status as any,
				method: record.method as any,
				createdAt: record.createdAt,
				updatedAt: record.updatedAt,
			});
			DomModel.addPayment(payment);
			return payment;
		});
	}
}

export default PaymentService;
