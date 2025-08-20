import express from 'express';
import OrderController from './OrderController';

const router = express.Router();
const controller = new OrderController();

router.get('/', async (req, res) => {
	try {
		const orders = await controller.getAllOrders();
		res.json(orders);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.post('/', async (req, res) => {
	try {
		const order = await controller.createOrder(req.body);
		res.status(201).json(order);
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
});

router.get('/:id', async (req, res) => {
	const order = await controller.getOrder(Number(req.params.id));
	if (order) res.json(order);
	else res.status(404).json({ error: 'Order not found' });
});

router.get('/user/:userId', async (req, res) => {
	const orders = await controller.getOrdersByCustomer(
		Number(req.params.userId)
	);
	res.json(orders);
});

router.put('/:id', async (req, res) => {
	const order = await controller.updateOrder(Number(req.params.id), req.body);
	if (order) res.json(order);
	else res.status(404).json({ error: 'Order not found' });
});

router.delete('/:id', async (req, res) => {
	const success = await controller.deleteOrder(Number(req.params.id));
	if (success) res.status(204).end();
	else res.status(404).json({ error: 'Order not found' });
});

router.post('/:id/receive', async (req, res) => {
	const order = await controller.receiveOrder(Number(req.params.id));
	if (order) res.json(order);
	else res.status(404).json({ error: 'Order not found' });
});

router.post('/:id/ship', async (req, res) => {
	const order = await controller.shipOrder(Number(req.params.id));
	if (order) res.json(order);
	else res.status(404).json({ error: 'Order not found' });
});

router.post('/:id/close', async (req, res) => {
	const order = await controller.closeOrder(Number(req.params.id));
	if (order) res.json(order);
	else res.status(404).json({ error: 'Order not found' });
});

export default router;
