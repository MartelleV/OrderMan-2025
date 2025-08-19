<template>
	<div class="container">
		<div class="pb-5 text-center">
			<h1>Order Management</h1>
			<p class="lead">Review and manage customer orders</p>
		</div>

		<div v-if="loading" class="text-center my-5">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
			<p class="mt-2">Loading orders...</p>
		</div>

		<div v-else-if="error" class="alert alert-danger" role="alert">
			<h4 class="alert-heading">Error!</h4>
			<p>{{ error }}</p>
		</div>

		<div v-else-if="orders.length === 0" class="text-center my-5">
			<p class="lead">No orders found</p>
		</div>

		<div v-else class="table-responsive">
			<table class="table table-striped table-hover">
				<thead>
					<tr>
						<th>Order ID</th>
						<th>Customer ID</th>
						<th>Date</th>
						<th>Total Amount</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="order in orders"
						:key="order.id"
						:class="{
							'table-secondary': order.status === 'CLOSED',
						}"
					>
						<td>{{ order.id }}</td>
						<td>{{ order.customerId }}</td>
						<td>{{ formatDate(order.orderDate) }}</td>
						<td>${{ order.totalAmount.toFixed(2) }}</td>
						<td>
							<span
								:class="{
									badge: true,
									'bg-warning': order.status === 'pending',
									'bg-success': order.status === 'ACCEPTED',
									'bg-info': order.status === 'SHIPPED',
									'bg-danger': order.status === 'CLOSED',
								}"
							>
								{{ order.status }}
							</span>
						</td>
						<td>
							<div
								v-if="order.status === 'pending'"
								class="btn-group"
								role="group"
							>
								<button
									@click="
										updateOrderStatus(order.id, 'ACCEPTED')
									"
									class="btn btn-success btn-sm"
								>
									Accept
								</button>
								<button
									@click="
										updateOrderStatus(order.id, 'CLOSED')
									"
									class="btn btn-danger btn-sm"
								>
									Reject
								</button>
							</div>
							<div
								v-else-if="order.status === 'ACCEPTED'"
								class="btn-group"
								role="group"
							>
								<button
									@click="
										updateOrderStatus(order.id, 'SHIPPED')
									"
									class="btn btn-info btn-sm"
								>
									Ship
								</button>
							</div>
							<div
								v-else-if="order.status === 'SHIPPED'"
								class="btn-group"
								role="group"
							>
								<button
									@click="
										updateOrderStatus(order.id, 'CLOSED')
									"
									class="btn btn-danger btn-sm"
								>
									Close
								</button>
							</div>
							<div v-else>
								<span class="text-muted"
									>No actions available</span
								>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Invoice Management Section -->
		<div class="pb-5 text-center mt-5">
			<h1>Invoice Management</h1>
			<p class="lead">Send and manage customer invoices</p>
		</div>

		<div v-if="invoicesLoading" class="text-center my-5">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
			<p class="mt-2">Loading invoices...</p>
		</div>

		<div v-else-if="invoicesError" class="alert alert-danger" role="alert">
			<h4 class="alert-heading">Error!</h4>
			<p>{{ invoicesError }}</p>
		</div>

		<div v-else-if="invoices.length === 0" class="text-center my-5">
			<p class="lead">No invoices found</p>
		</div>

		<div v-else class="table-responsive">
			<table class="table table-striped table-hover">
				<thead>
					<tr>
						<th>Invoice ID</th>
						<th>Order ID</th>
						<th>Customer ID</th>
						<th>Issue Date</th>
						<th>Due Date</th>
						<th>Amount</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="invoice in invoices"
						:key="invoice.id"
						:class="{
							'table-secondary': invoice.status === 'PAID',
						}"
					>
						<td>{{ invoice.id }}</td>
						<td>{{ invoice.orderId }}</td>
						<td>{{ invoice.customerId }}</td>
						<td>{{ formatDate(invoice.issueDate) }}</td>
						<td>{{ formatDate(invoice.dueDate) }}</td>
						<td>${{ invoice.amount.toFixed(2) }}</td>
						<td>
							<span
								:class="{
									badge: true,
									'bg-primary': invoice.status === 'DRAFT',
									'bg-warning': invoice.status === 'ISSUED',
									'bg-success': invoice.status === 'PAID',
									'bg-danger': invoice.status === 'OVERDUE',
								}"
							>
								{{ invoice.status }}
							</span>
						</td>
						<td>
							<div
								v-if="invoice.status === 'DRAFT'"
								class="btn-group"
								role="group"
							>
								<button
									@click="
										updateInvoiceStatus(invoice.id, 'ISSUED')
									"
									class="btn btn-warning btn-sm"
								>
									Send to Customer
								</button>
							</div>
							<div
								v-else-if="invoice.status === 'ISSUED'"
								class="btn-group"
								role="group"
							>
								<button
									@click="
										updateInvoiceStatus(invoice.id, 'PAID')
									"
									class="btn btn-success btn-sm"
								>
									Mark as Paid
								</button>
								<button
									@click="
										updateInvoiceStatus(invoice.id, 'OVERDUE')
									"
									class="btn btn-danger btn-sm"
								>
									Mark Overdue
								</button>
							</div>
							<div
								v-else-if="invoice.status === 'OVERDUE'"
								class="btn-group"
								role="group"
							>
								<button
									@click="
										updateInvoiceStatus(invoice.id, 'PAID')
									"
									class="btn btn-success btn-sm"
								>
									Mark as Paid
								</button>
							</div>
							<div v-else>
								<span class="text-muted"
									>No actions available</span
								>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Confirmation Modal -->
		<div
			class="modal fade"
			id="confirmationModal"
			tabindex="-1"
			aria-labelledby="confirmationModalLabel"
			aria-hidden="true"
			ref="confirmModalElement"
		>
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="confirmationModalLabel">
							Confirm Action
						</h5>
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div class="modal-body">
						{{ modalMessage }}
					</div>
					<div class="modal-footer">
						<button
							type="button"
							class="btn btn-secondary"
							data-bs-dismiss="modal"
						>
							Cancel
						</button>
						<button
							type="button"
							class="btn btn-primary"
							@click="confirmAction"
						>
							Confirm
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';

// State variables
const orders = ref([]);
const loading = ref(true);
const error = ref(null);
const invoices = ref([]);
const invoicesLoading = ref(true);
const invoicesError = ref(null);
const confirmModalElement = ref(null);
const confirmModal = ref(null);
const modalMessage = ref('');
const pendingAction = ref(null);

// Fetch orders and invoices on component mount
onMounted(async () => {
	await Promise.all([fetchOrders(), fetchInvoices()]);
	// Initialize Bootstrap modal after the DOM is ready
	if (confirmModalElement.value) {
		confirmModal.value = new Modal(confirmModalElement.value);
	}
});

// Fetch orders from the API
async function fetchOrders() {
	loading.value = true;
	error.value = null;

	try {
		// Instead of making an API call, use dummy data for testing
		// Comment out the actual API call for now
		/*
		const response = await fetch('http://localhost:3000/api/orders');

		if (!response.ok) {
			throw new Error(
				`Failed to fetch orders: ${response.status} ${response.statusText}`
			);
		}
		
		const data = await response.json();
		orders.value = data;
		*/

		// Create dummy orders for testing
		const dummyOrders = [
			{
				id: 1001,
				customerId: 5001,
				orderDate: new Date().toISOString(),
				totalAmount: 129.99,
				status: 'pending',
				items: [
					{
						id: 1,
						name: 'Wireless Headphones',
						price: 79.99,
						quantity: 1,
					},
					{ id: 2, name: 'Phone Case', price: 25.0, quantity: 2 },
				],
			},
			{
				id: 1002,
				customerId: 5002,
				orderDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
				totalAmount: 349.95,
				status: 'ACCEPTED',
				items: [
					{ id: 3, name: 'Smart Watch', price: 249.95, quantity: 1 },
					{
						id: 4,
						name: 'Charging Cable',
						price: 19.99,
						quantity: 5,
					},
				],
			},
			{
				id: 1003,
				customerId: 5003,
				orderDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
				totalAmount: 1299.99,
				status: 'SHIPPED',
				items: [
					{ id: 5, name: 'Laptop', price: 1199.99, quantity: 1 },
					{ id: 6, name: 'Laptop Bag', price: 49.99, quantity: 1 },
					{ id: 7, name: 'Mouse', price: 29.99, quantity: 1 },
				],
			},
		];

		orders.value = dummyOrders;

		// Simulate a small delay to show loading state
		await new Promise(resolve => setTimeout(resolve, 500));
	} catch (err) {
		console.error('Error fetching orders:', err);
		error.value = err.message || 'Failed to load orders';
	} finally {
		loading.value = false;
	}
}

// Fetch invoices from the API
async function fetchInvoices() {
	invoicesLoading.value = true;
	invoicesError.value = null;

	try {
		// Create dummy invoices for testing
		const dummyInvoices = [
			{
				id: 'INV-2001',
				orderId: 1001,
				customerId: 5001,
				issueDate: new Date().toISOString(),
				dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
				amount: 129.99,
				status: 'DRAFT',
			},
			{
				id: 'INV-2002',
				orderId: 1002,
				customerId: 5002,
				issueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
				dueDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(), // 29 days from now
				amount: 349.95,
				status: 'ISSUED',
			},
			{
				id: 'INV-2003',
				orderId: 1003,
				customerId: 5003,
				issueDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
				dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days from now
				amount: 1299.99,
				status: 'ISSUED',
			},
			{
				id: 'INV-2004',
				orderId: 1004,
				customerId: 5004,
				issueDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
				dueDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(), // 27 days from now
				amount: 89.99,
				status: 'PAID',
			},
		];

		invoices.value = dummyInvoices;

		// Simulate a small delay to show loading state
		await new Promise(resolve => setTimeout(resolve, 500));
	} catch (err) {
		console.error('Error fetching invoices:', err);
		invoicesError.value = err.message || 'Failed to load invoices';
	} finally {
		invoicesLoading.value = false;
	}
}

// Format date for display
function formatDate(dateString) {
	const options = { year: 'numeric', month: 'short', day: 'numeric' };
	return new Date(dateString).toLocaleDateString(undefined, options);
}

// Update order status with confirmation
function updateOrderStatus(orderId, newStatus) {
	let actionType;

	if (newStatus === 'ACCEPTED') {
		actionType = 'accept';
	} else if (newStatus === 'CLOSED') {
		// Check if we're rejecting a pending order or closing a shipped order
		const order = orders.value.find(o => o.id === orderId);
		if (order && order.status === 'SHIPPED') {
			actionType = 'close';
		} else {
			actionType = 'reject';
		}
	} else if (newStatus === 'SHIPPED') {
		actionType = 'ship';
	}

	modalMessage.value = `Are you sure you want to ${actionType} this order?`;

	// Store the pending action for confirmation
	pendingAction.value = { type: 'order', orderId, newStatus, actionType };

	// Show confirmation modal
	if (confirmModal.value) {
		confirmModal.value.show();
	}
}

// Update invoice status with confirmation
function updateInvoiceStatus(invoiceId, newStatus) {
	let actionType;

	if (newStatus === 'ISSUED') {
		actionType = 'send to customer';
	} else if (newStatus === 'PAID') {
		actionType = 'mark as paid';
	} else if (newStatus === 'OVERDUE') {
		actionType = 'mark as overdue';
	}

	modalMessage.value = `Are you sure you want to ${actionType} this invoice?`;

	// Store the pending action for confirmation
	pendingAction.value = { type: 'invoice', invoiceId, newStatus, actionType };

	// Show confirmation modal
	if (confirmModal.value) {
		confirmModal.value.show();
	}
}

// Confirm and execute the pending action
async function confirmAction() {
	if (!pendingAction.value) return;

	const { type } = pendingAction.value;

	try {
		// Simulate a small delay to mimic API call
		await new Promise(resolve => setTimeout(resolve, 300));

		if (type === 'order') {
			const { orderId, newStatus, actionType } = pendingAction.value;
			
			// Update local state for orders
			const orderIndex = orders.value.findIndex(
				order => order.id === orderId
			);
			if (orderIndex !== -1) {
				orders.value[orderIndex].status = newStatus;
			}

			// Hide modal first, then show success message
			if (confirmModal.value) {
				confirmModal.value.hide();
			}

			// Clear pending action
			pendingAction.value = null;

			// Show success message after a short delay to ensure modal is closed
			setTimeout(() => {
				let actionMessage;
				if (actionType === 'accept') {
					actionMessage = 'accepted';
				} else if (actionType === 'reject') {
					actionMessage = 'rejected';
				} else if (actionType === 'ship') {
					actionMessage = 'shipped';
				} else if (actionType === 'close') {
					actionMessage = 'closed';
				}

				alert(`Order ${orderId} has been ${actionMessage}`);
			}, 200);
		} else if (type === 'invoice') {
			const { invoiceId, newStatus, actionType } = pendingAction.value;
			
			// Update local state for invoices
			const invoiceIndex = invoices.value.findIndex(
				invoice => invoice.id === invoiceId
			);
			if (invoiceIndex !== -1) {
				invoices.value[invoiceIndex].status = newStatus;
			}

			// Hide modal first, then show success message
			if (confirmModal.value) {
				confirmModal.value.hide();
			}

			// Clear pending action
			pendingAction.value = null;

			// Show success message after a short delay to ensure modal is closed
			setTimeout(() => {
				alert(`Invoice ${invoiceId} has been ${actionType}`);
			}, 200);
		}
	} catch (err) {
		console.error('Error updating:', err);

		// Hide modal and clear pending action even on error
		if (confirmModal.value) {
			confirmModal.value.hide();
		}
		pendingAction.value = null;

		// Show error message after a short delay
		setTimeout(() => {
			alert(`Failed to update: ${err.message}`);
		}, 200);
	}
}
</script>

<style scoped>
.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem 1rem;
}

h1 {
	color: #1a365d;
	font-weight: 600;
	margin-bottom: 0.5rem;
}

.lead {
	color: #64748b;
	font-size: 1.1rem;
}

.table {
	border-radius: 0.375rem;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	background: white;
	border: 1px solid #e2e8f0;
}

.table th {
	background-color: #334155;
	color: white;
	font-weight: 500;
	border: none;
	padding: 1rem 0.75rem;
	font-size: 0.875rem;
}

.table td {
	padding: 0.875rem 0.75rem;
	vertical-align: middle;
	border-color: #e2e8f0;
}

.table-striped > tbody > tr:nth-of-type(odd) > td {
	background-color: #f8fafc;
}

.table-hover tbody tr:hover {
	background-color: #f1f5f9;
}

.badge {
	padding: 0.375rem 0.75rem;
	font-size: 0.75rem;
	font-weight: 500;
	border-radius: 0.375rem;
	text-transform: uppercase;
	letter-spacing: 0.025em;
}

.bg-warning {
	background-color: #f59e0b !important;
	color: white !important;
}

.bg-success {
	background-color: #10b981 !important;
	color: white !important;
}

.bg-info {
	background-color: #3b82f6 !important;
	color: white !important;
}

.bg-danger {
	background-color: #ef4444 !important;
	color: white !important;
}

.btn {
	border-radius: 0.375rem;
	font-weight: 500;
	padding: 0.5rem 1rem;
	transition: all 0.15s ease;
	font-size: 0.875rem;
	border: 1px solid transparent;
}

.btn:hover {
	transform: translateY(-1px);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-success {
	background-color: #10b981;
	border-color: #10b981;
	color: white;
}

.btn-success:hover {
	background-color: #059669;
	border-color: #059669;
	color: white;
}

.btn-danger {
	background-color: #ef4444;
	border-color: #ef4444;
	color: white;
}

.btn-danger:hover {
	background-color: #dc2626;
	border-color: #dc2626;
	color: white;
}

.btn-info {
	background-color: #3b82f6;
	border-color: #3b82f6;
	color: white;
}

.btn-info:hover {
	background-color: #2563eb;
	border-color: #2563eb;
	color: white;
}

.btn-primary {
	background-color: #3b82f6;
	border-color: #3b82f6;
	color: white;
}

.btn-primary:hover {
	background-color: #2563eb;
	border-color: #2563eb;
	color: white;
}

.btn-secondary {
	background-color: #6b7280;
	border-color: #6b7280;
	color: white;
}

.btn-secondary:hover {
	background-color: #4b5563;
	border-color: #4b5563;
	color: white;
}

.btn-group .btn {
	margin-right: 0.5rem;
}

.btn-group .btn:last-child {
	margin-right: 0;
}

.spinner-border {
	width: 2.5rem;
	height: 2.5rem;
	color: #3b82f6;
}

.alert {
	border-radius: 0.5rem;
	border: 1px solid transparent;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.alert-danger {
	background-color: #fef2f2;
	border-color: #fecaca;
	color: #991b1b;
}

.alert-heading {
	color: #7f1d1d;
}

.modal-content {
	border-radius: 0.5rem;
	border: none;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
	background-color: #334155;
	color: white;
	border-radius: 0.5rem 0.5rem 0 0;
	border-bottom: none;
	padding: 1.25rem;
}

.modal-title {
	font-weight: 600;
	font-size: 1.125rem;
}

.btn-close {
	filter: brightness(0) invert(1);
}

.modal-body {
	padding: 1.5rem;
	font-size: 1rem;
	color: #374151;
}

.modal-footer {
	border-top: 1px solid #e5e7eb;
	padding: 1.25rem;
	background-color: #f9fafb;
	border-radius: 0 0 0.5rem 0.5rem;
}

.table-secondary {
	background-color: #f1f5f9 !important;
	opacity: 0.75;
}

.text-muted {
	color: #6b7280 !important;
	font-style: italic;
	font-size: 0.875rem;
}

.text-center {
	color: #374151;
}

.pb-5 {
	border-bottom: 2px solid #e5e7eb;
	margin-bottom: 2rem;
}

@media (max-width: 768px) {
	.container {
		padding: 1rem 0.5rem;
	}

	.btn {
		font-size: 0.8rem;
		padding: 0.375rem 0.75rem;
	}

	.table {
		font-size: 0.875rem;
	}

	.btn-group .btn {
		margin-right: 0.25rem;
		margin-bottom: 0.25rem;
	}
}
</style>
