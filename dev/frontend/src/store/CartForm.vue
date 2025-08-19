<template>
	<div class="cart-form-wrapper">
		<div class="cart-form-card">
			<h2 class="cart-title">Your Shopping Cart</h2>

			<!-- Hide cart content for accountant -->
			<div v-if="userRole === 'accountant'" class="empty-cart">
				<div class="empty-cart-content">
					<p>Accountants cannot access the cart.</p>
				</div>
			</div>

			<div v-else-if="orderItems.length === 0" class="empty-cart">
				<div class="empty-cart-content">
					<p>Your cart is currently empty!</p>
				</div>
			</div>

			<div v-else class="cart-content">
				<div class="cart-items">
					<div
						v-for="item in orderItems"
						:key="item.id"
						class="cart-item"
					>
						<div class="item-product">
							<ProductForm
								:product="item"
								:showAddToOrder="false"
							/>
						</div>
						<div class="item-details">
							<div class="item-price">
								<PriceField :price="item.price" />
							</div>
							<div class="item-quantity">
								<span class="quantity-label">Quantity:</span>
								<span class="quantity-value">{{
									item.quantity
								}}</span>
							</div>
						</div>
					</div>
				</div>

				<div class="cart-total">
					<div class="total-section">
						<h3 class="total-label">Total:</h3>
						<div class="total-price">{{ totalPrice }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ProductForm from '../product/ProductForm.vue';
import PriceField from '../product/PriceField.vue';
import { useRouter } from 'vue-router';

const orderItems = ref([]);
const router = useRouter();
const userRole = localStorage.getItem('userRole') || '';

// Ensure all cart items are always in the unified OrderItem format
function normalizeorderItems(items) {
	return (items || []).map(item => ({
		id: item.id,
		name: item.name,
		price: item.price,
		quantity: typeof item.quantity === 'number' ? item.quantity : 1,
	}));
}

async function fetchCart() {
	if (userRole === 'accountant') return;
	try {
		const res = await fetch('http://localhost:3000/api/cart', {
			headers: {
				'Content-Type': 'application/json',
				'X-User-Role': userRole.valueOf || '', // Ensure role is sent
			},
		});
		if (res.ok) {
			const data = await res.json();
			orderItems.value = normalizeorderItems(data.items);
		} else {
			orderItems.value = [];
		}
	} catch (e) {
		console.error('Failed to fetch cart', e);
		orderItems.value = [];
	}
}

onMounted(fetchCart);
</script>

<style scoped>
.cart-form-wrapper {
	padding: 2rem 0;
}

.cart-form-card {
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
	border-radius: 18px;
	padding: 2.5rem 2rem;
	box-shadow: 0 4px 24px #00c48011;
	border: 2px solid #00c48033;
}

.cart-title {
	color: #00c480;
	font-weight: 700;
	font-size: 2rem;
	letter-spacing: 1px;
	margin-bottom: 2rem;
	text-align: center;
}

/* Empty Cart Styles */
.empty-cart {
	text-align: center;
	padding: 3rem 2rem;
}

.empty-cart-content {
	background: #f4f8fb;
	border-radius: 12px;
	padding: 2rem;
	border: 1.5px solid #00c48033;
}

.empty-cart-content p {
	color: #666;
	font-size: 1.1rem;
	font-weight: 500;
	margin: 0;
}

/* Cart Content Styles */
.cart-content {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.cart-items {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.cart-item {
	background: #fff;
	border-radius: 16px;
	padding: 1.5rem;
	box-shadow: 0 2px 16px #00c48011;
	border: 1.5px solid #00c48033;
	display: flex;
	gap: 1.5rem;
	align-items: center;
	transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.cart-item:hover {
	box-shadow: 0 4px 24px #00c48022;
	transform: translateY(-2px);
}

.item-product {
	flex: 0 0 250px;
}

.item-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding-left: 1rem;
}

.item-price {
	background: #f4f8fb;
	border-radius: 8px;
	padding: 1rem;
	text-align: center;
	border: 1.5px solid #00c48033;
}

.item-quantity {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	background: #f4f8fb;
	border-radius: 8px;
	padding: 1rem;
	border: 1.5px solid #00c48033;
}

.quantity-label {
	color: #222;
	font-weight: 600;
	font-size: 1.1rem;
	letter-spacing: 0.5px;
}

.quantity-value {
	color: #00c480;
	font-weight: 700;
	font-size: 1.2rem;
	background: #fff;
	padding: 8px 16px;
	border-radius: 6px;
	border: 1.5px solid #00c48033;
	min-width: 60px;
	text-align: center;
}

/* Total Section Styles */
.cart-total {
	background: #fff;
	border-radius: 16px;
	padding: 2rem;
	box-shadow: 0 4px 24px #00c48011;
	border: 2px solid #00c48033;
}

.total-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.total-label {
	color: #00c480;
	font-weight: 700;
	font-size: 1.5rem;
	letter-spacing: 0.5px;
	margin: 0;
}

.total-price {
	color: #00c480;
	font-weight: 700;
	font-size: 2rem;
	letter-spacing: 1px;
	background: linear-gradient(135deg, #d2f4ea 0%, #e8f5e8 100%);
	padding: 1rem 2rem;
	border-radius: 12px;
	border: 2px solid #00c48033;
}

/* Responsive Design */
@media (max-width: 991.98px) {
	.cart-form-card {
		padding: 2rem 1.5rem;
	}

	.cart-title {
		font-size: 1.75rem;
	}

	.item-product {
		flex: 0 0 200px;
	}
}

@media (max-width: 767.98px) {
	.cart-form-card {
		padding: 1.5rem 1rem;
	}

	.cart-title {
		font-size: 1.5rem;
	}

	.cart-item {
		flex-direction: column;
		align-items: stretch;
		gap: 1rem;
	}

	.item-product {
		flex: none;
	}

	.item-details {
		padding-left: 0;
	}

	.total-section {
		flex-direction: column;
		gap: 1rem;
		text-align: center;
	}

	.total-price {
		font-size: 1.5rem;
		padding: 0.75rem 1.5rem;
	}
}
</style>
