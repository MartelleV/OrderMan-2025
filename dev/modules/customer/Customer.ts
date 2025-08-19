export class Customer {
	uid?: string;
	id: number;
	name: string;
	address: string;
	phone: string;
	bankAccount?: string;
	orders: number[]; // Store order IDs instead of full OrderData

	constructor(
		id: number,
		name: string,
		address: string,
		phone: string,
		bankAccount: string
	) {
		this.id = id;
		this.name = name;
		this.address = address;
		this.phone = phone;
		this.bankAccount = bankAccount ?? null;
		this.orders = [];
	}
}

export default Customer;
