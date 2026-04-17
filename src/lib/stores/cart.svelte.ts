import { browser } from '$app/environment';
import type { CartItem, ColorOption, Product } from '$lib/types';

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

function sameVariant(
	item: CartItem,
	productId: number,
	size: string | null,
	colorHex: string | null
) {
	return (
		item.productId === productId && item.size === size && (item.color?.hex ?? null) === colorHex
	);
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
		addItem(product: Product, size: string | null, color: ColorOption | null, quantity: number) {
			const existing = items.find((it) => sameVariant(it, product.id, size, color?.hex ?? null));
			if (existing) {
				existing.quantity += quantity;
			} else {
				items.push({
					productId: product.id,
					slug: product.slug,
					name: product.name,
					price: product.price,
					size,
					color,
					quantity
				});
			}
			persist();
		},
		updateQuantity(
			productId: number,
			size: string | null,
			colorHex: string | null,
			quantity: number
		) {
			const item = items.find((it) => sameVariant(it, productId, size, colorHex));
			if (!item) return;
			if (quantity <= 0) {
				items = items.filter((it) => it !== item);
			} else {
				item.quantity = quantity;
			}
			persist();
		},
		removeItem(productId: number, size: string | null, colorHex: string | null) {
			items = items.filter((it) => !sameVariant(it, productId, size, colorHex));
			persist();
		},
		clear() {
			items = [];
			persist();
		}
	};
}

export const cart = createCart();
