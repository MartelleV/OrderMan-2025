	<template>
		<div v-if="product && product.id" class="container py-5">
			<div class="card product-detail-card shadow-sm border-0">
				<div class="card-body">
					<div class="row g-5 align-items-start">
						<!-- Product Image -->
						<div
							class="col-md-6 d-flex justify-content-center align-items-center"
						>
							<div class="image-container">
								<img
									:src="product.image"
									alt="Product Image"
									class="product-detail-img"
								/>
							</div>
						</div>

						<!-- Product Details -->
						<div class="col-md-6 product-info">
							<h2 class="product-name mb-4">{{ product.name }}</h2>
							<div class="product-description mb-4">
								<p class="description-text">
									{{ product.description }}
								</p>
							</div>

							<!-- Price -->
							<div class="price-section mb-4">
								<PriceField
									:price="product.price"
									class="product-price"
								/>
							</div>

							<!-- Quantity Input (hide for accountant) -->
							<div
								class="quantity-section mb-4"
								v-if="userRole !== 'accountant'"
							>
								<label class="quantity-label">Quantity:</label>
								<div class="quantity-input-wrapper">
									<input
										type="number"
										v-model.number="quantity"
										min="1"
										class="quantity-input"
									/>
								</div>
							</div>

							<!-- Alert -->
							<div id="liveAlertPlaceholder" class="my-3"></div>

							<!-- Add to Cart Button (hide for accountant) -->
							<div
								class="action-section"
								v-if="userRole !== 'accountant'"
							>
								<button
									class="action-btn accept"
									@click="addToOrder"
								>
									Add to Order
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		<div class="container text-center py-5" v-else>
			<div class="loading-wrapper">
				<div class="spinner-border loading-spinner" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
				<p class="loading-text mt-3">Loading product details...</p>
			</div>
		</div>
	</template>

	<script setup>
	import { ref, onMounted } from 'vue';
	import { useRoute } from 'vue-router';
	import PriceField from '../product/PriceField.vue';

	// State
	const route = useRoute();
	const product = ref({});
	const quantity = ref(1);
	const userRole = ref(localStorage.getItem('userRole') || '');

	// Fetch product details from API
	const fetchProductDetails = async () => {
		const productId = route.params.id;
		try {
			const res = await fetch(
				`http://localhost:3000/api/products/${productId}`
			);
			if (res.ok) {
				product.value = await res.json();
			} else {
				product.value = {};
			}
		} catch (e) {
			console.error('Failed to fetch product details', e);
			product.value = {};
		}
	};

	// Add to cart via API
	function normalizeOrderItem(product, quantity) {
		return {
			id: product.id,
			name: product.name,
			price: product.price,
			quantity: typeof quantity === 'number' ? quantity : 1,
		};
	}

	function addToOrder() {
  if (product.value && product.value.id) {
    // Get current cart from localStorage
    let orderItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
    // Check if product already exists
    const idx = orderItems.findIndex(item => item.id === product.value.id);
    if (idx !== -1) {
      orderItems[idx].quantity += quantity.value;
    } else {
      orderItems.push({
        id: product.value.id,
        name: product.value.name,
        price: product.value.price,
        quantity: quantity.value
      });
    }
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
      alert('Added to order!');
  }
}	
	

	onMounted(fetchProductDetails);
	</script>

	<style scoped>
	.product-detail-card {
		border-radius: 18px;
		background: #fff;
		box-shadow: 0 4px 24px #00c48011;
		overflow: hidden;
	}

	.card-body {
		padding: 3rem 2.5rem;
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
	}

	.image-container {
		width: 100%;
		max-width: 500px;
		position: relative;
		overflow: hidden;
		border-radius: 16px;
		box-shadow: 0 8px 32px #00c48022;
		background: linear-gradient(135deg, #ffffff 0%, #f4f8fb 100%);
	}

	.product-detail-img {
		width: 100%;
		height: auto;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.image-container:hover .product-detail-img {
		transform: scale(1.05);
	}

	.product-info {
		padding-left: 2rem;
	}

	.product-name {
		color: #00c480;
		font-weight: 700;
		font-size: 2.5rem;
		letter-spacing: 1px;
		line-height: 1.2;
	}

	.product-description {
		background: #f4f8fb;
		border-radius: 12px;
		padding: 1.5rem;
		border-left: 4px solid #00c480;
	}

	.description-text {
		color: #555;
		font-size: 1.1rem;
		line-height: 1.6;
		margin: 0;
	}

	.price-section {
		background: linear-gradient(135deg, #d2f4ea 0%, #e8f5e8 100%);
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;
		border: 2px solid #00c48033;
	}

	.product-price {
		font-size: 2rem !important;
		font-weight: 700 !important;
		color: #00c480 !important;
		letter-spacing: 1px;
	}

	.quantity-section {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: #f4f8fb;
		border-radius: 12px;
		padding: 1.5rem;
		border: 1.5px solid #00c48033;
	}

	.quantity-label {
		color: #222;
		font-weight: 600;
		font-size: 1.1rem;
		margin: 0;
		letter-spacing: 0.5px;
	}

	.quantity-input-wrapper {
		flex: 0 0 120px;
	}

	.quantity-input {
		width: 100%;
		padding: 12px 16px;
		border: 1.5px solid #00c48033;
		border-radius: 8px;
		font-size: 1.1rem;
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

	.action-section {
		text-align: left;
	}

	.action-btn {
		font-size: 1.2rem;
		padding: 16px 32px;
		border-radius: 8px;
		font-weight: 600;
		border: none;
		outline: none;
		transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
		box-shadow: 0 4px 16px #00c48022;
		letter-spacing: 0.5px;
		min-height: 56px;
		min-width: 200px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.action-btn.accept {
		background: linear-gradient(90deg, #00c480 60%, #42b983 100%);
		color: #fff;
		border: none;
	}

	.action-btn.accept:hover {
		background: #00b06b;
		color: #fff;
		transform: translateY(-2px);
		box-shadow: 0 6px 24px #00c48033;
	}

	.loading-wrapper {
		padding: 4rem 2rem;
	}

	.loading-spinner {
		color: #00c480;
		width: 3rem;
		height: 3rem;
	}

	.loading-text {
		color: #666;
		font-size: 1.1rem;
		font-weight: 500;
	}

	@media (max-width: 991.98px) {
		.card-body {
			padding: 2rem 1.5rem;
		}

		.product-info {
			padding-left: 0;
			margin-top: 2rem;
		}

		.product-name {
			font-size: 2rem;
			text-align: center;
		}

		.price-section {
			margin-bottom: 2rem;
		}

		.action-section {
			text-align: center;
		}
	}

	@media (max-width: 767.98px) {
		.card-body {
			padding: 1.5rem 1rem;
			background: none;
		}

		.product-detail-card {
			border-radius: 0;
			box-shadow: none;
			background: none;
		}

		.image-container {
			width: 100%;
			max-width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 1.5rem;
			padding: 0 1rem;
		}

		.product-detail-img {
			width: 100%;
			max-width: 280px;
			height: auto;
			object-fit: contain;
			position: static;
			transform: none !important;
		}

		.product-info {
			padding-left: 0;
			margin-top: 0;
			padding: 0 1rem;
			text-align: center;
		}

		.product-name {
			font-size: 1.75rem;
			text-align: center;
		}

		.product-description {
			background: #f4f8fb;
			border-radius: 12px;
			padding: 1rem;
			border-left: 4px solid #00c480;
			margin-bottom: 1rem;
			text-align: left;
		}

		.description-text {
			color: #555;
			font-size: 1rem;
			line-height: 1.5;
			margin: 0;
		}

		.price-section {
			padding: 1rem;
			border-radius: 12px;
			border: 2px solid #00c48033;
			margin-bottom: 1.25rem;
		}

		.product-price {
			font-size: 1.5rem !important;
			font-weight: 700 !important;
			color: #00c480 !important;
			letter-spacing: 0.5px;
		}

		.quantity-section {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.75rem;
			background: #f4f8fb;
			border-radius: 12px;
			padding: 1rem;
			border: 1.5px solid #00c48033;
			margin-bottom: 1rem;
		}

		.quantity-label {
			color: #222;
			font-weight: 600;
			font-size: 1rem;
			margin-bottom: 0.25rem;
			text-align: center;
		}

		.quantity-input-wrapper {
			width: 100%;
			max-width: 200px;
		}

		.quantity-input {
			width: 100%;
			padding: 12px 16px;
			border: 1.5px solid #00c48033;
			border-radius: 8px;
			font-size: 1.1rem;
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

		.action-section {
			text-align: center;
			margin-top: 1rem;
			padding-bottom: 1rem;
		}

		.action-btn {
			font-size: 1rem;
			padding: 14px 24px;
			min-height: 48px;
			width: 100%;
			max-width: 300px;
		}
	}
	</style>
