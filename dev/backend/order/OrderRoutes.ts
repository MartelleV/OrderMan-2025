import express from 'express';
import OrderController from './OrderController';

const router = express.Router();
const controller = new OrderController();

// Create order
router.post('/', async (req, res) => {
	try {
		const order = await controller.createOrder(req.body);
		res.status(201).json(order);
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
});

// Get order by ID
router.get('/:id', async (req, res) => {
	const order = await controller.getOrder(Number(req.params.id));
	if (order) res.json(order);
	else res.status(404).json({ error: 'Order not found' });
});

// Get orders by customer
router.get('/user/:userId', async (req, res) => {
	const orders = await controller.getOrdersByCustomer(
		Number(req.params.userId)
	);
	res.json(orders);
});

// Update order
router.put('/:id', async (req, res) => {
	const order = await controller.updateOrder(Number(req.params.id), req.body);
	if (order) res.json(order);
	else res.status(404).json({ error: 'Order not found' });
});

// Delete order
router.delete('/:id', async (req, res) => {
	const success = await controller.deleteOrder(Number(req.params.id));
	if (success) res.status(204).end();
	else res.status(404).json({ error: 'Order not found' });
});

// Accept (receive) order
router.post('/:id/receive', async (req, res) => {
	const order = await controller.receiveOrder(Number(req.params.id));
	if (order) res.json(order);
	else res.status(404).json({ error: 'Order not found' });
});

// Ship order
router.post('/:id/ship', async (req, res) => {
	const order = await controller.shipOrder(Number(req.params.id));
	if (order) res.json(order);
	else res.status(404).json({ error: 'Order not found' });
});

// Close order
router.post('/:id/close', async (req, res) => {
	const order = await controller.closeOrder(Number(req.params.id));
	if (order) res.json(order);
	else res.status(404).json({ error: 'Order not found' });
});

export default router;