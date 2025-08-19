export interface InvoiceData {
	id: number;
	orderId: number;
	date: Date;
	amount: number;
	status: 'pending' | 'issued' | 'paid';
	paymentMethod: 'bank' | 'card' | 'cash';
	uid?: string;
}

export class Invoice {
	id: number;
	orderId: number;
	date: Date;
	amount: number;
	status: 'pending' | 'issued' | 'paid';
	paymentMethod: 'bank' | 'card' | 'cash';
	uid?: string;

	constructor(data: InvoiceData) {
		this.id = data.id;
		this.orderId = data.orderId;
		this.date = data.date;
		this.amount = data.amount;
		this.status = data.status;
		this.paymentMethod = data.paymentMethod;
		this.uid = data.uid;
	}
}
