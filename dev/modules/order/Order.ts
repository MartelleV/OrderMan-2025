export interface OrderItem {
	id: number;
	productId?: number;
	name: string;
	quantity: number;
	price: number;
}

export interface OrderData {
	id: number;
	customerId: number;
	customerName: string;
	customerAddress: string;
	customerPhone: string;
	customerBankAccount?: string;
	items: OrderItem[];
	totalAmount: number;
	status: 'pending' | 'accepted' | 'paid' | 'shipped' | 'closed';
	method: 'bank' | 'card' | 'cash'; // Changed from paymentMethod
	orderDate: Date;
	uid?: string;
}

export class Order {
	id: number;
	customerId: number;
	customerName: string;
	customerAddress: string;
	customerPhone: string;
	customerBankAccount?: string;
	items: OrderItem[];
	totalAmount: number;
	status: 'pending' | 'accepted' | 'paid' | 'shipped' | 'closed';
	method: 'bank' | 'card' | 'cash'; // Changed from paymentMethod
	orderDate: Date;
	uid?: string;

	constructor(data: OrderData) {
		this.id = data.id;
		this.customerId = data.customerId;
		this.customerName = data.customerName;
		this.customerAddress = data.customerAddress;
		this.customerPhone = data.customerPhone;
		this.customerBankAccount = data.customerBankAccount;
		this.items = data.items;
		this.totalAmount = data.totalAmount;
		this.status = data.status;
		this.method = data.method; // Updated
		this.orderDate = data.orderDate;
		this.uid = data.uid;
	}
}