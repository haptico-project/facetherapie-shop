import type { Product } from './Product.ts';

export async function fetchProducts(): Promise<Product[]> {
	const res = await fetch('/products/onetime-products.json');
	if (!res.ok) throw new Error('Failed to load products');
	return await res.json();
}

export async function fetchNewProducts(): Promise<Product[]> {
	const all = await fetchProducts();
	return all.filter(p => !p.disabled).filter(p => p.new);
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
	const all = await fetchProducts();
	return all.filter(p => !p.disabled).find(p => p.id === id);
}
