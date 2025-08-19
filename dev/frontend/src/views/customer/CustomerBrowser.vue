<template>
	<div class="container py-5">
		<div class="row justify-content-center">
			<div class="col-md-15 card shadow-sm border-0">
				<div class="card-body text-center">
					<h2 class="mb-4">Customer Dashboard</h2>
					<div class="d-grid gap-2">
						<button
							class="btn btn-success track"
							@click="fetchOrders"
						>
							Track Your Order
						</button>
						<button class="btn btn-info out">
							Read Our Terms and Conditions
						</button>
						<button class="btn btn-primary contact">
							Contact Support
						</button>
						<button class="btn btn-secondary terms" @click="logout">
							Logout
						</button>
					</div>
					<!-- Notification if no orders -->
					<div
						v-if="ordersLoaded && orders.length === 0"
						class="alert alert-info empty mt-4"
					>
						No orders found.
					</div>
					<!-- Table only if there are orders -->
					<table
						v-if="ordersLoaded && orders.length > 0"
						class="table table-primary otable mt-4"
					>
						<thead>
							<tr>
								<th>Order ID</th>
								<th>Total Amount</th>
								<th>Status</th>
								<th>Payment Status</th>
								<th>Order Date</th>
								<th>Edit</th>
								<th>Pay</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="order in orders" :key="order.id">
								<td>{{ order.id }}</td>
								<td>{{ formatCurrency(order.totalAmount) }}</td>
								<td>
									<span
										:class="[
											'chip',
											order.status === 'pending'
												? 'chip-pending'
												: order.status === 'accepted'
												? 'chip-accepted'
												: order.status === 'cancelled'
												? 'chip-cancelled'
												: 'chip-default',
										]"
									>
										{{ capitalizeFirst(order.status) }}
									</span>
								</td>
								<td>
									<span
										:class="[
											'chip',
											getPaymentStatus(order) ===
											'pending'
												? 'chip-pending'
												: getPaymentStatus(order) ===
												  'paid'
												? 'chip-paid'
												: getPaymentStatus(order) ===
												  'failed'
												? 'chip-cancelled'
												: 'chip-default',
										]"
									>
										{{
											capitalizeFirst(
												getPaymentStatus(order)
											)
										}}
									</span>
								</td>
								<td>
									{{
										new Date(
											order.orderDate
										).toLocaleDateString()
									}}
								</td>
								<td>
									<button
										class="btn btn-danger btn-sm"
										:class="{
											'delete-disabled':
												order.status !== 'pending',
										}"
										:disabled="order.status !== 'pending'"
										@click="deleteOrder(order.id)"
									>
										Delete
									</button>
								</td>
								<td>
									<button
										class="btn btn-primary btn-sm"
										:disabled="!canViewInvoice(order)"
										:class="{
											strikethrough:
												!canViewInvoice(order),
										}"
										@click="goToInvoice(order.id)"
									>
										View Invoice
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const orders = ref([]);
const ordersLoaded = ref(false);
const router = useRouter();

async function fetchCustomerIdFromBackend() {
	try {
		const res = await fetch(
			'http://localhost:3000/api/customers/auth/status',
			{
				credentials: 'include', // if using cookies/session
			}
		);
		if (res.ok) {
			const data = await res.json();
			if (data.id) {
				console.log('Customer ID: ' + data.id);
				return data.id;
			}
		}
	} catch (e) {
		console.warn('Failed to fetch customerId from backend');
	}
	return null;
}

async function fetchOrders() {
	const customerId = await fetchCustomerIdFromBackend();
	if (!customerId) {
		router.push({ name: 'Auth' });
		ordersLoaded.value = true;
		return;
	}
	try {
		const res = await fetch(
			`http://localhost:3000/api/orders/user/${customerId}`
		);
		if (res.ok) {
			const data = await res.json();
			orders.value = Array.isArray(data) ? data : [];
		} else {
			orders.value = [];
		}
	} catch (e) {
		orders.value = [];
	}
	ordersLoaded.value = true;
}

onMounted(fetchOrders);

async function logout() {
	try {
		// Call backend signout endpoint to clear session/cookie
		await fetch('http://localhost:3000/api/customers/auth/signout', {
			method: 'POST',
			credentials: 'include',
		});
	} catch (e) {
		console.warn(
			'Signout request failed, proceeding with client-side logout.'
		);
	}
	// Optionally clear any client-side tokens here if used
	localStorage.removeItem('userRole');
	router.push({ name: 'Auth' });
	window.dispatchEvent(new Event('storage'));
}

function formatCurrency(amount) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(amount);
}

async function deleteOrder(orderId) {
	const customerId = await fetchCustomerIdFromBackend();
	if (!customerId) {
		alert('You must be logged in to delete orders.');
		router.push({ name: 'Auth' });
		return;
	}
	try {
		const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
			method: 'DELETE',
		});
		if (res.ok) {
			orders.value = orders.value.filter(order => order.id !== orderId);
		} else {
			alert('Failed to delete order.');
		}
	} catch (e) {
		alert('Failed to delete order.');
	}
}
function canViewInvoice(order) {
	// Only allow if order is accepted, paid, or completed
	return ['accepted', 'paid', 'completed'].includes(order.status);
}

function goToInvoice(orderId) {
	router.push({ name: 'Invoice', params: { invoiceId: orderId } });
}

function capitalizeFirst(str) {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}
function goToPayment(orderId) {
	router.push({ name: 'Payment', params: { orderId } });
}

function getPaymentStatus(order) {
	return order.paymentStatus || 'pending';
}
</script>

<style scoped>
.card {
	border-radius: 18px;
	background: #fff;
	box-shadow: 0 4px 24px #00c48011;
}
.card-body {
	padding: 2.5rem 2rem;
}
.h2,
h2 {
	color: #00c480;
	font-weight: 700;
	letter-spacing: 1px;
}
.d-grid.gap-2 {
	display: flex !important;
	flex-wrap: wrap;
	gap: 14px !important;
	justify-content: center;
	margin-bottom: 2rem;
}
/* Modern, minimal, and clearly distinguished dashboard buttons */
.btn.track {
	background: linear-gradient(90deg, #00c480 60%, #42b983 100%) !important;
	color: #fff !important;
	font-weight: 700;
	border: none !important;
	border-radius: 8px;
	box-shadow: 0 2px 8px #00c48022;
	padding: 10px 28px;
	letter-spacing: 0.5px;
	transition: background 0.2s, color 0.2s;
}
.btn.track:hover {
	background: #00b06b !important;
	color: #fff !important;
}
.btn.terms {
	background: #fff0f0 !important;
	color: #e57373 !important;
	border: 1.5px solid #e57373 !important;
	font-weight: 600;
	border-radius: 8px;
	padding: 10px 24px;
	transition: background 0.2s, color 0.2s;
}
.btn.terms:hover {
	background: #e57373 !important;
	color: #fff !important;
}
.btn.contact {
	background: #f4f8fb !important;
	color: #007a5a !important;
	border: 1.5px solid #00c48033 !important;
	font-weight: 600;
	border-radius: 8px;
	padding: 10px 24px;
	transition: background 0.2s, color 0.2s;
}
.btn.contact:hover {
	background: #e0f7fa !important;
	color: #00c480 !important;
}
.btn.out {
	background: #f4f8fb !important;
	color: #00c480 !important;
	border: 1.5px solid #00c48044 !important;
	font-weight: 600;
	border-radius: 8px;
	padding: 10px 24px;
	transition: background 0.2s, color 0.2s;
}
.btn.out:hover {
	background: #00c480 !important;
	color: #fff !important;
}
.table-primary {
	background: #f9f9f9;
	border-radius: 10px;
	overflow: hidden;
}
.table-primary th {
	background: #d2f4ea !important;
	color: #222;
	font-weight: 600;
}
.table-primary td,
.table-primary th {
	padding: 14px;
	border: 1px solid #dee2e6;
	vertical-align: middle !important;
	text-align: center;
}
.table-primary tbody tr:hover {
	background-color: #f1f1f1;
}
/* Table action buttons */
.btn-sm {
	font-size: 1rem;
	padding: 7px 18px;
	border-radius: 7px;
	font-weight: 600;
	border: none;
	outline: none;
	transition: background 0.18s, color 0.18s, box-shadow 0.18s;
	box-shadow: 0 1px 4px #00c48011;
	letter-spacing: 0.5px;
	min-height: 32px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}
.btn-danger.btn-sm {
	background: #fff0f0;
	color: #e57373;
	border: 1.5px solid #e57373;
}
.btn-danger.btn-sm:hover {
	background: #e57373;
	color: #fff;
}
.btn-primary.btn-sm {
	background: #f4f8fb;
	color: #007a5a;
	border: 1.5px solid #00c48033;
}
.btn-primary.btn-sm:hover {
	background: #00c480;
	color: #fff;
}
.delete-disabled {
	opacity: 0.5;
	pointer-events: none;
}
.otable {
	margin-top: 3%;
	border-radius: 10px;
	overflow: hidden;
}
.empty {
	border-radius: 8px;
	background: #e0f7fa;
	color: #007a5a;
	font-weight: 500;
}
.chip {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 4px 16px;
	font-size: 1rem;
	font-weight: 600;
	border-radius: 16px;
	background: #f4f8fb;
	color: #007a5a;
	border: 1.5px solid #00c48033;
	margin: 0 2px;
	letter-spacing: 0.2px;
	min-width: 80px;
	min-height: 32px;
	text-align: center;
	line-height: 1.2;
}
.chip-pending {
	background: #fffbe6;
	color: #bfa100;
	border-color: #ffe066;
}
.chip-accepted {
	background: #e6fff3;
	color: #00b06b;
	border-color: #00c480;
}
.chip-paid {
	background: #e6f7ff;
	color: #0077b6;
	border-color: #90e0ef;
}
.chip-cancelled {
	background: #fff0f0;
	color: #e57373;
	border-color: #e57373;
}
.chip-default {
	background: #f4f8fb;
	color: #007a5a;
	border-color: #00c48033;
}
.strikethrough {
	text-decoration: line-through !important;
	opacity: 0.6;
	pointer-events: none;
}
@media (max-width: 991.98px) {
	.card-body {
		padding: 1.2rem 0.5rem;
	}
	.d-grid.gap-2 {
		flex-direction: column !important;
		gap: 10px !important;
	}
	.btn.track,
	.btn.terms,
	.btn.contact,
	.btn.out {
		font-size: 1rem;
		padding: 0.6rem 1rem;
		width: 100%;
	}
}
</style>
