import { PrismaClient } from '@prisma/client';
import { Invoice, InvoiceData } from '../../../modules/invoice/Invoice';
import OrderService from '../order/OrderService';
import DomModel from '../../../modules/DomModel';

const prisma = new PrismaClient();

class InvoiceService {
	private createInvoiceFromRecord(record: any): Invoice {
		const invoice = new Invoice({
			...record,
			amount: Number(record.amount),
		});
		DomModel.addInvoice(invoice);
		return invoice;
	}

	async createInvoice(data: InvoiceData): Promise<Invoice> {
		const invoiceRecord = await prisma.invoice.create({ data });
		return this.createInvoiceFromRecord(invoiceRecord);
	}

	async getInvoice(invoiceId: number): Promise<Invoice | null> {
		let invoice = DomModel.getInvoiceById(invoiceId);
		if (!invoice) {
			const invoiceRecord = await prisma.invoice.findUnique({
				where: { id: invoiceId },
			});
			if (invoiceRecord) {
				invoice = this.createInvoiceFromRecord(invoiceRecord);
			}
		}
		return invoice || null;
	}

	async getInvoicesByOrder(orderId: number): Promise<Invoice[]> {
		const invoiceRecords = await prisma.invoice.findMany({
			where: { orderId },
			orderBy: { createdAt: 'desc' },
		});
		return invoiceRecords.map(record =>
			this.createInvoiceFromRecord(record)
		);
	}

	async updateInvoice(
		invoiceId: number,
		update: Partial<InvoiceData>
	): Promise<Invoice | null> {
		try {
			const invoiceRecord = await prisma.invoice.update({
				where: { id: invoiceId },
				data: update,
			});
			return this.createInvoiceFromRecord(invoiceRecord);
		} catch (error) {
			console.error('Error updating invoice:', error);
			return null;
		}
	}

	async deleteInvoice(invoiceId: number): Promise<boolean> {
		try {
			await prisma.invoice.delete({
				where: { id: invoiceId },
			});
			return true;
		} catch (error) {
			console.error('Error deleting invoice:', error);
			return false;
		}
	}

	async sendInvoice(orderId: number): Promise<Invoice | null> {
		let order = DomModel.getOrderById(orderId);
		if (!order) {
			const orderService = new OrderService();
			order = await orderService.getOrder(orderId);
			if (!order) throw new Error('Order not found');
		}

		const existingInvoice = await prisma.invoice.findUnique({
			where: { orderId },
		});
		if (existingInvoice) {
			throw new Error('Invoice already exists for this order');
		}

		const invoiceRecord = await prisma.invoice.create({
			data: {
				orderId: order.id,
				date: new Date(),
				amount: order.totalAmount,
				status: 'issued',
				method: order.method,
			},
		});

		return this.createInvoiceFromRecord(invoiceRecord);
	}

	async getAllInvoices(): Promise<Invoice[]> {
		const invoiceRecords = await prisma.invoice.findMany({
			orderBy: { createdAt: 'desc' },
		});

		return invoiceRecords.map(record =>
			this.createInvoiceFromRecord(record)
		);
	}
}

export default InvoiceService;
