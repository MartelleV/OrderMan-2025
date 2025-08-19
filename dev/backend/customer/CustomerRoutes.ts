import Customer from '../../modules/customer/Customer';
import express from 'express';
import CustomerController from './CustomerController';

const router = express.Router();
const dummyCustomer = new Customer(1, 'John Doe', '123 Main St', '0909999999', '');
const controller = new CustomerController(dummyCustomer);

router.post('/orders', async (req, res) => {
	try {
		const { items, paymentMethod } = req.body;

		// Validate input
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

// Sign Up
router.post('/auth/signup', async (req, res) => {
	try {
		const { email, password } = req.body;
		await controller.signUp(email, password);
		res.json({ message: 'User signed up successfully' });
	} catch (err) {
		res.status(500).json({ error: 'Sign up failed' });
	}
});

// Sign In
router.post('/auth/signin', async (req, res) => {
	try {
		const { email, password } = req.body;
		const userCredential =
			await require('../firebase').signInWithEmailAndPassword(
				require('../firebase').auth,
				email,
				password
			);
		const user = userCredential.user;
		const userDocRef = require('../firebase').doc(
			require('../firebase').db,
			'user',
			user.uid
		);
		const userDoc = await require('../firebase').getDoc(userDocRef);
		if (!userDoc.exists()) {
			return res.status(401).json({ error: 'No user data found.' });
		}
		const userData = userDoc.data();
		res.json({
			message: 'User signed in successfully',
			id: userData.id,
			uid: userData.uid,
		});
	} catch (err) {
		res.status(500).json({ error: 'Sign in failed' });
	}
});

// Sign Out
router.post('/auth/signout', async (req, res) => {
	try {
		await controller.signOutUser();
		res.json({ message: 'User signed out successfully' });
	} catch (err) {
		res.status(500).json({ error: 'Sign out failed' });
	}
});

// Auth Status
router.get('/auth/status', async (req, res) => {
	try {
		const status = await controller.getAuthStatus();
		res.json(status);
	} catch (err) {
		res.status(500).json({ error: 'Failed to get auth status' });
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
