<template>
	<div class="container py-5">
		<div class="invoice-wrapper">
			<div v-if="invoice">
				<h2 class="page-title text-center mb-5">
					Invoice #{{ invoice.id }}
				</h2>

				<div class="row g-4">
					<!-- Invoice Items Section -->
					<div class="col-lg-8">
						<div class="invoice-items-section">
							<h4 class="section-title mb-4">Order Details</h4>
							<div v-for="item in invoice.items || []"
								 :key="item.id"
								 class="invoice-item-card">
								<div class="item-content">
									<div class="item-info">
										<h5 class="item-name">
											{{ item.name }}
										</h5>
										<div class="item-details">
											<span class="item-quantity">Qty: {{ item.quantity }}</span>
											<span class="item-price">
												{{ formatPrice(item.price) }}
												each
											</span>
										</div>
									</div>
									<div class="item-total">
										<span class="total-label">Subtotal</span>
										<span class="total-value">
											{{
											formatPrice(
												item.price * item.quantity
											)
											}}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Invoice Summary Section -->
					<div class="col-lg-4">
						<div class="summary-card">
							<h4 class="summary-title">Invoice Summary</h4>

							<div class="summary-line">
								<span class="summary-label">
									Subtotal
									<small class="item-count">
										({{
											(invoice.items || []).reduce(
												(sum, item) =>
													sum + item.quantity,
												0
											)
										}}
										item(s))
									</small>
								</span>
								<span class="summary-value">
									{{
										formatPrice(
											(invoice.items || []).reduce(
												(sum, item) =>
													sum +
													item.price * item.quantity,
												0
											)
										)
									}}
								</span>
							</div>

							<div class="summary-line">
								<span class="summary-label">Discount</span>
								<span class="summary-value discount">
									-{{ formatPrice(invoice.discount || 0) }}
								</span>
							</div>

							<div class="summary-line">
								<span class="summary-label">VAT (8%)</span>
								<span class="summary-value">
									{{ formatPrice(invoice.vat || 0) }}
								</span>
							</div>

							<hr class="summary-divider" />

							<div class="summary-line total-line">
								<span class="summary-label">Total</span>
								<span class="summary-value">
									{{ formatPrice(invoice.total || 0) }}
								</span>
							</div>

							<div class="invoice-info">
								<div class="info-item">
									<span class="info-label">Date:</span>
									<span class="info-value">
										{{ formatDate(invoice.date) }}
									</span>
								</div>
								<div class="info-item">
									<span class="info-label">Status:</span>
									<span class="info-value status"
										  :class="invoice.status">{{ invoice.status }}</span>
								</div>
							</div>

							<!-- Payment Details Section -->
							<hr class="summary-divider" />
							<div class="payment-section">
								<h5 class="mb-3" style="color:#00c480;font-weight:600;">Payment Details</h5>
								<div class="summary-line">
									<span class="summary-label">Payment Type</span>
									<span class="summary-value">
										{{ paymentDetails.method ? paymentDetails.method === 'credit' ? 'Credit Card' : 'Debit Card' : 'N/A' }}
									</span>
								</div>
								<div class="summary-line">
									<span class="summary-label">Card Number</span>
									<span class="summary-value">
										{{ paymentDetails.cardNumber ? maskCardNumber(paymentDetails.cardNumber) : 'N/A' }}
									</span>
								</div>
								<div class="summary-line">
									<span class="summary-label">Name on Card</span>
									<span class="summary-value">
										{{ paymentDetails.cardName || 'N/A' }}
									</span>
								</div>
								<div class="summary-line">
									<span class="summary-label">Expiry</span>
									<span class="summary-value">
										{{ paymentDetails.expiry || 'N/A' }}
									</span>
								</div>
								<div class="summary-line">
									<span class="summary-label">Payment Status</span>
									<span class="summary-value" :class="paymentStatusClass">
										{{ paymentStatusDisplay }}
									</span>
								</div>
							</div>
						</div>
						<div class="invoice-actions mt-4 d-flex flex-column align-items-stretch">
							<button class="action-btn accept mb-3"
									@click="makePayment"
									:disabled="paymentStatus === 'pending' || paymentStatus === 'completed'">
								Pay
							</button>
							<button class="action-btn secondary mb-3"
									@click="requestCancel">
								Request Cancel
							</button>
							<button class="action-btn out" @click="goBack">
								Back
							</button>
						</div>
					</div>
				</div>
			</div>

			<div v-else class="loading-section">
				<div class="loading-card">
					<div class="loading-content">
						<div class="spinner-border text-primary" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
						<h4>Loading Invoice...</h4>
						<p>
							Please wait while we retrieve your invoice details.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, computed } from 'vue';
	import { useRoute, useRouter } from 'vue-router';

	const route = useRoute();
	const router = useRouter();
	const invoice = ref(null);
	const paymentDetails = ref({});
	const paymentStatus = ref('unpaid');
	const paymentStatusDisplay = computed(() => {
		if (paymentStatus.value === 'pending') return 'Pending';
		if (paymentStatus.value === 'completed') return 'Completed';
		return 'Unpaid';
	});
	const paymentStatusClass = computed(() => {
		if (paymentStatus.value === 'pending') return 'pending';
		if (paymentStatus.value === 'completed') return 'completed';
		return '';
	});

	function formatPrice(val) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(val);
	}

	function formatDate(dateString) {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	function maskCardNumber(cardNumber) {
		if (!cardNumber) return '';
		const str = cardNumber.toString();
		return str.length > 4
			? '**** **** **** ' + str.slice(-4)
			: str;
	}

	function goBack() {
		router.push({ name: 'Customer' });
	}

	function requestCancel() {
		alert('Request Cancel functionality coming soon.');
	}

	async function makePayment() {
		if (!invoice.value) return;
		try {
			console.log(invoice.value)
			const res = await fetch(`http://localhost:3000/api/payment/accept/${invoice.value.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});
			if (res.ok) {
				const data = await res.json();
				// Assume backend returns updated payment status and details
				if (data.payment) {
					paymentDetails.value = data.payment.details || {};
					paymentStatus.value = data.payment.status || 'pending';
				} else {
					paymentStatus.value = 'pending';
				}
				// Optionally, reload invoice to reflect new status
				await fetchInvoice();
			} else {
				alert('Payment failed.');
			}
		} catch (e) {
			alert('Payment failed.');
		}
	}

	async function fetchInvoice() {
		const invoiceId = route.params.invoiceId;
		const res = await fetch(`http://localhost:3000/api/invoices/${invoiceId}`);
		if (res.ok) {
			let data = await res.json();
			if (Array.isArray(data)) {
				invoice.value = data[0] || null;
			} else {
				invoice.value = data;
			}
			// Parse payment details if present
			if (invoice.value && invoice.value.payment) {
				paymentDetails.value = invoice.value.payment.details || {};
				paymentStatus.value = invoice.value.payment.status || 'unpaid';
			} else {
				paymentDetails.value = {};
				paymentStatus.value = 'unpaid';
			}
		}
	}

	onMounted(fetchInvoice);
</script>


<style scoped>
	.invoice-wrapper {
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
		border-radius: 18px;
		padding: 3rem 2rem;
		box-shadow: 0 4px 24px #00c48011;
	}

	.page-title {
		color: #00c480;
		font-weight: 700;
		font-size: 2.5rem;
		letter-spacing: 1px;
		margin-bottom: 0;
	}

	/* Loading Styles */
	.loading-section {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 400px;
	}

	.loading-card {
		background: #f4f8fb;
		border-radius: 18px;
		padding: 3rem 2rem;
		text-align: center;
		border: 2px solid #00c48033;
		max-width: 500px;
	}

	.loading-content h4 {
		color: #00c480;
		font-weight: 700;
		margin: 1.5rem 0 1rem 0;
	}

	.loading-content p {
		color: #666;
		font-size: 1.1rem;
		margin: 0;
	}

	.spinner-border.text-primary {
		color: #00c480 !important;
		width: 3rem;
		height: 3rem;
	}

	/* Invoice Items Styles */
	.invoice-items-section {
		background: #fff;
		border-radius: 16px;
		padding: 2rem;
		box-shadow: 0 2px 16px #00c48011;
	}

	.section-title {
		color: #00c480;
		font-weight: 700;
		font-size: 1.5rem;
		letter-spacing: 0.5px;
		margin-bottom: 0;
	}

	.invoice-item-card {
		background: #f4f8fb;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1rem;
		border: 1.5px solid #00c48033;
		transition: box-shadow 0.3s ease;
	}

		.invoice-item-card:hover {
			box-shadow: 0 4px 16px #00c48022;
		}

		.invoice-item-card:last-child {
			margin-bottom: 0;
		}

	.item-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.item-info {
		flex: 1;
	}

	.item-name {
		color: #00c480;
		font-weight: 700;
		font-size: 1.25rem;
		margin: 0 0 0.5rem 0;
		letter-spacing: 0.5px;
	}

	.item-details {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.item-quantity,
	.item-price {
		color: #666;
		font-size: 1rem;
		font-weight: 500;
	}

	.item-quantity {
		background: #e8f5e8;
		color: #00c480;
		padding: 4px 8px;
		border-radius: 6px;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.item-total {
		text-align: right;
	}

	.total-label {
		display: block;
		color: #888;
		font-size: 0.85rem;
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	.total-value {
		color: #00c480;
		font-weight: 700;
		font-size: 1.1rem;
	}

	/* Summary Card Styles */
	.summary-card {
		background: #fff;
		border-radius: 16px;
		padding: 2rem;
		box-shadow: 0 4px 24px #00c48011;
		border: 2px solid #00c48033;
		height: fit-content;
	}

	.summary-title {
		color: #00c480;
		font-weight: 700;
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		letter-spacing: 0.5px;
	}

	.summary-line {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.summary-label {
		color: #222;
		font-weight: 500;
		font-size: 1rem;
	}

	.summary-value {
		color: #222;
		font-weight: 600;
		font-size: 1rem;
	}

	.item-count {
		color: #888;
		font-size: 0.85rem;
	}

	.summary-value.discount {
		color: #e57373;
	}

	.summary-divider {
		border: none;
		height: 2px;
		background: linear-gradient(90deg, #00c480 0%, #42b983 100%);
		margin: 1.5rem 0;
	}

	.total-line {
		margin-bottom: 2rem;
	}

		.total-line .summary-label,
		.total-line .summary-value {
			font-size: 1.3rem;
			font-weight: 700;
			color: #00c480;
		}

	/* Invoice Info Styles */
	.invoice-info {
		background: #f4f8fb;
		border-radius: 12px;
		padding: 1.5rem;
		border: 1.5px solid #00c48033;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

		.info-item:last-child {
			margin-bottom: 0;
		}

	.info-label {
		color: #666;
		font-weight: 500;
		font-size: 0.95rem;
	}

	.info-value {
		color: #222;
		font-weight: 600;
		font-size: 0.95rem;
	}

		.info-value.status {
			padding: 4px 12px;
			border-radius: 20px;
			font-size: 0.85rem;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.5px;
		}

			.info-value.status.pending {
				background: #fff3cd;
				color: #856404;
				border: 1px solid #ffeaa7;
			}

			.info-value.status.completed {
				background: #d4edda;
				color: #155724;
				border: 1px solid #c3e6cb;
			}

			.info-value.status.cancelled {
				background: #f8d7da;
				color: #721c24;
				border: 1px solid #f5c6cb;
			}

	/*Button*/

	.invoice-actions .action-btn {
		width: 100%;
		max-width: 100%;
		font-size: 1.1rem;
		padding: 0.95rem 0;
		border-radius: 8px;
		font-weight: 700;
		letter-spacing: 0.5px;
		margin-bottom: 0.75rem;
		transition: background 0.18s, color 0.18s, box-shadow 0.18s;
		box-shadow: 0 2px 8px #00c48011;
	}

		.invoice-actions .action-btn.accept {
			background: linear-gradient(90deg, #00c480 60%, #42b983 100%);
			color: #fff;
			border: none;
			transition: background 0.18s, color 0.18s, box-shadow 0.18s;
		}

			.invoice-actions .action-btn.accept:hover {
				background: linear-gradient(90deg, #009e6b 60%, #369e6b 100%);
				color: #fff;
				box-shadow: 0 4px 16px #00c48033;
			}

		.invoice-actions .action-btn.secondary {
			background: #fff0f0;
			color: #e57373;
			border: 1.5px solid #e57373;
		}

			.invoice-actions .action-btn.secondary:hover {
				background: #e57373;
				color: #fff;
			}

		.invoice-actions .action-btn.out {
			background: #f4f8fb;
			color: #00c480;
			border: 1.5px solid #00c480;
		}

			.invoice-actions .action-btn.out:hover {
				background: #00c480;
				color: #fff;
			}

	/* Responsive Design */
	@media (max-width: 991.98px) {
		.invoice-wrapper {
			padding: 2rem 1.5rem;
		}

		.page-title {
			font-size: 2rem;
		}

		.summary-card {
			margin-top: 2rem;
		}
	}

	@media (max-width: 767.98px) {
		.invoice-wrapper {
			padding: 1.5rem 1rem;
		}

		.page-title {
			font-size: 1.75rem;
		}

		.item-content {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}

		.item-total {
			text-align: left;
		}

		.item-details {
			justify-content: space-between;
		}

		.loading-card {
			padding: 2rem 1.5rem;
		}

		.summary-card,
		.invoice-items-section {
			padding: 1.5rem;
		}

		.invoice-info {
			padding: 1rem;
		}
	}
</style>
