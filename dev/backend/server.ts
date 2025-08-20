import express from 'express';
import bodyParser from 'body-parser';
import paymentRoutes from './payment/PaymentRoutes';
import orderRoutes from './order/OrderRoutes';
import productRoutes from './product/ProductRoutes';
import customerRoutes from './customer/CustomerRoutes';
import invoiceRoutes from './invoice/InvoiceRoutes';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(
	cors({
		origin: [
			'http://localhost:5172',
			'http://localhost:5173',
			'http://localhost:5174',
		],
		credentials: true,
	})
);

app.use(bodyParser.json());
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}/api/`);
});
