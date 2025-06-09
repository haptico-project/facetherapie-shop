import { writable } from 'svelte/store';
import type { Product } from '$lib/product/Product';

export interface CartItem extends Product {
	quantity: number;
}

function createCart() {
	const key = 'cartItems';
	const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;

	const initial: CartItem[] = stored ? JSON.parse(stored) : [];
	const { subscribe, set, update } = writable<CartItem[]>(initial);

	// ✅ 自動で localStorage に保存
	subscribe((items) => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(key, JSON.stringify(items));
		}
	});

	return {
		subscribe,

		// ✅ カートに追加（重複時は個数＋1）
		add(product: Product) {
			update((items) => {
				const existing = items.find((i) => i.id === product.id);
				if (existing) {
					return items.map((i) =>
						i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
					);
				}
				return [...items, { ...product, quantity: 1 }];
			});
		},

		// ✅ 商品を削除
		remove(id: string) {
			update((items) => items.filter((item) => item.id !== id));
		},

		// ✅ カートを空に
		clear() {
			set([]);
		},

		// ✅ 数量の明示的更新
		updateQuantity(id: string, quantity: number) {
			update((items) =>
				items.map((item) =>
					item.id === id ? { ...item, quantity } : item
				)
			);
		}
	};
}

export const cart = createCart();
