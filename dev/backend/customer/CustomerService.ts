import Customer from '../../modules/customer/Customer';
import OrderService from '../order/OrderService';
import { Order, OrderData, OrderItem } from '../../modules/order/Order';
import {
	db,
	auth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from '../firebase';
import {
	doc,
	getDoc,
	setDoc,
} from 'firebase/firestore';
import DomModel from '../../modules/DomModel';

class CustomerService {
	private orderService: OrderService;
	private customer: Customer;

	constructor(customer: Customer) {
		this.orderService = new OrderService();
		this.customer = customer;
	}

	// Sign Up
	async signUp(email: string, password: string): Promise<void> {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		const userId = Date.now(); // Simple ID generator

		const customer = new Customer(userId, '', '', '', ''); // Minimal data, updated later
		customer.uid = user.uid;

		// Check for existing document
		const userDocRef = doc(db, 'user', user.uid);
		const existingDoc = await getDoc(userDocRef);
		if (existingDoc.exists()) {
			throw new Error('User already exists');
		}

		await setDoc(userDocRef, {
			uid: user.uid,
			id: userId,
			orders: [],
		});

		DomModel.addCustomer(customer);
	}

	// Sign In
	async signIn(email: string, password: string): Promise<void> {
		await signInWithEmailAndPassword(auth, email, password);
		// No role check needed, handled by controller
	}

	// Sign Out
	async signOutUser(): Promise<void> {
		await signOut(auth);
	}

	async createOrder(
		items: OrderItem[],
		paymentMethod: 'bank' | 'card' | 'cash'
	): Promise<Order> {
		const totalAmount = items.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
		const orderData: OrderData = {
			id: Date.now(),
			customerId: this.customer.id,
			customerName: this.customer.name,
			customerAddress: this.customer.address,
			customerPhone: this.customer.phone,
			customerBankAccount: this.customer.bankAccount,
			items,
			totalAmount,
			status: 'pending',
			paymentMethod,
			orderDate: new Date(),
		};
		return await this.orderService.createOrder(orderData);
	}

	async getOrders(): Promise<Order[]> {
		return await this.orderService.getOrdersByCustomer(this.customer.id);
	}

	async deleteOrder(orderId: number): Promise<boolean> {
		return await this.orderService.deleteOrder(orderId);
	}
}

export default CustomerService;
