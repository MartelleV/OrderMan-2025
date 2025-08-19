import { createRouter, createWebHistory } from 'vue-router';
import ProductIndexView from '@/views/product/ProductIndex.vue';
import ProductDetailView from '@/views/product/DetailIndex.vue';
import AuthComponent from '@/components/AuthComponent.vue';
import CustomerView from '@/views/customer/CustomerBrowser.vue';
import OrderView from '@/views/order/OrderIndex.vue';
import OrderView2 from '@/views/order/OrderForm.vue';
import PaymentBrowser from '@/views/payment/PaymentBrowser.vue';
import InvoiceView from '@/views/invoice/InvoiceBrowser.vue';
import AccountantForm from '@/views/accountant/AccountantForm.vue';

const routes = [
	{
		path: '/',
		name: 'ProductList',
		component: ProductIndexView,
	},
	{
		path: '/product/:id',
		name: 'ProductDetail',
		component: ProductDetailView,
		props: true,
	},
	{
		path: '/Order',
		name: 'Order',
		component: OrderView,
	},
	{
		path: '/order2',
		name: 'Order2',
		component: OrderView2,
	},
	{
		path: '/auth',
		name: 'Auth',
		component: AuthComponent,
	},
	{
		path: '/customer',
		name: 'Customer',
		component: CustomerView,
	},
	{
		path: '/payment',
		name: 'Payment',
		component: PaymentBrowser,
		props: true,
	},
	{
		path: '/invoice/:invoiceId',
		name: 'Invoice',
		component: InvoiceView,
	},
	{
		path: '/payments',
		name: 'Payments',
		component: PaymentBrowser,
	},
	{
		path: '/orders/:id',
		name: 'OrderDetails',
		component: AccountantForm,
		props: route => ({ orderId: route.params.id }),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
