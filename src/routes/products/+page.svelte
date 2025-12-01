<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { locale } from '$lib/i18n';
	import { fetchProducts } from '$lib/product/ProductFetcher';
	import type { Product } from '$lib/product/Product';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { get } from 'svelte/store';
	import { agencyCode } from '$lib/agency/agencyCode';

	let currentLocale: 'ja' | 'en' = 'ja';
	$: locale.subscribe(v => currentLocale = v);

	let allProducts: Product[] = [];
	let selectedCategory: string | null = null;

	// カテゴリ一覧（重複なし）
	$: categories = [...new Set(allProducts.map(p => p.category[currentLocale]))];

	// 絞り込み
	$: filtered = selectedCategory
		? allProducts.filter(p => p.category[currentLocale] === selectedCategory)
		: allProducts;

	// クエリパラメータ取得と反映
	onMount(async () => {
		const code = get(agencyCode) as string;
		allProducts = (await fetchProducts()).filter(p => {
			if (p.allowAgencies) {
				return p.allowAgencies.includes(code);
			} else {
				return true
			}
		});

		const query = get(page).url.searchParams;
		const cat = query.get('category');
		if (cat) {
			selectedCategory = cat;
		}
	});

	// URLにクエリを反映
	function updateQuery(category: string | null) {
		const params = new URLSearchParams(get(page).url.searchParams);
		if (category) {
			params.set('category', category);
		} else {
			params.delete('category');
		}
		goto(`?${params.toString()}`, { replaceState: true });
		selectedCategory = category;
	}
</script>

<div class="max-w-7xl mx-auto px-4 mt-4 md:py-12 sm:py-4 font-serif text-textColor">

	<h1 class="text-2xl font-light mb-6">
		{currentLocale === 'ja' ? '商品一覧' : 'All Products'}
	</h1>

	<!-- ✅ カテゴリ選択 -->
	<div class="flex flex-wrap gap-3 mb-10">
		<button
			class="px-4 py-2 text-sm border rounded hover:bg-color1 transition {selectedCategory === null ? 'bg-color1 text-white' : ''}"
			on:click={() => updateQuery(null)}
		>
			{currentLocale === 'ja' ? 'すべて' : 'All'}
		</button>

		{#each categories as cat}
			<button
				class="px-4 py-2 text-sm border rounded hover:bg-color1 transition {selectedCategory === cat ? 'bg-color1 text-white' : ''}"
				on:click={() => updateQuery(cat)}
			>
				{cat}
			</button>
		{/each}
	</div>

	<!-- ✅ 商品一覧 -->
	{#if filtered.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			{#each filtered as product}
				<ProductCard {product} {currentLocale} />
			{/each}
		</div>
	{:else}
		<p class="text-sm text-gray-500">
			{currentLocale === 'ja' ? '該当する商品がありません。' : 'No products found.'}
		</p>
	{/if}
</div>
