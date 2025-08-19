import {Order, OrderData} from '../../modules/order/Order';
import {Customer} from '../../modules/customer/Customer';
import {db} from '../firebase';
import {addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where,} from 'firebase/firestore';
import DomModel from '../../modules/DomModel';

class OrderService {
	private async getCustomerFromFirebase(
		customerId: number
	): Promise<Customer | null> {
		const customerRef = collection(db, 'user');
		const q = query(customerRef, where('id', '==', customerId));
		const snapshot = await getDocs(q);
		if (!snapshot.empty) {
			const doc = snapshot.docs[0];
			const data = doc.data();
			const customer = new Customer(
				data.id,
				data.name || '',
				data.address || '',
				data.phone || '',
				data.email || '',
			);
			customer.uid = doc.id;
			return customer;
		}
		return null;
	}

	async createOrder(data: OrderData): Promise<Order> {
		// Check if customer exists in DomModel
		let customer = DomModel.getCustomerById(data.customerId);
		if (!customer) {
			customer = await this.getCustomerFromFirebase(data.customerId);
			if (customer) {
				DomModel.addCustomer(customer);
			} else {
				throw new Error('Customer not found');
			}
		}

		const order = new Order({
			...data,
			status: 'pending',
		});

		// Save to Firebase
		const docRef = await addDoc(collection(db, 'order'), { ...order });
		order.uid = docRef.id;

		// Add to DomModel
		DomModel.addOrder(order);

		return { uid: order.uid, ...order };
	}

	async getOrder(orderId: number): Promise<Order | null> {
		let order = DomModel.getOrderById(orderId);
		if (!order) {
			const orderRef = collection(db, 'order');
			const q = query(orderRef, where('id', '==', orderId));
			const snapshot = await getDocs(q);
			if (!snapshot.empty) {
				const doc = snapshot.docs[0];
				order = new Order(doc.data() as OrderData);
				order.uid = doc.id;
				DomModel.addOrder(order);
			} else {
				return null;
			}
		}
		return order;
	}

	async getOrdersByCustomer(customerId: number): Promise<Order[]> {
		const orderRef = collection(db, 'order');
		const q = query(orderRef, where('customerId', '==', customerId));
		const snapshot = await getDocs(q);
		return snapshot.docs.map(doc => {
			const orderData = doc.data() as OrderData;
			const order = new Order(orderData);
			order.uid = doc.id;
			DomModel.addOrder(order); // Add to DomModel if not already present
			return {uid: doc.id, ...orderData};
		});
	}

	async updateOrder(
		orderId: number,
		update: Partial<OrderData>
	): Promise<Order | null> {
		let order = DomModel.getOrderById(orderId);
		if (!order) {
			order = await this.getOrder(orderId);
			if (!order) return null;
		}

		Object.assign(order, update);

		if (order.uid) {
			const orderDoc = doc(db, 'order', order.uid);
			await updateDoc(orderDoc, update);
		}
		return order;
	}

	async deleteOrder(orderId: number): Promise<boolean> {
		const order = DomModel.getOrderById(orderId);
		if (order && order.uid) {
			await deleteDoc(doc(db, 'order', order.uid));
			return true;
		}
		return false;
	}

	async updateOrderStatus(
		orderId: number,
		status: string
	): Promise<Order | null> {
		let order = DomModel.getOrderById(orderId);
		if (!order) {
			order = await this.getOrder(orderId);
			if (!order) return null;
		}

		order.status = status as any;

		if (order.uid) {
			const orderDoc = doc(db, 'order', order.uid);
			await updateDoc(orderDoc, { status });
		}
		return order;
	}
}

export default OrderService;
