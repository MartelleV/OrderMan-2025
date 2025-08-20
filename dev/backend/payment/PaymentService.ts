import { Payment, PaymentData } from '../../modules/payment/Payment';
import { db } from '../firebase';
import {
	collection,
	addDoc,
	doc,
	getDocs,
	updateDoc,
	deleteDoc,
	query,
	where,
} from 'firebase/firestore';
import DomModel from '../../modules/DomModel';
import OrderService from '../order/OrderService';
import { Invoice } from '../../modules/invoice/Invoice';
import InvoiceService from '../invoice/InvoiceService';
import { Order } from '../../modules/order/Order';

class PaymentService {
	async makePayment(invoiceId: number): Promise<Payment> {
		let invoice = DomModel.getInvoiceById(invoiceId);
		if (!invoice) {
			const invoiceService = new InvoiceService();
			invoice = await invoiceService.getInvoice(invoiceId);
			if (!invoice) throw new Error('Invoice not found');
		}

		const payment = new Payment({
			id: Date.now(),
			invoiceId: invoice.id,
			date: new Date(),
			amount: invoice.amount,
			status: 'pending',
			method: invoice.method,
		});
		const docRef = await addDoc(collection(db, 'payment'), { ...payment });
		payment.uid = docRef.id;
		DomModel.addPayment(payment);
		return { uid: payment.uid, ...payment };
	}

	async getPayment(paymentId: number): Promise<Payment | null> {
		let payment = DomModel.getPaymentById(paymentId);
		if (!payment) {
			const paymentRef = collection(db, 'payment');
			const q = query(paymentRef, where('id', '==', paymentId));
			const snapshot = await getDocs(q);
			if (!snapshot.empty) {
				const doc = snapshot.docs[0];
				payment = new Payment(doc.data() as PaymentData);
				payment.uid = doc.id;
				DomModel.addPayment(payment);
			} else {
				return null;
			}
		}
		return payment;
	}

	async getPaymentsByInvoices(orderId: number): Promise<Payment[]> {
		const invoiceService = new InvoiceService();
		const invoices = await invoiceService.getInvoicesByOrder(orderId);
		const payments: Payment[] = [];

		for (const invoice of invoices) {
			const paymentRef = collection(db, 'payment');
			const q = query(paymentRef, where('invoiceId', '==', invoice.id));
			const snapshot = await getDocs(q);

			snapshot.docs.forEach(doc => {
				const paymentData = doc.data() as PaymentData;
				const payment = new Payment(paymentData);
				payment.uid = doc.id;
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
		let payment = DomModel.getPaymentById(paymentId);
		if (!payment) {
			payment = await this.getPayment(paymentId);
			if (!payment) return null;
		}

		Object.assign(payment, update);

		if (payment.uid) {
			const paymentDoc = doc(db, 'payment', payment.uid);
			await updateDoc(paymentDoc, update);
		}
		return payment;
	}

	async deletePayment(paymentId: number): Promise<boolean> {
		const payment = DomModel.getPaymentById(paymentId);
		if (payment && payment.uid) {
			await deleteDoc(doc(db, 'payment', payment.uid));
			return true;
		}
		return false;
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

		payment.status = 'completed';
		if (payment.uid) {
			await updateDoc(doc(db, 'payment', payment.uid), {
				status: 'completed',
			});
		}

		const invoiceService = new InvoiceService();
		let invoice = DomModel.getInvoiceById(payment.invoiceId);
		if (!invoice) {
			invoice = await invoiceService.getInvoice(payment.invoiceId);
			if (!invoice) throw new Error('Invoice not found');
			DomModel.addInvoice(invoice);
		}

		invoice.status = 'paid';
		if (invoice.uid) {
			await updateDoc(doc(db, 'invoice', invoice.uid), {
				status: 'paid',
			});
		}

		const orderService = new OrderService();
		let order = DomModel.getOrderById(invoice.orderId);
		if (!order) {
			order = await orderService.getOrder(invoice.orderId);
			if (!order) throw new Error('Order not found');
			DomModel.addOrder(order);
		}

		order.status = 'paid';
		if (order.uid) {
			await updateDoc(doc(db, 'order', order.uid), {
				status: 'paid',
			});
		}

		return { payment, invoice, order };
	}
}

export default PaymentService;
