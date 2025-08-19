<template>
	<div class="container py-5">
		<div class="product-list-wrapper">
			<h1 class="page-title text-center mb-5">Product List</h1>
			<div class="row g-4">
				<div
					class="col-lg-4 col-md-6 col-sm-12 d-flex"
					v-for="product in products"
					:key="product.id"
				>
					<router-link
						:to="{
							name: 'ProductDetail',
							params: { id: product.id },
						}"
						class="text-decoration-none w-100"
					>
						<ProductForm
							:product="product"
							:showAddToCart="false"
						/>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductForm from './ProductForm.vue';

const products = ref([]);

const fetchProducts = async () => {
	try {
		const res = await fetch('http://localhost:3000/api/products');
		products.value = await res.json();
	} catch (e) {
		console.error('Failed to fetch products', e);
		products.value = [];
	}
};

function addToCart(product) {
	alert('Added to cart!');
}

onMounted(fetchProducts);
</script>

<style scoped>
.product-list-wrapper {
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
	border-radius: 18px;
	padding: 3rem 2rem;
	box-shadow: 0 4px 24px #00c48011;
}

.page-title {
	color: #00c480;
	font-weight: 700;
	font-size: 3rem;
	letter-spacing: 1px;
	margin-bottom: 0;
}

.row.g-4 {
	margin: 0;
}

.col-lg-4,
.col-md-6,
.col-sm-12 {
	padding: 0.75rem;
}

.col-lg-4.d-flex,
.col-md-6.d-flex,
.col-sm-12.d-flex {
	align-items: stretch;
}

.text-decoration-none {
	color: inherit;
	transition: color 0.3s ease;
}

.text-decoration-none:hover {
	color: inherit;
}

@media (max-width: 991.98px) {
	.product-list-wrapper {
		padding: 2rem 1.5rem;
	}

	.page-title {
		font-size: 2.5rem;
	}
}

@media (max-width: 767.98px) {
	.product-list-wrapper {
		padding: 1.5rem 1rem;
	}

	.page-title {
		font-size: 2rem;
	}

	.col-lg-4,
	.col-md-6,
	.col-sm-12 {
		padding: 0.5rem;
	}
}
</style>
