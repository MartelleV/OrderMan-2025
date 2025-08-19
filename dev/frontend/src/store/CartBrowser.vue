<template>
	<div class="container py-5">
		<div class="cart-wrapper">
			<h2 class="page-title text-center mb-5">Your Shopping Cart</h2>

			<div v-if="orderItems.length === 0" class="empty-cart-section">
				<div class="empty-cart-card">
					<div class="empty-cart-content">
						<h4>Your cart is empty!</h4>
						<p>Start shopping to add items to your cart!</p>
						<button class="action-btn accept" @click="goToProducts">
							Continue Shopping
						</button>
					</div>
				</div>
			</div>

			<div v-else class="row g-4">
				<!-- Cart Items Section -->
				<div class="col-lg-8">
					<div class="cart-items-section">
						<div
							v-for="item in orderItems"
							:key="item.id"
							class="cart-item-card"
						>
							<div class="item-content">
								<div class="item-info">
									<h5 class="item-name">{{ item.name }}</h5>
									<div class="item-price">
										{{ formatPrice(item.price) }}
									</div>
								</div>
								<div class="item-controls">
									<div class="quantity-section">
										<label class="quantity-label"
											>Quantity:</label
										>
										<input
											type="number"
											min="1"
											:value="item.quantity"
											@input="
												updateQuantity(
													item.id,
													$event.target.value
												)
											"
											class="quantity-input"
										/>
									</div>
									<button
										class="action-btn danger"
										@click="removeItem(item.id)"
									>
										Remove
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Summary Section -->
				<div class="col-lg-4">
					<div class="summary-card">
						<h4 class="summary-title">Order Summary</h4>

						<div class="summary-line">
							<span class="summary-label">
								Subtotal
								<small class="item-count"
									>({{ itemCount }} item(s))</small
								>
							</span>
							<span class="summary-value">{{
								formatPrice(totalPrice)
							}}</span>
						</div>

						<div class="summary-line">
							<span class="summary-label">
								Discount
								<small
									v-if="discountRate > 0"
									class="discount-rate"
								>
									({{ (discountRate * 100).toFixed(1) }}%)
								</small>
							</span>
							<span class="summary-value discount"
								>-{{ formatPrice(discount) }}</span
							>
						</div>

						<div class="summary-line">
							<span class="summary-label">VAT (8%)</span>
							<span class="summary-value">{{
								formatPrice(tax)
							}}</span>
						</div>

						<hr class="summary-divider" />

						<div class="summary-line total-line">
							<span class="summary-label">Total</span>
							<span class="summary-value">{{
								formatPrice(total)
							}}</span>
						</div>

						<div class="action-section">
							<button
								class="action-btn accept w-100 mb-3"
								:disabled="!userRole"
								@click="order"
							>
								Place Order
							</button>

							<div v-if="!userRole" class="login-warning">
								Please sign up or log in
								<strong>as a customer</strong> to complete your
								order.
							</div>

							<button
								class="action-btn secondary w-100"
								@click="goToProducts"
							>
								Continue Shopping
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const orderItems = ref([]);

const discount = ref(0);
const discountRate = ref(0);
const itemCount = ref(0);

const orderId = order.id || order.doc_id;
const discountByCountKey = 'cart-discount-by-count';
const capByCountKey = 'cart-discount-cap-by-count';

const totalPrice = computed(() =>
	orderItems.value.reduce(
		(total, item) => total + item.price * (item.quantity || 1),
		0
	)
);

const tax = computed(() => totalPrice.value * 0.08);

const total = computed(() =>
	Math.max(0, totalPrice.value - discount.value + tax.value)
);

const router = useRouter();

onMounted(fetchOrderItems);

async function fetchOrderItems() {
  try {
    const res = await fetch('http://localhost:3000/api/order', {
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      orderItems.value = normalizeorderItems(data.items);
      updateDiscount();
    } else {
      orderItems.value = [];
      updateDiscount();
    }
  } catch (e) {
    orderItems.value = [];
    updateDiscount();
  }
}

function getDiscountCap(count) {
	return count > 10 ? 0.5 : 0.35;
}
function getPityThreshold(count) {
	return count > 10 ? 20 : 9;
}
function getMinDiscountRate() {
	return 0.05;
}
function getMaxDiscountRate() {
	return 0.29;
}

// Persistent discount mapping
const discountByCount = ref({});
const capByCount = ref({});

function loadDiscountState() {
	const stored = localStorage.getItem(discountByCountKey);
	const capStored = localStorage.getItem(capByCountKey);
	discountByCount.value = stored ? JSON.parse(stored) : {};
	capByCount.value = capStored ? JSON.parse(capStored) : {};
}

function saveDiscountState() {
	localStorage.setItem(
		discountByCountKey,
		JSON.stringify(discountByCount.value)
	);
	localStorage.setItem(capByCountKey, JSON.stringify(capByCount.value));
}

function resetDiscount() {
	discount.value = 0;
	discountRate.value = 0;
	itemCount.value = 0;
	discountByCount.value = {};
	capByCount.value = {};
	saveDiscountState();
}

function rollBetween(a, b) {
	// Always roll between a and b, inclusive of a, exclusive of b
	return Math.random() * (b - a) + a;
}

function calculateDiscountGacha(targetCount) {
	// Maintain cap for each cap range (<=10, >10)
	let prevRate = null;
	let capReached = false;
	let cap = getDiscountCap(targetCount);
	let pity = getPityThreshold(targetCount);

	// Find the last cap reached for this range
	for (let count = 1; count <= targetCount; count++) {
		let thisCap = getDiscountCap(count);
		let thisPity = getPityThreshold(count);

		if (discountByCount.value[count] !== undefined) {
			prevRate = discountByCount.value[count];
			if (prevRate === thisCap) capReached = true;
			continue;
		}

		// If cap already reached in this range, all further counts get cap
		if (capReached) {
			discountByCount.value[count] = thisCap;
			capByCount.value[count] = thisCap;
			prevRate = thisCap;
			continue;
		}

		// Pity: guarantee cap at threshold
		if (
			(count <= 10 && count === thisPity) ||
			(count > 10 && count === thisPity + 10)
		) {
			discountByCount.value[count] = thisCap;
			capByCount.value[count] = thisCap;
			prevRate = thisCap;
			capReached = true;
			continue;
		}

		// For count 1, roll between 5% and 29%
		if (count === 1) {
			const rate = rollBetween(
				getMinDiscountRate(),
				getMaxDiscountRate()
			);
			discountByCount.value[count] = rate;
			capByCount.value[count] = thisCap;
			prevRate = rate;
			continue;
		}

		// For count > 1, roll between previous rate and cap
		const lower = prevRate;
		const upper = thisCap;
		let rate;
		if (lower >= upper) {
			rate = upper;
		} else {
			rate = rollBetween(lower, upper);
		}
		discountByCount.value[count] = rate;
		capByCount.value[count] = thisCap;
		prevRate = rate;
	}
	saveDiscountState();
	return discountByCount.value[targetCount];
}

function updateDiscount() {
	const count = orderItems.value.reduce(
		(sum, item) => sum + (item.quantity || 1),
		0
	);
	itemCount.value = count;
	if (count === 0) {
		resetDiscount();
		return;
	}
	const rate = calculateDiscountGacha(count);
	discountRate.value = rate;
	discount.value = Math.floor(totalPrice.value * rate);
}

function formatPrice(price) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(price);
}

function round2(val) {
	return Math.round((val + Number.EPSILON) * 100) / 100;
}

function updateCartStorage() {
	const cartData = {
		items: orderItems.value,
		subtotal: totalPrice.value,
		discount: discount.value,
		vat: tax.value,
		total: round2(total.value),
	};
	localStorage.setItem('cart', JSON.stringify(cartData));
}

// Ensure all cart items are always in the unified OrderItem format
function normalizeorderItems(items) {
	return (items || []).map(item => ({
		id: item.id,
		name: item.name,
		price: item.price,
		quantity: typeof item.quantity === 'number' ? item.quantity : 1,
	}));
}



// Fetch cart from API
async function fetchCart() {
	try {
		const res = await fetch('http://localhost:3000/api/order', {
			headers: {
				'Content-Type': 'application/json',
				'X-User-Role': userRole.value || '',
			},
		});
		if (res.ok) {
			const data = await res.json();
			const newItems = normalizeorderItems(data.items);
			orderItems.value = newItems;
			loadDiscountState();
			updateDiscount();
			updateCartStorage();
		} else {
			orderItems.value = [];
			resetDiscount();
			updateCartStorage();
		}
	} catch (e) {
		console.error('Failed to fetch cart', e);
		orderItems.value = [];
		resetDiscount();
		updateCartStorage();
	}
}

// Update quantity via API
async function updateQuantity(productId, newQuantity) {
	const quantity = parseInt(newQuantity, 10);
	if (isNaN(quantity) || quantity < 1) return;
	try {
		const res = await fetch('http://localhost:3000/api/order/update', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-User-Role': userRole.value || '',
			},
			body: JSON.stringify({ productId, quantity }),
		});
		if (res.ok) {
			await fetchCart();
		} else {
			await fetchCart();
		}
	} catch (e) {
		console.error('Failed to update quantity', e);
		await fetchCart();
	}
}

// Remove item from cart via API
async function removeItem(productId) {
	try {
		const res = await fetch(
			`http://localhost:3000/api/order/remove/${productId}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'X-User-Role': userRole.value || '',
				},
			}
		);
		if (res.ok) {
			await fetchCart();
		}
	} catch (e) {
		console.error('Failed to remove item', e);
	}
}

async function order() {
	try {
		// Fetch customerId from backend
		const statusRes = await fetch(
			'http://localhost:3000/api/customers/auth/status',
			{
				credentials: 'include',
			}
		);
		const statusData = await statusRes.json();
		const customerId = statusData.id;

		// Build order data
		const orderData = {
			customerId,
			items: normalizeorderItems(orderItems.value),
			totalAmount: total.value,
			status: 'pending',
			orderDate: new Date().toISOString(),
		};

		// Create order via API
		const res = await fetch('http://localhost:3000/api/orders', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(orderData),
		});
		if (!res.ok) {
			alert('Failed to create order.');
			return;
		}
		const order = await res.json();
		

		console.log('Order created, orderId: ' + orderId);
		router.push({ name: 'Order' });
	} catch (e) {
		alert('Failed to create order.');
	}
}

function goToProducts() {
	router.push({ name: 'ProductList' });
}

// Keep userRole in sync if login/logout happens in another tab
window.addEventListener('storage', () => {
	userRole.value = localStorage.getItem('userRole');
});


</script>

<style scoped>
.cart-wrapper {
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

/* Empty Cart Styles */
.empty-cart-section {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 300px;
}

.empty-cart-card {
	background: #f4f8fb;
	border-radius: 18px;
	padding: 3rem 2rem;
	text-align: center;
	border: 2px solid #00c48033;
	max-width: 500px;
}

.empty-cart-content h4 {
	color: #00c480;
	font-weight: 700;
	margin-bottom: 1rem;
}

.empty-cart-content p {
	color: #666;
	margin-bottom: 2rem;
	font-size: 1.1rem;
}

/* Cart Items Styles */
.cart-items-section {
	background: #fff;
	border-radius: 16px;
	padding: 1.5rem;
	box-shadow: 0 2px 16px #00c48011;
}

.cart-item-card {
	background: #f4f8fb;
	border-radius: 12px;
	padding: 1.5rem;
	margin-bottom: 1rem;
	border: 1.5px solid #00c48033;
	transition: box-shadow 0.3s ease;
}

.cart-item-card:hover {
	box-shadow: 0 4px 16px #00c48022;
}

.cart-item-card:last-child {
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

.item-price {
	color: #666;
	font-size: 1.1rem;
	font-weight: 600;
}

.item-controls {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.quantity-section {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.quantity-label {
	color: #222;
	font-weight: 600;
	font-size: 0.9rem;
	letter-spacing: 0.5px;
}

.quantity-input {
	width: 80px;
	padding: 8px 12px;
	border: 1.5px solid #00c48033;
	border-radius: 6px;
	font-size: 1rem;
	font-weight: 600;
	text-align: center;
	background: #ffffff;
	color: #222;
	transition: border-color 0.2s, box-shadow 0.2s;
}

.quantity-input:focus {
	outline: none;
	border-color: #00c480;
	box-shadow: 0 0 0 0.2rem rgba(0, 196, 128, 0.25);
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

.discount-rate {
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

.action-section {
	margin-top: 2rem;
}

.login-warning {
	background: #fff3cd;
	color: #856404;
	border: 1px solid #ffeaa7;
	border-radius: 8px;
	padding: 12px 16px;
	margin-bottom: 1rem;
	font-size: 0.9rem;
	font-weight: 500;
	text-align: center;
}

/* Action Button Styles */
.action-btn {
	font-size: 1rem;
	padding: 12px 24px;
	border-radius: 8px;
	font-weight: 600;
	border: none;
	outline: none;
	transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
	box-shadow: 0 2px 8px #00c48022;
	letter-spacing: 0.5px;
	min-height: 48px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.action-btn.accept {
	background: linear-gradient(90deg, #00c480 60%, #42b983 100%);
	color: #fff;
	border: none;
}

.action-btn.accept:hover:not(:disabled) {
	background: #00b06b;
	color: #fff;
	transform: translateY(-1px);
	box-shadow: 0 4px 12px #00c48033;
}

.action-btn.accept:disabled {
	background: #ccc;
	color: #666;
	cursor: not-allowed;
	transform: none;
	box-shadow: none;
}

.action-btn.secondary {
	background: #f4f8fb;
	color: #00c480;
	border: 1.5px solid #00c48033;
}

.action-btn.secondary:hover {
	background: #00c480;
	color: #fff;
	transform: translateY(-1px);
	box-shadow: 0 4px 12px #00c48033;
}

.action-btn.danger {
	background: #f8f9fa;
	color: #e57373;
	border: 1.5px solid #e5737333;
	padding: 8px 16px;
	font-size: 0.9rem;
	min-height: 36px;
}

.action-btn.danger:hover {
	background: #e57373;
	color: #fff;
	transform: translateY(-1px);
	box-shadow: 0 4px 12px #e5737333;
}

/* Responsive Design */
@media (max-width: 991.98px) {
	.cart-wrapper {
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
	.cart-wrapper {
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

	.item-controls {
		justify-content: space-between;
	}

	.empty-cart-card {
		padding: 2rem 1.5rem;
	}

	.summary-card {
		padding: 1.5rem;
	}
}
</style>
