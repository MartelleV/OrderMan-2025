<template>
	<div class="card h-100 product-card border-0">
		<div class="img-wrapper">
			<img
				:src="product.image"
				class="card-img-top product-img"
				alt="Product Image"
			/>
		</div>
		<div class="card-body d-flex flex-column">
			<h5 class="card-title product-name">{{ product.name }}</h5>
			<div class="mt-auto price-section">
				<PriceField :price="product.price" class="product-price" />
			</div>
		</div>
		<div class="card-footer" v-if="showAddToCart && userRole !== 'accountant'">
			<button class="action-btn accept w-100" @click.stop="onAddToCart">
				Add to Cart
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import PriceField from './PriceField.vue';

const props = defineProps({
	product: {
		type: Object,
		required: true,
	},
	showAddToCart: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['add-to-cart']);

const userRole = computed(() => localStorage.getItem('userRole'));

function onAddToCart(event) {
	emit('add-to-cart', props.product);
}
</script>

<style scoped>
.product-card {
	border-radius: 18px;
	background: #fff;
	box-shadow: 0 4px 24px #00c48011;
	overflow: hidden;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.product-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 32px #00c48022;
}

.img-wrapper {
	width: 100%;
	height: 400px;
	position: relative;
	overflow: hidden;
	background: white;
}

.product-img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.3s ease;
}

.product-card:hover .product-img {
	transform: scale(1.1);
}

.card-body {
	background: #f8f9fa;
	padding: 1.5rem;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.product-name {
	color: black;
	font-weight: 700;
	font-size: 1.25rem;
	letter-spacing: 0.5px;
	margin: 0 0 1rem 0;
	line-height: 1.3;
}

.price-section {
	background: #f4f8fb;
	border-radius: 8px;
	padding: 0.75rem;
	text-align: center;
	border: 1.5px solid #00c48033;
	margin-top: auto;
}

.product-price {
	font-size: 1.25rem !important;
	font-weight: 700 !important;
	color: #00c480 !important;
	letter-spacing: 0.5px;
}

.card-footer {
	background: transparent;
	border: none;
	padding: 1.5rem;
}

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
}

.action-btn.accept {
	background: linear-gradient(90deg, #00c480 60%, #42b983 100%);
	color: #fff;
	border: none;
}

.action-btn.accept:hover {
	background: #00b06b;
	color: #fff;
	transform: translateY(-1px);
	box-shadow: 0 4px 12px #00c48033;
}

@media (max-width: 767.98px) {
	.card-body {
		padding: 1rem;
		text-align: center;
	}

	.img-wrapper {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem 0;
	}

	.product-img {
		width: 200px;
		height: auto;
		object-fit: contain;
		position: static; /* Important to remove absolute positioning */
		transform: none !important; /* Prevent hover zoom bug on mobile */
	}

	.card-body {
		padding: 1rem;
	}

	.card-footer {
		padding: 1rem;
	}

	.product-name {
		font-size: 1.1rem;
	}

	.product-name,
	.product-price {
		text-align: center;
	}
}
</style>
