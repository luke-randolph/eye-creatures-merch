import { browser } from '$app/environment';
import type { CartItem, Product } from '$lib/types';

const STORAGE_KEY = 'eye-creatures-cart';

function loadInitial(): CartItem[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as CartItem[]) : [];
	} catch {
		return [];
	}
}

function createCart() {
	let items = $state<CartItem[]>(loadInitial());

	function persist() {
		if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	}

	return {
		get items() {
			return items;
		},
		get totalItems() {
			return items.reduce((sum, it) => sum + it.quantity, 0);
		},
		get subtotal() {
			return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
		},
		addItem(product: Product, size: string | null, quantity: number) {
			const existing = items.find((it) => it.productId === product.id && it.size === size);
			if (existing) {
				existing.quantity += quantity;
			} else {
				items.push({
					productId: product.id,
					slug: product.slug,
					name: product.name,
					price: product.price,
					image: product.image,
					size,
					quantity
				});
			}
			persist();
		},
		updateQuantity(productId: number, size: string | null, quantity: number) {
			const item = items.find((it) => it.productId === productId && it.size === size);
			if (!item) return;
			if (quantity <= 0) {
				items = items.filter((it) => it !== item);
			} else {
				item.quantity = quantity;
			}
			persist();
		},
		removeItem(productId: number, size: string | null) {
			items = items.filter((it) => !(it.productId === productId && it.size === size));
			persist();
		},
		clear() {
			items = [];
			persist();
		}
	};
}

export const cart = createCart();
