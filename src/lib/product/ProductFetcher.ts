import type { Product } from './Product.ts';

export async function fetchProducts(): Promise<Product[]> {
	const res1 = await fetch('/products/onetime/kaorhythm-products.json');
	if (!res1.ok) throw new Error('Failed to load products');

	const res2 = await fetch('/products/onetime/drai-products.json');
	if (!res2.ok) throw new Error('Failed to load products');

	const res3 = await fetch('/products/onetime/drai-haru-products.json');
	if (!res3.ok) throw new Error('Failed to load products');

	const res4 = await fetch('/products/onetime/common-products.json');
	if (!res4.ok) throw new Error('Failed to load products');

	const [data1, data2, data3, data4] = await Promise.all([res1.json(), res2.json(), res3.json(), res4.json()]);

	// dr AI は除外
	const merged = [...data1, ...data3, ...data4]; // 配列として結合

	return merged;
}

export async function fetchNewProducts(): Promise<Product[]> {
	const all = await fetchProducts();
	return all.filter(p => !p.disabled).filter(p => p.new);
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
	const all = await fetchProducts();
	return all.filter(p => !p.disabled).find(p => p.id === id);
}
