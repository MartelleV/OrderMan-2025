<template>
	<!-- Index -->
	<div class="text-dark">
		<div class="container my-5 p-5 rounded-5 bg-white">
			<div class="row d-flex align-items-center">
				<div class="col-lg-4">
					<h2>Ecom Website</h2>
					<h3>Everything You Need, All in One Place.</h3>
					<p class="mt-5">
						From everyday essentials to trending finds, we’ve got
						what you’re looking for. Easy shopping, fast shipping,
						no hassle.
					</p>
				</div>
				<div class="col-lg-8">
					<img
						src="/images/undraw_web-shopping_xd5k.svg"
						alt="heroimg"
						class="mx-auto d-block w-75"
					/>
				</div>
			</div>
		</div>
	</div>
	<!-- Browser -->
	<div class="row">
		<div class="col-12">
			<ProductBrowser />
		</div>
	</div>
</template>

<script setup>
import ProductBrowser from './ProductBrowser.vue';
</script>

<style scoped></style>
