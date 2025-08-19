import {Invoice, InvoiceData} from '../../modules/invoice/Invoice';
import OrderService from '../order/OrderService';
import {db} from '../firebase';
import {addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where,} from 'firebase/firestore';
import DomModel from '../../modules/DomModel';

class InvoiceService {
	async createInvoice(data: InvoiceData): Promise<Invoice> {
		const invoice = new Invoice(data);
		const docRef = await addDoc(collection(db, 'invoice'), { ...invoice });
		invoice.uid = docRef.id;
		DomModel.addInvoice(invoice);
		return { uid: invoice.uid, ...invoice };
	}

	async getInvoice(invoiceId: number): Promise<Invoice | null> {
		let invoice = DomModel.getInvoiceById(invoiceId);
		if (!invoice) {
			const invoiceRef = collection(db, 'invoice');
			const q = query(invoiceRef, where('id', '==', invoiceId));
			const snapshot = await getDocs(q);
			if (!snapshot.empty) {
				const doc = snapshot.docs[0];
				invoice = new Invoice(doc.data() as InvoiceData);
				invoice.uid = doc.id;
				DomModel.addInvoice(invoice);
			} else {
				return null;
			}
		}
		return invoice;
	}

	async getInvoicesByOrder(orderId: number): Promise<Invoice[]> {
		const invoiceRef = collection(db, 'invoice');
		const q = query(invoiceRef, where('orderId', '==', orderId));
		const snapshot = await getDocs(q);
		return snapshot.docs.map(doc => {
			const invoiceData = doc.data() as InvoiceData;
			const invoice = new Invoice(invoiceData);
			invoice.uid = doc.id;
			DomModel.addInvoice(invoice);
			return {uid: doc.id, ...invoiceData};
		});
	}

	async updateInvoice(
		invoiceId: number,
		update: Partial<InvoiceData>
	): Promise<Invoice | null> {
		let invoice = DomModel.getInvoiceById(invoiceId);
		if (!invoice) {
			invoice = await this.getInvoice(invoiceId);
			if (!invoice) return null;
		}

		Object.assign(invoice, update);

		if (invoice.uid) {
			const invoiceDoc = doc(db, 'invoice', invoice.uid);
			await updateDoc(invoiceDoc, update);
		}
		return invoice;
	}

	async deleteInvoice(invoiceId: number): Promise<boolean> {
		const invoice = DomModel.getInvoiceById(invoiceId);
		if (invoice && invoice.uid) {
			await deleteDoc(doc(db, 'invoice', invoice.uid));
			return true;
		}
		return false;
	}

	async sendInvoice(orderId: number): Promise<Invoice | null> {
		let order = DomModel.getOrderById(orderId);
		if (!order) {
			const orderService = new OrderService();
			order = await orderService.getOrder(orderId);
			if (!order) throw new Error('Order not found');
		}

		const existingInvoice = DomModel.getInvoiceByOrderId(orderId);
		if (existingInvoice) {
			throw new Error('Invoice already exists for this order');
		}

		const invoiceData: InvoiceData = {
			id: Date.now(),
			orderId: order.id,
			date: new Date(),
			amount: order.totalAmount,
			status: 'pending',
			paymentMethod: order.paymentMethod,
		};
		const invoice = new Invoice(invoiceData);

		const docRef = await addDoc(collection(db, 'invoice'), { ...invoice });
		invoice.uid = docRef.id;
		DomModel.addInvoice(invoice);

		invoice.status = 'issued';
		if (invoice.uid) {
			await updateDoc(doc(db, 'invoice', invoice.uid), {
				status: 'issued',
			});
		}

		return invoice;
	}
}

export default InvoiceService;
