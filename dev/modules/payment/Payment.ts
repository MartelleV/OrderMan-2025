export interface PaymentData {
	id: number;
	invoiceId: number;
	amount: number;
	date: Date;
	status: 'pending' | 'completed' | 'failed';
	method: 'bank' | 'card' | 'cash';
	uid?: string;
}

export class Payment {
	id: number;
	invoiceId: number;
	amount: number;
	date: Date;
	status: 'pending' | 'completed' | 'failed';
	method: 'bank' | 'card' | 'cash';
	uid?: string;

	constructor(data: PaymentData) {
		this.id = data.id;
		this.invoiceId = data.invoiceId;
		this.amount = data.amount;
		this.date = data.date;
		this.status = data.status;
		this.method = data.method;
		this.uid = data.uid;
	}
}
