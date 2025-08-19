import Customer from '../../modules/customer/Customer';
import { OrderItem } from '../../modules/order/Order';
import CustomerService from './CustomerService';

class CustomerController {
	private customerService: CustomerService;

	constructor(customer: Customer) {
		this.customerService = new CustomerService(customer);
	}

	async createOrder(
		orderItems: OrderItem[],
		paymentMethod: 'bank' | 'card' | 'cash'
	) {
		return this.customerService.createOrder(orderItems, paymentMethod);
	}
	async getOrders() {
		return this.customerService.getOrders();
	}

	async deleteOrder(orderId: number) {
		return this.customerService.deleteOrder(orderId);
	}

	async signUp(email: string, password: string) {
		return this.customerService.signUp(email, password);
	}

	async signIn(email: string, password: string) {
		return this.customerService.signIn(email, password);
	}

	async signOutUser() {
		return this.customerService.signOutUser();
	}

	async getAuthStatus() {
		return {
			id: this.customerService['customer'].id,
			uid: this.customerService['customer'].uid,
			orders: this.customerService['customer'].orders,
		};
	}
}

export default CustomerController;
