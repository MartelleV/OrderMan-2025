import express from 'express';
import ProductController from './ProductController';

const router = express.Router();
const controller = new ProductController();

router.get('/', async (req, res) => {
	try {
		const products = await controller.fetchProducts();
		res.json(products);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch products' });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const product = await controller.fetchProductDetails(
			Number(req.params.id)
		);
		if (!product) return res.status(404).json({ error: 'Not found' });
		res.json(product);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch product' });
	}
});

router.put('/:id', async (req, res) => {
	try {
		const updated = await controller.updateProduct(
			Number(req.params.id),
			req.body
		);
		if (!updated)
			return res.status(404).json({ error: 'Product not found' });
		res.json(updated);
	} catch (err) {
		res.status(500).json({ error: 'Failed to update product' });
	}
});

export default router;
