import { browser } from '$app/environment';
import type { CartItem, ColorOption, Product } from '$lib/types';

const STORAGE_KEY = 'eye-creatures-cart';

function isColorOption(value: unknown): value is ColorOption {
	if (typeof value !== 'object' || value === null) return false;
	const c = value as Record<string, unknown>;
	return typeof c.hex === 'string' && typeof c.label === 'string' && typeof c.imageUrl === 'string';
}

function isCartItem(value: unknown): value is CartItem {
	if (typeof value !== 'object' || value === null) return false;
	const it = value as Record<string, unknown>;
	return (
		typeof it.productId === 'string' &&
		typeof it.slug === 'string' &&
		typeof it.name === 'string' &&
		typeof it.price === 'number' &&
		typeof it.imageUrl === 'string' &&
		(it.size === null || typeof it.size === 'string') &&
		(it.color === null || isColorOption(it.color)) &&
		typeof it.quantity === 'number' &&
		Number.isInteger(it.quantity) &&
		it.quantity > 0
	);
}

// Parse the persisted cart defensively: a stale or corrupt entry (e.g. an older
// CartItem shape) is dropped rather than trusted, which would crash the cart.
function loadInitial(): CartItem[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		const items = parsed.filter(isCartItem);
		if (items.length !== parsed.length) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		}
		return items;
	} catch {
		return [];
	}
}

function sameVariant(
	item: CartItem,
	productId: string,
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
					imageUrl: product.imageUrl,
					size,
					color,
					quantity
				});
			}
			persist();
		},
		updateQuantity(
			productId: string,
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
		removeItem(productId: string, size: string | null, colorHex: string | null) {
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
