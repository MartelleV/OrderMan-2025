import { reactive, watch } from 'vue';

// Ensure all cart items are always in the unified OrderItem format
function normalizeorderItems(items) {
	return (items || []).map(item => ({
		id: item.id,
		name: item.name,
		price: item.price,
		quantity: typeof item.quantity === 'number' ? item.quantity : 1,
	}));
}

// Load cart from localStorage if available
function loadCart() {
	const saved = localStorage.getItem('cart');
	if (saved) {
		try {
			const parsed = JSON.parse(saved);
			const cart = new Cart();
			cart.items = normalizeorderItems(parsed.items);
			cart.totalPrice = parsed.totalPrice || 0;
			return cart;
		} catch {
			// fallback to empty cart
		}
	}
	return new Cart();
}

export const cartModel = reactive(loadCart());

// Save cart to localStorage whenever it changes
watch(
	() => cartModel.items,
	() => {
		localStorage.setItem(
			'cart',
			JSON.stringify({
				items: normalizeorderItems(cartModel.items),
				totalPrice: cartModel.items.reduce(
					(total, item) => total + item.price * (item.quantity || 1),
					0
				),
			})
		);
	},
	{ deep: true }
);
