<template>
	<div class="price-field">
		<span class="price">{{ formattedPrice }}</span>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	price: {
		type: Number,
		required: true,
	},
});

const formattedPrice = computed(() => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(props.price);
});
</script>

<style>
.price-field {
	font-size: 1.5rem;
	font-weight: bold;
}
</style>
