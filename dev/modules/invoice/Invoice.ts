export interface InvoiceData {
	id: number;
	orderId: number;
	date: Date;
	amount: number;
	status: 'pending' | 'issued' | 'paid';
	method: 'bank' | 'card' | 'cash';
	uid?: string;
}

export class Invoice {
	id: number;
	orderId: number;
	date: Date;
	amount: number;
	status: 'pending' | 'issued' | 'paid';
	method: 'bank' | 'card' | 'cash';
	uid?: string;

	constructor(data: InvoiceData) {
		this.id = data.id;
		this.orderId = data.orderId;
		this.date = data.date;
		this.amount = data.amount;
		this.status = data.status;
		this.method = data.method;
		this.uid = data.uid;
	}
}
