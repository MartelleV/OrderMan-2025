import express from 'express';
import PaymentController from './PaymentController';

const router = express.Router();
const controller = new PaymentController();

router.get('/', async (req, res) => {
	try {
		const payments = await controller.getAllPayments();
		res.json(payments);
	} catch (err) {
		res.status(500).json({ error: 'Failed to get payments' });
	}
});

router.post('/', async (req, res) => {
	const payment = await controller.makePayment(req.body);
	res.status(201).json(payment);
});

router.get('/:id', async (req, res) => {
	const payment = await controller.getPayment(Number(req.params.id));
	if (payment) res.json(payment);
	else res.status(404).json({ error: 'Payment not found' });
});

router.get('/invoices/:invoiceId', async (req, res) => {
	const payments = await controller.getPaymentsByInvoices(
		Number(req.params.invoiceId)
	);
	res.json(payments);
});

router.put('/:id', async (req, res) => {
	const payment = await controller.updatePayment(
		Number(req.params.id),
		req.body
	);
	if (payment) res.json(payment);
	else res.status(404).json({ error: 'Payment not found' });
});

router.delete('/:id', async (req, res) => {
	const deleted = await controller.deletePayment(Number(req.params.id));
	if (deleted) res.status(204).end();
	else res.status(404).json({ error: 'Payment not found' });
});

router.post('/accept/:id', async (req, res) => {
	try {
		const paymentId = Number(req.params.id);
		const result = await controller.acceptPayment(paymentId);
		res.json(result);
	} catch (err) {
		res.status(500).json({ error: 'Failed to accept payment' });
	}
});

export default router;
