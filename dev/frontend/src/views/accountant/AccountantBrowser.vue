<template>
	<div class="container py-5">
		<div class="row justify-content-center">
			<div class="col-lg-10 card shadow-sm border-0">
				<div class="card-body text-center">
					<h2 class="mb-4 fw-semibold">Accountant Dashboard</h2>
					<div class="mb-4">
						<div class="table-responsive mt-4">
							<table
								class="table custom-table align-middle text-center"
							>
								<thead class="table-success">
									<tr>
										<th>Order ID</th>
										<th>Price</th>
										<th>Time</th>
										<th>Manage</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									<tr v-if="loading">
										<td colspan="6">Loading orders...</td>
									</tr>
									<tr v-else-if="error">
										<td colspan="6" class="text-danger">
											{{ error }}
										</td>
									</tr>
									<tr v-else-if="orders.length === 0">
										<td colspan="6">No orders found.</td>
									</tr>
									<tr v-for="order in orders" :key="order.id">
										<td>{{ order.id }}</td>
										<td>${{ order.totalAmount || '—' }}</td>
										<td>
											{{
												order.orderDate
													? new Date(
															order.orderDate
													  ).toLocaleString()
													: '—'
											}}
										</td>
										<td>
											<div class="action-buttons">
												<button
													type="button"
													class="action-btn accept"
													@click="shipOrder(order.id)"
													:disabled="
														shipLoading[order.id] ||
														order.status ===
															'shipped'
													"
												>
													<span
														v-if="
															shipLoading[
																order.id
															]
														"
														>Shipping...</span
													>
													<span
														v-else-if="
															order.status ===
															'shipped'
														"
														>Shipped</span
													>
													<span v-else
														>Ship Order</span
													>
												</button>
												<button
													type="button"
													class="action-btn view"
													@click="
														goToOrderDetails(
															order.id
														)
													"
												>
													View Details
												</button>
												<button
													type="button"
													class="action-btn cancel"
													@click="deleteOrder(order.id)"
													:disabled="deleteLoading[order.id]"
												>
													<span v-if="deleteLoading[order.id]">
														Cancelling...
													</span>
													<span v-else>Cancel Order</span>
												</button>
											</div>
											<div
												v-if="shipSuccess[order.id]"
												class="alert alert-success mt-2"
											>
												Order shipped successfully!
											</div>
											<div
												v-if="deleteSuccess[order.id]"
												class="alert alert-success mt-2"
											>
												Order cancelled successfully!
											</div>
										</td>
										<td>
											<span
												:class="[
													'chip',
													order.status === 'pending'
														? 'chip-pending'
														: order.status ===
														  'shipped'
														? 'chip-accepted'
														: 'chip-default',
												]"
											>
												{{
													order.status
														? order.status
																.charAt(0)
																.toUpperCase() +
														  order.status.slice(1)
														: 'Pending'
												}}
											</span>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<button
						class="btn btn-secondary logout-btn shadow-sm"
						@click="logout"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const orders = ref([]);
const loading = ref(false);
const error = ref('');
const shipLoading = ref({});
const shipSuccess = ref({});
const deleteLoading = ref({});
const deleteSuccess = ref({});

async function fetchOrders() {
	loading.value = true;
	error.value = '';
	try {
		const res = await fetch('http://localhost:3000/api/accountant/orders');
		if (res.ok) {
			orders.value = await res.json();
		} else {
			error.value = 'Failed to fetch orders.';
		}
	} catch (e) {
		error.value = 'Error fetching orders.';
	}
	loading.value = false;
}

async function shipOrder(orderId) {
	shipLoading.value[orderId] = true;
	shipSuccess.value[orderId] = false;
	try {
		// Simulate async shipping (replace with real API if available)
		await new Promise(resolve => setTimeout(resolve, 2000));
		// Optionally call API to update order status
		// await fetch(`http://localhost:3000/api/orders/${orderId}/ship`, { method: 'POST' });
		shipSuccess.value[orderId] = true;
		// Optionally update local order status
		const order = orders.value.find(o => o.id === orderId);
		if (order) order.status = 'shipped';
	} catch (e) {
		error.value = 'Failed to ship order.';
	}
	shipLoading.value[orderId] = false;
}

async function deleteOrder(orderId) {
	deleteLoading.value[orderId] = true;
	deleteSuccess.value[orderId] = false;
	try {
		// Simulate async order deletion (replace with real API if available)
		await new Promise(resolve => setTimeout(resolve, 2000));
		// Optionally call API to delete order
		// await fetch(`http://localhost:3000/api/orders/${orderId}`, { method: 'DELETE' });
		deleteSuccess.value[orderId] = true;
		// Optionally remove order from local list
		orders.value = orders.value.filter(o => o.id !== orderId);
	} catch (e) {
		error.value = 'Failed to cancel order.';
	}
	deleteLoading.value[orderId] = false;
}

async function logout() {
	try {
		// Call backend signout endpoint to clear session/cookie
		await fetch('http://localhost:3000/api/accountant/auth/signout', {
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

function goToOrderDetails(orderId) {
	console.log('Navigating to order:', orderId);
	router.push({ name: 'AccountantViewDetails', params: { orderId } });
}

onMounted(fetchOrders);
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
h2 {
	color: #00c480;
	font-weight: 700;
	letter-spacing: 1px;
}
.custom-table {
	background-color: #f9f9f9;
	border: 1px solid #dee2e6;
	border-radius: 10px;
	overflow: hidden;
}
.table-success {
	background: #d2f4ea !important;
	color: #222;
	font-weight: 600;
}
.custom-table td,
.custom-table th {
	padding: 14px;
	border: 1px solid #dee2e6;
	vertical-align: middle !important;
	text-align: center;
}
.custom-table tbody tr:hover {
	background-color: #f1f1f1;
}
.action-buttons {
	display: flex;
	flex-direction: row;
	gap: 12px;
	justify-content: center;
	align-items: center;
}
.action-btn {
	min-width: 90px;
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
/* Accept = Main/Success */
.action-btn.accept {
	background: linear-gradient(90deg, #00c480 60%, #42b983 100%);
	color: #fff;
	border: none;
}
.action-btn.accept:hover {
	background: #00b06b;
	color: #fff;
}
/* Cancel = Danger */
.action-btn.cancel {
	background: #fff0f0;
	color: #e57373;
	border: 1.5px solid #e57373;
}
.action-btn.cancel:hover {
	background: #e57373;
	color: #fff;
}
/* View Details = Secondary/Info */
.action-btn.view {
	background: #f4f8fb;
	color: #007a5a;
	border: 1.5px solid #00c48033;
}
.action-btn.view:hover {
	background: #e0f7fa;
	color: #00c480;
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
.btn-secondary {
	background: #f4f8fb;
	color: #00c480;
	border: 1.5px solid #00c48044;
	border-radius: 8px;
	font-weight: 600;
	transition: background 0.2s, color 0.2s;
}
.btn-secondary:hover {
	background: #00c480;
	color: #fff;
}
.logout-btn {
	background-color: #e57373;
	color: #fff;
	border: none;
}
.logout-btn:hover {
	background-color: #f14646;
	color: #fff;
	border: none;
	box-shadow: 0 2px 8px rgba(241, 70, 70, 0.2);
	font-size: 120%;
	transition: 0.3s ease-in-out;
}
@media (max-width: 991.98px) {
	.card-body {
		padding: 1.2rem 0.5rem;
	}
	.action-btn {
		min-width: 100%;
		font-size: 1rem;
		padding: 0.6rem 1rem;
	}
	.action-buttons {
		flex-direction: column;
		gap: 8px;
	}
}
</style>
