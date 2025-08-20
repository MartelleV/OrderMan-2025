import Customer from '../../../modules/customer/Customer';
import express from 'express';
import CustomerController from './CustomerController';

const router = express.Router();
const dummyCustomer = new Customer(
	1,
	'John Doe',
	'123 Main St',
	'0909999999',
	''
);
const controller = new CustomerController(dummyCustomer);

router.post('/orders', async (req, res) => {
	try {
		const { items, paymentMethod } = req.body;

		if (!items || !Array.isArray(items)) {
			return res.status(400).json({ error: 'Missing or invalid items' });
		}
		if (!['bank', 'card', 'cash'].includes(paymentMethod)) {
			return res
				.status(400)
				.json({ error: 'Invalid or missing payment method' });
		}

		const result = await controller.createOrder(items, paymentMethod);
		res.json(result);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to create order' });
	}
});

router.get('/orders', async (req, res) => {
	try {
		const orders = await controller.getOrders();
		res.json(orders);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch orders' });
	}
});

router.post('/', async (req, res) => {
	try {
		const customerService = controller.customerService;
		const customer = await customerService.createCustomer(req.body);
		res.status(201).json(customer);
	} catch (err) {
		res.status(500).json({ error: 'Failed to create customer' });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const customerService = controller.customerService;
		const customer = await customerService.getCustomer(
			Number(req.params.id)
		);
		if (customer) {
			res.json(customer);
		} else {
			res.status(404).json({ error: 'Customer not found' });
		}
	} catch (err) {
		res.status(500).json({ error: 'Failed to get customer' });
	}
});

router.get('/', async (req, res) => {
	try {
		const customerService = controller.customerService;
		const customers = await customerService.getCustomers();
		res.json(customers);
	} catch (err) {
		res.status(500).json({ error: 'Failed to get customers' });
	}
});

router.put('/:id', async (req, res) => {
	try {
		const customerService = controller.customerService;
		const customer = await customerService.updateCustomer(
			Number(req.params.id),
			req.body
		);
		if (customer) {
			res.json(customer);
		} else {
			res.status(404).json({ error: 'Customer not found' });
		}
	} catch (err) {
		res.status(500).json({ error: 'Failed to update customer' });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const customerService = controller.customerService;
		const deleted = await customerService.deleteCustomer(
			Number(req.params.id)
		);
		if (deleted) {
			res.status(204).end();
		} else {
			res.status(404).json({ error: 'Customer not found' });
		}
	} catch (err) {
		res.status(500).json({ error: 'Failed to delete customer' });
	}
});

router.delete('/orders/:id', async (req, res) => {
	try {
		const orderId = parseInt(req.params.id);
		const result = await controller.deleteOrder(orderId);
		res.json(result);
	} catch (err) {
		res.status(500).json({ error: 'Failed to delete order' });
	}
});

export default router;
