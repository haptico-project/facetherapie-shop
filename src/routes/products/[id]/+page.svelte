<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fetchProductById } from '$lib/product/ProductFetcher';
	import type { Product } from '$lib/product/Product';
	import ProductComponent from '$lib/components/Product.svelte';

	let product: Product | null = null;
	const id = $page.params.id;

	onMount(async () => {
		product = await fetchProductById(id);
	});
</script>

{#if product}
	<ProductComponent {product} />
{:else}
	<p class="text-center py-24 text-gray-500 font-serif">商品が見つかりませんでした。</p>
{/if}
